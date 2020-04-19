import * as socketio from "socket.io";
import { ServerEvent, ClientEvent, IInitialDataPackage } from "../../shared/definitions/socketIODefinitions";
import { Server } from "http";
import { bind } from "bind-decorator";
import { data } from "./db";
import { config, times } from "../../shared/definitions/mixed";
import { actions } from "../../shared/definitions/mixed";
import { ILogLine } from '../../shared/definitions/databaseInterfaces';

const EVENT_CONNECTION = "connection";
const EVENT_DISCONNECT = "disconnect";

const TICK_S = 0.1;

export class GameServer {
    private io: socketio.Server;
    private playerCount: number = 0;
    private lastLogLines: ILogLine[] = [];
    private lastChatLines: ILogLine[] = [];

    public start(server: Server) {
        this.io = socketio(server);
        this.io.on(EVENT_CONNECTION, this.onConnection);

        this.tickLoop();
    }

    @bind
    private async onConnection(socket: socketio.Socket) {
        let playerName = socket.handshake.query.playerName;

        console.log("Client connected: " + socket.id + " (" + playerName + ")");

        this.playerCount++;

        const initialDataPackage: IInitialDataPackage = {
            data,
            lastLogLines: this.lastLogLines,
            lastChatLines: this.lastChatLines,
            playerCount: this.playerCount
        };

        socket.emit(ServerEvent.initialDataPackage, initialDataPackage);
        this.io.emit(ServerEvent.updatePlayerCount, this.playerCount);

        if (this.playerCount > data.recordPlayersOnline) {
            data.recordPlayersOnline = this.playerCount;
            this.emitDataToAll();
        }

        this.logAction(playerName, ` wanders out of the darkness and sits near the fire.`);

        // tslint:disable-next-line: no-empty
        socket.on(EVENT_DISCONNECT, () => {
            console.log("Client disconnected: " + socket.id + " (" + playerName + ")");
            this.playerCount--;
            this.io.emit(ServerEvent.updatePlayerCount, this.playerCount);
            this.logAction(playerName, ` gets up and wanders into the darkness again.`);
        });

        socket.on(ClientEvent.changeName, (newName: string) => {
            this.logNameChange(newName, playerName);
            playerName = newName;
        });

        socket.on(ClientEvent.sendChatLine, (text: string) => {
            this.logChatLine(playerName, text);
        });

        let requestRunning = false;

        socket.on(ClientEvent.doAction, (actionId, callback) => {
            if (requestRunning) {
                console.log("Can't execute; request running");
                callback();
                return;
            }

            requestRunning = true;
            if (!this.actionPre(playerName, actionId)) {
                callback();
                return;
            }

            this.emitDataToAll();

            setTimeout(() => {
                this.actionExecute(playerName, actionId);
                this.emitDataToAll();
                requestRunning = false;
                callback();
            }, times[actionId] * 1000);
        });
    }

    @bind
    private actionPre(playerName, actionId) {
        switch (actionId) {
            case actions.Stoke:
                if (data.woodNearFire >= config.FireStokeWoodCount) {
                    data.woodNearFire -= config.FireStokeWoodCount;
                    if (data.fireSize === 0) {
                        data.fireStart = Date.now();
                        data.recordFiresStarted++;
                        this.logAction(playerName, ` uses 1 wood to start the fire.`);
                    } else {
                        this.logAction(playerName, ` puts 1 wood into the fire.`);
                    }
                    data.fireSize += config.FireStoke;
                    data.recordFireSize = Math.max(data.recordFireSize, data.fireSize);
                    return true;
                }
                return true;

            case actions.TransportWood:
                if (data.woodInForest >= config.TransportWoodCount) {
                    this.logAction(playerName, ` shoulders ${config.TransportWoodCount} wood from the forest.`);
                    data.woodInForest -= config.TransportWoodCount;
                    return true;
                }
                break;

            case actions.ChopTree:
                if (data.trees >= 1) {
                    this.logAction(playerName, ` starts chopping down a tree.`);
                    data.trees -= 1;
                    return true;
                }
                break;

            case actions.PlantTree:
                this.logAction(playerName, ` plants a new tree, and watches in amazement as it grows. Don't count on them in the next ${times[actions.PlantTree] / 60} minutes.`);
                return true;
        }

        return false;
    }

    @bind
    private actionExecute(playerName, actionId) {
        switch (actionId) {
            case actions.Stoke:
                break;

            case actions.TransportWood:
                this.logAction(playerName, ` puts down ${config.TransportWoodCount} wood next to the fire.`);
                data.woodNearFire += config.TransportWoodCount;
                break;

            case actions.ChopTree:
                this.logAction(playerName, ` chopped down the tree into small bits, leaving ${config.ChopTreeWoodResult} wood pieces in the forest.`);
                data.woodInForest += config.ChopTreeWoodResult;
                break;

            case actions.PlantTree:
                this.logAction(playerName, `'s tree has fully grown.`);
                data.trees++;
                data.recordTrees = Math.max(data.recordTrees, data.trees);
                break;
        }
    }

    @bind
    private emitDataToAll() {
        this.io.emit(ServerEvent.updateData, data);
    }

    @bind
    private logAction(playerName: string, action: string) {
        const logLine: ILogLine = {
            playerName,
            text: action
        };
        this.lastLogLines.push(logLine);
        while (this.lastLogLines.length > 10) {
            this.lastLogLines.shift();
        }
        this.io.emit(ServerEvent.addLogLine, logLine);
    }

    @bind
    private logSystemMessage(action: string) {
        this.logAction("", action);
    }

    @bind
    private logNameChange(newPlayerName: string, oldPlayerName: string) {
        this.logAction(newPlayerName, ` was previously known as "${oldPlayerName}".`)
        this.logChatLine(newPlayerName, `I grew tired of my old name, "${oldPlayerName}".`);
    }

    @bind
    private logChatLine(playerName: string, text: string) {
        const logLine: ILogLine = {
            playerName,
            text: ` says: "${text}"`
        };
        this.lastChatLines.push(logLine);
        while (this.lastChatLines.length > 10) {
            this.lastChatLines.shift();
        }
        this.io.emit(ServerEvent.addChatLine, logLine);
    }

    @bind
    private tickLoop() {
        const now = Date.now();
        while (data.lastTick < now) {
            data.lastTick += TICK_S * 1000;
            this.tick();
        }

        this.emitDataToAll();

        setTimeout(this.tickLoop, TICK_S * 1000);
    }

    private tick() {
        if (data.fireSize === 0)
            return;

        data.fireSize = Math.max(0, data.fireSize - TICK_S * config.FireShrinkPerSecond);

        if (data.fireSize === 0) {
            const timeBurningMS = data.lastTick - data.fireStart;
            data.recordFireTimeMS = Math.max(data.recordFireTimeMS, timeBurningMS);
            this.logSystemMessage("The fire has burned down.");
        }
    }
}