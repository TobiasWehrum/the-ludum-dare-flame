import * as socketio from "socket.io";
import { ServerEvent, ClientEvent, IInitialDataPackage } from "../../shared/definitions/socketIODefinitions";
import { Server } from "http";
import { bind } from "bind-decorator";
import { data } from "./db";
import { config, times, fireGrowthPerSecond, fireBurnPerSecond, getFireSizeDescriptor } from "../../shared/definitions/mixed";
import { actions } from "../../shared/definitions/mixed";
import { ILogLine } from "../../shared/definitions/databaseInterfaces";
import { msToTimeString } from '../../shared/utils/utils';

const EVENT_CONNECTION = "connection";
const EVENT_DISCONNECT = "disconnect";

const TICK_S = 0.1;

export class GameServer {
    private io: socketio.Server;
    private playerCount: number = 0;
    private lastLogLines: ILogLine[] = [];
    private lastChatLines: ILogLine[] = [];
    private fireSizeDescriptor: string;

    public start(server: Server) {
        this.io = socketio(server);
        this.io.on(EVENT_CONNECTION, this.onConnection);

        this.tickLoop();
    }

    @bind
    private async onConnection(socket: socketio.Socket) {
        let queuedAction: string = "";
        let queuedTimeout: NodeJS.Timeout = null;

        let playerName = socket.handshake.query.playerName;

        console.log("Client connected: " + socket.id + " (" + playerName + ")");

        this.playerCount++;
        data.totalPlayers++;

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
        }

        this.emitDataToAll();

        this.logBoth(playerName, ` appears out of the darkness and sits near the fire.`);

        // tslint:disable-next-line: no-empty
        socket.on(EVENT_DISCONNECT, () => {
            console.log("Client disconnected: " + socket.id + " (" + playerName + ")");
            this.playerCount--;
            this.io.emit(ServerEvent.updatePlayerCount, this.playerCount);

            if (queuedTimeout) {
                clearTimeout(queuedTimeout);
                queuedTimeout = null;
                this.actionCancel(playerName, queuedAction);
            }

            this.logBoth(playerName, ` gets up and wanders into the darkness again.`);
        });

        socket.on(ClientEvent.changeName, (newName: string) => {
            if (newName.length > 20) {
                newName = newName.slice(0, 20);
            }
            this.logNameChange(newName, playerName);
            playerName = newName;
        });

        socket.on(ClientEvent.sendChatLine, (text: string) => {
            this.logChatLine(playerName, ` says: "${text}"`);
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

            data.totalActionsTaken++;

            this.emitDataToAll();

            queuedAction = actionId;
            queuedTimeout = setTimeout(() => {
                queuedAction = null;
                queuedTimeout = null;
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
            case actions.Stoke1:
            case actions.Stoke10:
            case actions.Stoke100:
                const count =
                    (actionId === actions.Stoke1) ? config.FireStoke1WoodCount :
                        (actionId === actions.Stoke10) ? config.FireStoke10WoodCount :
                            config.FireStoke100WoodCount;
                if (data.woodNearFire >= count) {
                    data.woodNearFire -= count;
                    if (data.fireSize === 0) {
                        data.fireStart = Date.now();
                        data.fireSize = 1;
                        data.recordFiresStarted++;
                        data.startedBy = playerName;
                        this.logAction(playerName, ` uses ${count} wood to start the fire.`);
                    } else {
                        this.logAction(playerName, ` puts ${count} wood into the fire.`);
                    }
                    data.woodInFire += count;
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
    private actionCancel(playerName, actionId) {
        switch (actionId) {
            case actions.Stoke1:
            case actions.Stoke10:
            case actions.Stoke100:
                break;

            case actions.TransportWood:
                this.logAction(playerName, ` puts back the ${config.TransportWoodCount} wood into the forest.`);
                data.woodInForest += config.TransportWoodCount;
                break;

            case actions.ChopTree:
                this.logAction(playerName, ` stops chopping down the tree.`);
                data.trees++;
                break;

            case actions.PlantTree:
                this.logAction(playerName, `'s tree shrivels and dies because they didn't watch it properly :(`);
                return true;
        }

        return false;
    }

    @bind
    private actionExecute(playerName, actionId) {
        switch (actionId) {
            case actions.Stoke1:
            case actions.Stoke10:
            case actions.Stoke100:
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
        const text = ` was previously known as "${oldPlayerName}".`;
        this.logBoth(newPlayerName, text)
    }

    @bind
    private logBoth(playerName: string, text: string) {
        this.logAction(playerName, text);
        this.logChatLine(playerName, text);
    }

    @bind
    private logChatLine(playerName: string, text: string) {
        const logLine: ILogLine = {
            playerName,
            text
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

        const woodInFireBefore = data.woodInFire;

        //data.fireSize = Math.max(0, data.fireSize - TICK_S * config.FireShrinkPerSecond);
        data.fireSize = Math.max(0, data.fireSize + fireGrowthPerSecond(data) * TICK_S);
        data.woodInFire = Math.max(0, data.woodInFire - fireBurnPerSecond(data) * TICK_S);

        const newFireSizeDescriptor = getFireSizeDescriptor(data.fireSize);
        if (newFireSizeDescriptor !== this.fireSizeDescriptor) {
            this.fireSizeDescriptor = newFireSizeDescriptor;
            if (newFireSizeDescriptor) {
                this.logSystemMessage(newFireSizeDescriptor);
            }
        }

        if (data.woodInFire === 0) {
            data.fireSize = 0;
        }

        if (data.fireSize === 0) {
            const timeBurningMS = data.lastTick - data.fireStart;
            this.logSystemMessage(`The fire started by ${data.startedBy} has burned down after ${msToTimeString(timeBurningMS)}.`);

            if (timeBurningMS > data.recordFireTimeMS) {
                data.recordFireTimeMS = timeBurningMS;
                data.recordFireTimeMSBy = data.startedBy;
            }
        } else if (data.fireSize > data.recordFireSize) {
            data.recordFireSize = data.fireSize;
            data.recordFireSizeBy = data.startedBy;
        }

        if ((data.fireSize > 0) && (data.woodInFire < 2) && (woodInFireBefore >= 2)) {
            this.logSystemMessage(`The fire is running out of wood.`);
        }
    }
}