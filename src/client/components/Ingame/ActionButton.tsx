import * as React from "react";
import { TooltipType } from "../../mixed/mixedDefinitions";
import IngameButton from "./IngameButton";
import gameClient from "../../communication/gameClient";
import { GameStateStore } from "../../stores/gameStateStore";
import { inject, observer } from "mobx-react";

interface IProps {
    id: string;
    disabled?: boolean;
    tooltipText?: string;
    tooltipType?: TooltipType;
    gameStateStore?: GameStateStore;
}

@inject("gameStateStore")
@observer
export default class ActionButton extends React.Component<IProps, undefined> {
    public static defaultProps: IProps = {
        id: "",
        tooltipType: TooltipType.Neutral
    };

    public render() {
        const { id, disabled, tooltipText, tooltipType, children, gameStateStore } = this.props;

        let progress = null;
        if (gameStateStore.cooldownId === id) {
            progress = gameStateStore.cooldownProgress;
        }

        return (
            <IngameButton id={id} onClick={gameClient.doButtonAction} disabled={disabled} progress={progress} tooltipText={tooltipText} tooltipType={tooltipType}>
                {children}
            </IngameButton>
        );
    }
}
