import * as React from "react";
import { GameStateStore } from "../../stores/gameStateStore";
import { inject, observer } from "mobx-react";
import ActionButton from "./ActionButton";
import { actions, times, config, fireGrowthPerSecond, fireBurnPerSecond } from "../../../shared/definitions/mixed";
import { TimeDisplay } from "./TimeDisplay";
import { KeywordFire, KeywordFireC, KeywordWoodC, KeywordForest, KeywordTreesC, KeywordTree, KeywordWood } from "./Keywords";

interface IProps {
    gameStateStore?: GameStateStore;
}

// tslint:disable-next-line: no-empty-interface
interface IState { }

@inject("gameStateStore")
@observer
export default class Fire extends React.Component<IProps, IState> {
    public render() {
        const { data } = this.props.gameStateStore;
        const { fireSize, startedBy, woodInFire, fireStart, lastTick, trees, woodInForest, woodNearFire } = data;
        const { playerCount } = this.props.gameStateStore;
        const burningTimeMS = lastTick - fireStart;
        const growthPerSecond = fireGrowthPerSecond(data);
        const burnPerSecond = fireBurnPerSecond(data);

        const { FireStoke1WoodCount, FireStoke10WoodCount, FireStoke100WoodCount, ChopTreeWoodResult, TransportWoodCount } = config;

        return (
            <div>
                {fireSize === 0 && (<div>
                    <div>The <KeywordFire /> has burned down.</div>
                </div>)}
                {fireSize > 0 && (
                    <div>
                        <div>The <KeywordFire /> started by {startedBy} has been burning for <strong><TimeDisplay ms={burningTimeMS} /></strong>.</div>
                    </div>
                )}
                <div>
                    <table>
                        <tr>
                            <tr><KeywordFireC /> size:</tr>
                            <td>{Math.ceil(fireSize * 10) / 10}</td>
                            <td>{growthPerSecond > 0 ? "+" : ""}{Math.ceil(growthPerSecond * 100) / 100}/s</td>
                        </tr>
                        <tr>
                            <tr><KeywordWoodC /> in <KeywordFire />:</tr>
                            <td>{Math.ceil(woodInFire * 10) / 10}</td>
                            <td>-{Math.ceil(burnPerSecond * 10) / 10}/s</td>
                        </tr>
                        <tr>
                            <tr><KeywordWoodC /> near <KeywordFire />:</tr>
                            <td>{woodNearFire}</td>
                        </tr>
                        <tr>
                            <tr><KeywordWoodC /> in <KeywordForest />:</tr>
                            <td>{woodInForest}</td>
                        </tr>
                        <tr>
                            <tr><KeywordTreesC /> in <KeywordForest />:</tr>
                            <td>{trees}</td>
                        </tr>
                        <tr>
                            <tr>Players enjoying the <KeywordFire />:</tr>
                            <td>{playerCount}</td>
                        </tr>
                    </table>
                </div>
                <div style={{ display: "flex" }}>
                    <ActionButton id={actions.Stoke1} disabled={woodNearFire < FireStoke1WoodCount} tooltipText={`-${FireStoke1WoodCount} wood near fire, ${times[actions.Stoke1]}s`}>{fireSize === 0 ? "Light" : "Stoke"} the <KeywordFire /> ({FireStoke1WoodCount} <KeywordWood />)</ActionButton>
                    <ActionButton id={actions.Stoke10} disabled={woodNearFire < FireStoke10WoodCount} tooltipText={`-${FireStoke10WoodCount} wood near fire, ${times[actions.Stoke10]}s`}>{fireSize === 0 ? "Light" : "Stoke"} the <KeywordFire /> ({FireStoke10WoodCount} <KeywordWood />)</ActionButton>
                    <ActionButton id={actions.Stoke100} disabled={woodNearFire < FireStoke100WoodCount} tooltipText={`-${FireStoke100WoodCount} wood near fire, ${times[actions.Stoke100]}s`}>{fireSize === 0 ? "Light" : "Stoke"} the <KeywordFire /> ({FireStoke100WoodCount} <KeywordWood />)</ActionButton>
                </div>
                <div style={{ display: "flex" }}>
                    <ActionButton id={actions.TransportWood} disabled={woodInForest < TransportWoodCount} tooltipText={`-${TransportWoodCount} wood in forest, +${TransportWoodCount} wood near fire, ${times[actions.TransportWood]}s`}>Transport <KeywordWood /> near the <KeywordFire /></ActionButton>
                    <ActionButton id={actions.ChopTree} disabled={trees === 0} tooltipText={`-1 tree, +${ChopTreeWoodResult} wood in forest, ${times[actions.ChopTree]}s`}>Chop down a <KeywordTree /> to get <KeywordWood /></ActionButton>
                    <ActionButton id={actions.PlantTree} tooltipText={`+1 tree, ${times[actions.PlantTree]}s`}>Plant a <KeywordTree /> and watch it grow</ActionButton>
                </div>
                <div>
                    Tipps:
                    <ul>
                        <li>More <KeywordWood /> = faster <KeywordFire /> growth</li>
                        <li>Bigger <KeywordFire /> = more <KeywordWood /> is burnt</li>
                        <li>It's hard to keep a fire burning alone. Give this link to friends!</li>
                    </ul>
                </div>
            </div>
        );
    }
}
