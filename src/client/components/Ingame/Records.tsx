import * as React from "react";
import { GameStateStore } from "../../stores/gameStateStore";
import { inject, observer } from "mobx-react";
import { TimeDisplay } from "./TimeDisplay";

interface IProps {
    gameStateStore?: GameStateStore;
}

// tslint:disable-next-line: no-empty-interface
interface IState { }

@inject("gameStateStore")
@observer
export default class Records extends React.Component<IProps, IState> {
    public render() {
        const {
            fireSize, fireStart, lastTick,
            recordFireTimeMS, recordFireTimeMSBy, recordFireSize, recordFireSizeBy, recordTrees, recordPlayersOnline, recordFiresStarted,
            totalActionsTaken, totalPlayers
        } = this.props.gameStateStore.data;
        const burningTimeMS = lastTick - fireStart;

        return (
            <div>
                <h1>Statistics</h1>
                <ul>
                    <li>Fires started: {recordFiresStarted}</li>
                    <li>Longest fire burning: <TimeDisplay ms={Math.max(fireSize && burningTimeMS, recordFireTimeMS)} /> (started by {recordFireTimeMSBy})</li>
                    <li>Biggest fire: {Math.ceil(recordFireSize * 10) / 10} (started by {recordFireSizeBy})</li>
                    <li>Most trees in forest: {recordTrees}</li>
                    <li>Most players online at the same time: {recordPlayersOnline}</li>
                    <li>Total player counter: {totalPlayers}</li>
                    <li>Total action counter: {totalActionsTaken}</li>
                </ul>
            </div>
        );
    }
}