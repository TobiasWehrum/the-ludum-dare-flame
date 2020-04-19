import * as React from "react";
import { bind } from "bind-decorator";

interface IProps {
    currentName: string;
    changeName: (newName: string) => void;
}

interface IState {
    name: string;
}

export default class NameChanger extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            name: this.props.currentName
        };
    }

    @bind
    private onNameChange(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ name: e.currentTarget.value });
    }

    @bind
    private submitName(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.changeName(this.state.name);
    }

    public render() {
        return (
            <form style={{ display: "inline" }} onSubmit={this.submitName}>
                <input onChange={this.onNameChange} value={this.state.name} />
                <button type="submit">Change!</button>
            </form>
        );
    }
}
