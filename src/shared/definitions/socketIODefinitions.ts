import { IData } from "./databaseInterfaces";

export interface IInitialDataPackage {
    data: IData;
}

export const ClientEvent = {
    doAction: "doAction",
    changeName: "changeName"
};

export const ServerEvent = {
    initialDataPackage: "initialDataPackage",
    updateData: "updateData"
};