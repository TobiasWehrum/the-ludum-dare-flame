import * as React from "react";
import { GameStateStore, ConnectionStatus } from "../../stores/gameStateStore";
import { inject, observer } from "mobx-react";
import gameClient from "../../communication/gameClient";
import ActionButton from "./ActionButton";
import { actions, times, config } from "../../../shared/definitions/mixed";
import { TimeDisplay } from "./TimeDisplay";

interface IProps {
    gameStateStore?: GameStateStore;
}

// tslint:disable-next-line: no-empty-interface
interface IState { }

@inject("gameStateStore")
@observer
export default class Fire extends React.Component<IProps, IState> {
    public render() {
        const { fireSize, fireStart, lastTick, trees, woodInForest, woodNearFire } = this.props.gameStateStore.data;
        const burningTimeMS = lastTick - fireStart;

        const { FireStokeWoodCount, ChopTreeWoodResult, TransportWoodCount } = config;

        return (
            <div>
                {fireSize === 0 && (<div>
                    <div>The fire has burned down.</div>
                </div>)}
                {fireSize > 0 && (
                    <div>
                        <div>The fire has been burning for <strong><TimeDisplay ms={burningTimeMS} /></strong>.</div>
                    </div>
                )}
                <ul>
                    <li>Fire size: {Math.ceil(fireSize)}</li>
                    <li>Wood near fire: {woodNearFire}</li>
                    <li>Wood in forest: {woodInForest}</li>
                    <li>Trees: {trees}</li>
                </ul>
                <div style={{ display: "inline-flex" }}>
                    <ActionButton id={actions.Stoke} disabled={woodNearFire < FireStokeWoodCount} tooltipText={`-${FireStokeWoodCount} wood near fire, ${times[actions.Stoke]}s`}>{fireSize === 0 ? "Light" : "Stoke"} the fire</ActionButton>
                    <ActionButton id={actions.TransportWood} disabled={woodInForest < TransportWoodCount} tooltipText={`-${TransportWoodCount} wood in forest, +${TransportWoodCount} wood near fire, ${times[actions.TransportWood]}s`}>Transport wood to the fire</ActionButton>
                    <ActionButton id={actions.ChopTree} disabled={trees === 0} tooltipText={`-1 tree, +${ChopTreeWoodResult} wood in forest, ${times[actions.ChopTree]}s`}>Chop down a tree</ActionButton>
                    <ActionButton id={actions.PlantTree} tooltipText={`+1 tree, ${times[actions.PlantTree]}s`}>Plant a tree and watch it grow</ActionButton>
                </div>
            </div>
        );
    }
}