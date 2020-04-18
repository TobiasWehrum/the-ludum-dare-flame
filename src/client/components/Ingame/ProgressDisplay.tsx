import * as React from "react";
import { TooltipType } from "../../mixed/mixedDefinitions";

interface IProps {
    id?: string;
    active?: boolean;
    progressPercent100?: number;
    tooltipText?: string;
    tooltipType?: TooltipType;
    className?: string;
}

export default class ProgressDisplay extends React.Component<IProps, undefined> {
    public static defaultProps: IProps = {
        active: true,
        tooltipType: TooltipType.Neutral
    };

    public render() {
        const { active, id, children } = this.props;

        let className = "progress-display " + this.props.className;

        if (!active)
            return <span id={id} className={className}>{children}</span>;

        const { progressPercent100, tooltipText, tooltipType } = this.props;

        const style = {
            background: `linear-gradient(to right, lightgreen ${progressPercent100}%, white ${progressPercent100}%`
        };

        let tooltip;
        if (tooltipText) {
            tooltip = <span className={"tooltip-text tooltip-text-" + tooltipType}>{tooltipText}</span>;
            className += " " + "tooltip-container";
        }

        return (
            <span id={id} className={className} style={style}>
                {children}
                {tooltip}
            </span>
        );
    }
}
