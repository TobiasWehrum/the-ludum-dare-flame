import io from "socket.io-client";
import { stores } from "../stores";
import { IData } from "../../shared/definitions/databaseInterfaces";
import { ClientEvent, ServerEvent, IInitialDataPackage } from "../../shared/definitions/socketIODefinitions";
import IngameButton from "../components/Ingame/IngameButton";
import { bind } from "bind-decorator";

const EVENT_CONNECT = "connect";
const EVENT_DISCONNECT = "disconnect";

const EVENT_CONNECT_ERROR = "connect_error";
const EVENT_ERROR = "error";

const EVENT_RECONNECT_ATTEMPT = "reconnect_attempt";

class GameClient {
    public playerId: string;
    private socket: SocketIOClient.Socket;

    public connect() {
        this.socket = io({
            query: {
            }
        });

        console.log("Connecting to the server");

        const { gameStateStore } = stores;
        gameStateStore.setConnectionStatusConnecting();

        this.socket.on(ServerEvent.initialDataPackage, (initialDataPackage: IInitialDataPackage) => {
            gameStateStore.setInitialData(initialDataPackage);
        });

        this.socket.on(ServerEvent.updateData, (data: IData) => {
            gameStateStore.updateDataFrom(data);
        });

        this.socket.on(EVENT_CONNECT, () => {
            console.log("Client connected. My socket ID is: " + this.socket.id);
            gameStateStore.setConnectionStatusConnected();
        });

        this.socket.on(EVENT_DISCONNECT, reason => {
            gameStateStore.setConnectionStatusDisconnected();
            switch (reason) {
                case "io client disconnect":
                    console.log("Client disconnected.");
                    break;

                case "io server disconnect":
                    gameStateStore.addConnectionError("Disconnected by the server.");
                    break;

                case "transport close":
                    gameStateStore.addConnectionError("Disconnected because the server stopped answering.");
                    break;

                default:
                    gameStateStore.addConnectionError("Disconnected for an unknown reason: " + reason);
                    break;
            }
        });

        this.socket.on(EVENT_CONNECT_ERROR, (error: Error) => {
            if ((error.message === "server error") || (error.message === "xhr poll error")) {
                gameStateStore.addConnectionError("Cannot connect to the server.");
            } else {
                gameStateStore.addConnectionError(error.toString());
            }
        });

        this.socket.on(EVENT_ERROR, (error: Error) => {
            console.log("SocketIO Error event", error);
            //gameStateStore.setConnectionError(error);
        });

        this.socket.on(EVENT_RECONNECT_ATTEMPT, () => {
            console.log("Trying to reconnect...");
            gameStateStore.setConnectionStatusConnecting();
        });
    }

    @bind
    public doButtonAction(ingameButton: IngameButton) {
        const id = ingameButton.props.id;
        stores.gameStateStore.requestStarted();
        this.socket.emit(ClientEvent.doAction, id, stores.gameStateStore.requestFinished);
    }

    public disconnect() {
        if (this.socket != null) {
            this.socket.disconnect();
            this.socket = null;
            this.playerId = null;
        }
    }
}

const gameClient = new GameClient();
export default gameClient;

if (module.hot) {
    module.hot.dispose(data => {
        data.playerId = gameClient.playerId;
        if (data.playerId) {
            gameClient.disconnect();
        }
    });

    if (module.hot.data) {
        const { playerId } = module.hot.data;
        if (playerId) {
            gameClient.connect();
        }
    }
}