import * as socketio from "socket.io";
import { ServerEvent, ClientEvent, IInitialDataPackage } from "../../shared/definitions/socketIODefinitions";
import { Server } from "http";
import { bind } from "bind-decorator";
import { data } from "./db";

const EVENT_CONNECTION = "connection";
const EVENT_DISCONNECT = "disconnect";

export class GameServer {
    private io: socketio.Server;

    public start(server: Server) {
        this.io = socketio(server);
        this.io.on(EVENT_CONNECTION, this.onConnection);
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

        const emitDataToAll = () => this.io.emit(ServerEvent.updateData, data);

        socket.on(ClientEvent.doAction, (actionId, callback) => {
            data.score++;
            emitDataToAll();
            callback();
        });
    }
}