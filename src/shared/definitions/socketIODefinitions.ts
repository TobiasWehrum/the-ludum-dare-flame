import { IData, ILogLine } from "./databaseInterfaces";

export interface IInitialDataPackage {
    data: IData;
    lastLogLines: ILogLine[];
    lastChatLines: ILogLine[];
    playerCount: number;
}

export const ClientEvent = {
    doAction: "doAction",
    changeName: "changeName",
    sendChatLine: "sendChatLine"
};

export const ServerEvent = {
    initialDataPackage: "initialDataPackage",
    updateData: "updateData",
    addLogLine: "addLogLine",
    addChatLine: "addChatLine",
    updatePlayerCount: "updatePlayerCount"
};