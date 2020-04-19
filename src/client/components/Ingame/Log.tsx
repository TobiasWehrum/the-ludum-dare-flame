import * as React from "react";
import { GameStateStore, LogLine } from "../../stores/gameStateStore";
import { inject, observer } from "mobx-react";
import ActionButton from "./ActionButton";
import { actions, times, config } from "../../../shared/definitions/mixed";
import { TimeDisplay } from "./TimeDisplay";
import { mapReverse } from "../../../shared/utils/utils";

interface IProps {
    gameStateStore?: GameStateStore;
}

// tslint:disable-next-line: no-empty-interface
interface IState { }

@inject("gameStateStore")
@observer
export default class Log extends React.Component<IProps, IState> {
    public render() {
        const { logLines } = this.props.gameStateStore;

        return (
            <div>
                <h1>Log</h1>
                <div id="log">
                    <div id="insideLog">
                        {mapReverse(logLines, (line: LogLine, index: number) => (
                            <div key={index}><strong>{line.playerName}</strong>{line.text}</div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}