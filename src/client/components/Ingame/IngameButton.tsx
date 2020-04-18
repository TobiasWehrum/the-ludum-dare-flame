import * as React from "react";
import { observer, inject } from "mobx-react";
import { GameStateStore } from "../../stores/gameStateStore";
import { bind } from "bind-decorator";
import { TooltipType } from "../../mixed/mixedDefinitions";

interface IProps {
    id?: string;
    onClick?: (ingameButton: IngameButton) => void;
    disabled?: boolean;
    progress?: number;
    tooltipText?: string;
    tooltipType?: TooltipType;
    gameStateStore?: GameStateStore;
}

@inject("gameStateStore")
@observer
export default class IngameButton extends React.Component<IProps, undefined> {
    public static defaultProps: IProps = {
        progress: null,
        tooltipType: TooltipType.Neutral
    };

    private buttonRef: React.RefObject<HTMLButtonElement>;

    constructor(props: IProps) {
        super(props);

        this.buttonRef = React.createRef();
    }

    @bind
    private onClick() {
        this.props.onClick(this);
    }

    public render() {
        const { id, progress, children, gameStateStore, disabled, tooltipText, tooltipType } = this.props;
        const progressPercent100 = progress * 100;

        let className = "ingame-button";
        const style = { background: undefined };
        const isProgressing = progress !== null;
        if (isProgressing) {
            style.background = `linear-gradient(to top, lightgreen ${progressPercent100}%, white ${progressPercent100}%`;
            className += " " + "progressing";
        }

        const effectivelyDisabled = disabled || isProgressing || gameStateStore.isInterfaceLocked;

        let tooltip;
        if (tooltipText) {
            tooltip = <span className={"tooltip-text tooltip-text-" + tooltipType}>{tooltipText}</span>;
            className += " " + "tooltip-container";
        }

        return (
            <button id={id} ref={this.buttonRef} className={className} onClick={this.onClick} disabled={effectivelyDisabled} style={style}>{children}{tooltip}</button>
        );
    }
}
