import * as React from "react";
import { bind } from "bind-decorator";
import gameClient from "../../communication/gameClient";

interface IProps {
}

interface IState {
    text: string;
}

export default class AddChatLine extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            text: ""
        };
    }

    @bind
    private onNameChange(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ text: e.currentTarget.value });
    }

    @bind
    private submitChatLine(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const text = this.state.text;
        if (text) {
            gameClient.sendChatLine(text);
        }
        this.setState({ text: "" });
    }

    public render() {
        return (
            <div>
                <form onSubmit={this.submitChatLine}>
                    Say:
                <input onChange={this.onNameChange} value={this.state.text} />
                    <button type="submit">Send</button>
                </form>
            </div>
        );
    }
}
