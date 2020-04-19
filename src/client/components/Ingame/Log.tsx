import * as React from "react";
import { GameStateStore, LogLine } from "../../stores/gameStateStore";
import { inject, observer } from "mobx-react";
import { mapReverse } from "../../../shared/utils/utils";
import AddChatLine from "./AddChatLine";

interface IProps {
    gameStateStore?: GameStateStore;
}

// tslint:disable-next-line: no-empty-interface
interface IState { }

@inject("gameStateStore")
@observer
export default class Log extends React.Component<IProps, IState> {
    public render() {
        const { logLines, chatLines } = this.props.gameStateStore;

        return (
            <div>
                <h1>Log</h1>
                <div className="log">
                    <div className="insideLog">
                        {mapReverse(logLines, (line: LogLine, index: number) => (
                            <div key={index}><strong>{line.playerName}</strong>{line.text}</div>
                        ))}
                    </div>
                </div>
                <h1>Chat</h1>
                <AddChatLine />
                <div className="log">
                    <div className="insideLog">
                        {mapReverse(chatLines, (line: LogLine, index: number) => (
                            <div key={index}><strong>{line.playerName}</strong>{line.text}</div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}