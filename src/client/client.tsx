import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./components/App";
import { Provider } from "mobx-react";
import { stores } from "./stores";
import { BrowserRouter } from "react-router-dom";
import { keepHerokuAppAlive } from "./helpers/utils";

const rootEl = document.getElementById("root");

render(
    <AppContainer>
        <Provider {...stores}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </AppContainer>,
    rootEl
);

keepHerokuAppAlive();

/*
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

ReactDOM.render(<App/>, document.getElementById('app'));
*/