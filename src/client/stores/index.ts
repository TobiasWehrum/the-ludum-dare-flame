import { GameStateStore } from "./gameStateStore";
import { configure } from "mobx";
import { timeStore } from "./timeStore";

export const stores = {
    gameStateStore: new GameStateStore(),
    timeStore
};

configure({ enforceActions: "always" });