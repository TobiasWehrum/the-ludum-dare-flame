import * as React from "react";
import "normalize.css";
import "./../assets/scss/App.scss";
import { GameStateStore } from "../stores/gameStateStore";
import { hot } from "react-hot-loader";
import Game from "./Ingame/Game";
import { Switch, Route, Link } from "react-router-dom";
import { Session } from "inspector";
import Statistics from "./Ingame/Statistics";

interface IProps {
    gameStateStore?: GameStateStore;
}

class App extends React.Component<IProps, undefined> {
    public render() {
        return (
            <div className="app">
                <Link to="/"><h1 className="fire">The Ludum Dare Flame 🔥</h1></Link>
                <Switch>
                    <Route path="/statistics" component={Statistics} />
                    <Route component={Game} />
                </Switch>
            </div>
        );

    }
}

export default hot(module)(App);