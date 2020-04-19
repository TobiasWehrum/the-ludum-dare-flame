import * as socketio from "socket.io";
import { ServerEvent, ClientEvent, IInitialDataPackage } from "../../shared/definitions/socketIODefinitions";
import { Server } from "http";
import { bind } from "bind-decorator";
import { data } from "./db";
import { config, times } from "../../shared/definitions/mixed";
import { actions } from "../../shared/definitions/mixed";
import { timeout } from '../../shared/utils/utils';

const EVENT_CONNECTION = "connection";
const EVENT_DISCONNECT = "disconnect";

const TICK_S = 0.1;

export class GameServer {
    private io: socketio.Server;

    public start(server: Server) {
        this.io = socketio(server);
        this.io.on(EVENT_CONNECTION, this.onConnection);

        this.tickLoop();
    }

    @bind
    private async onConnection(socket: socketio.Socket) {
        console.log("Client connected: " + socket.id);

        const playerId = socket.handshake.query.playerId;

        socket.join(playerId);

        const initialDataPackage: IInitialDataPackage = {
            data
        };
        socket.emit(ServerEvent.initialDataPackage, initialDataPackage);

        // tslint:disable-next-line: no-empty
        socket.on(EVENT_DISCONNECT, () => {

        });

        let requestRunning = false;

        socket.on(ClientEvent.doAction, (actionId, callback) => {
            if (requestRunning) {
                console.log("Can't execute; request running");
                callback();
                return;
            }

            requestRunning = true;
            if (!this.actionPre(actionId)) {
                callback();
                return;
            }

            this.emitDataToAll();

            setTimeout(() => {
                this.actionExecute(actionId);
                this.emitDataToAll();
                requestRunning = false;
                callback();
            }, times[actionId] * 1000);
        });
    }

    @bind
    private actionPre(actionId) {
        switch (actionId) {
            case actions.Stoke:
                if (data.woodNearFire >= config.FireStokeWoodCount) {
                    data.woodNearFire -= config.FireStokeWoodCount;
                    return true;
                }
                return true;

            case actions.TransportWood:
                if (data.woodInForest >= config.TransportWoodCount) {
                    data.woodInForest -= config.TransportWoodCount;
                    return true;
                }
                break;

            case actions.ChopTree:
                if (data.trees >= 1) {
                    data.trees -= 1;
                    return true;
                }
                break;

            case actions.PlantTree:
                return true;
        }

        return false;
    }

    @bind
    private actionExecute(actionId) {
        switch (actionId) {
            case actions.Stoke:
                if (data.fireSize === 0) {
                    data.fireStart = Date.now();
                }
                data.fireSize += config.FireStoke;
                break;

            case actions.TransportWood:
                data.woodNearFire += config.TransportWoodCount;
                break;

            case actions.ChopTree:
                data.woodInForest += config.ChopTreeWoodResult;
                break;

            case actions.PlantTree:
                data.trees++;
                break;
        }
    }

    @bind
    private emitDataToAll() {
        this.io.emit(ServerEvent.updateData, data);
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
        data.fireSize = Math.max(0, data.fireSize - TICK_S * config.FireShrinkPerSecond);
    }
}