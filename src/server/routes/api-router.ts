import * as bodyParser from "body-parser";
import { Router } from "express";

export function apiRouter() {
    const router = Router();
    router.use(bodyParser.json());

    /*
    router.post("/api/sessions", async (req, res) => {
        try {
            res.json(await createSessionSnapshot());
        } catch (e) {
            console.log("Error while creating session. ", e);
            res.sendStatus(500);
        }
    });

    router.get("/api/sessions/:sessionId", async (req, res) => {
        const sessionId = req.params.sessionId;
        try {
            res.json(await getSessionSnapshotBySessionId(sessionId));
        } catch (e) {
            console.log("Error while searching for session with ID: " + sessionId, e);
            res.sendStatus(404);
        }
    });
    */

    return router;
}
