import * as React from "react";
import "normalize.css";
import "./../assets/scss/App.scss";
import { GameStateStore } from "../stores/gameStateStore";
import { hot } from "react-hot-loader";
import Game from "./Ingame/Game";

interface IProps {
    gameStateStore?: GameStateStore;
}

class App extends React.Component<IProps, undefined> {
    public render() {
        return (
            <div className="app">
                <h1>The Ludum Dare Flame</h1>
                <Game />
            </div>
        );

    }
}

export default hot(module)(App);