require("dotenv").config();

import * as express from "express";
import { Server } from "http";
import * as path from "path";
import { getVersion } from "../shared/utils/utils";
import * as config from "./config";
import { apiRouter } from "./routes/api-router";
import { pagesRouter } from "./routes/pages-router";
import { staticsRouter } from "./routes/statics-router";
import { connectToDatabase } from "./systems/db";
import { GameServer } from "./systems/gameServer";

console.log(`The App version is ${getVersion()}`);

connectToDatabase().then(() => {
    const app = express();
    app.set("view engine", "ejs");

    app.use("/assets", express.static(path.join(__dirname, "..", "..", "..", "assets")));
    app.use(apiRouter());
    app.use(staticsRouter());
    app.use(pagesRouter());

    const server = new Server(app);
    server.listen(config.SERVER_PORT, () => {
        console.log(`App listening on port ${config.SERVER_PORT}!`);
    });

    const gameServer = new GameServer();

    gameServer.start(server);
});