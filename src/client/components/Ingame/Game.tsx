import * as React from "react";
import { GameStateStore, ConnectionStatus } from "../../stores/gameStateStore";
import { inject, observer } from "mobx-react";
import gameClient from "../../communication/gameClient";
import IngameButton from "./IngameButton";
import ActionButton from "./ActionButton";
import { actions } from "../../../shared/definitions/mixed";
import Fire from "./Fire";
import Records from "./Records";
import NameChanger from "./NameChanger";

interface IProps {
    gameStateStore?: GameStateStore;
}

// tslint:disable-next-line: no-empty-interface
interface IState {
    changeName: boolean;
}

@inject("gameStateStore")
@observer
export default class Game extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            changeName: false
        };
    }

    public componentWillMount() {
        gameClient.connect();
    }

    public componentWillUnmount() {
        gameClient.disconnect();
    }

    public render() {
        const gameStateStore = this.props.gameStateStore;
        if (gameStateStore.connectionErrors.length > 0) {
            return (
                <div>
                    {gameStateStore.connectionErrors.map((error, index) =>
                        <p key={index} className="error">{error}</p>
                    )}
                    <p>
                        {
                            (gameStateStore.connectionStatus === ConnectionStatus.Disconnected)
                                ? "If you think that this is a temporary problem, try again later."
                                : "Trying to reconnect..."
                        }
                    </p>
                </div>
            );
        } else if (!gameStateStore.loaded) {
            return <div>Loading...</div>;
        }

        const { changeName } = this.state;
        const { playerName } = gameStateStore;

        return (
            <div>
                <Fire />
                <div>
                    Name:&nbsp;
                    {!changeName && <span>{playerName}<button onClick={() => this.setState({ changeName: true })}>Change</button></span>}
                    {changeName && <NameChanger currentName={playerName}
                        changeName={(newName: string) => {
                            gameClient.changeName(newName);
                            this.setState({ changeName: false });
                        }} />}
                </div>
                <Records />
            </div>
        );
    }
}