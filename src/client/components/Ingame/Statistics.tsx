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
import Log from "./Log";
import AddChatLine from "./AddChatLine";

interface IProps {
    gameStateStore?: GameStateStore;
}

// tslint:disable-next-line: no-empty-interface
interface IState {
}

@inject("gameStateStore")
@observer
export default class Statistics extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
        };
    }

    public render() {
        return (
            <div>
                <h1>Statistics</h1>
            </div>
        );
    }
}