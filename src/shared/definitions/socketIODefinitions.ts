import { IData } from "./databaseInterfaces";

export interface IInitialDataPackage {
    data: IData;
}

export const ClientEvent = {
    doAction: "doAction"
};

export const ServerEvent = {
    initialDataPackage: "initialDataPackage",
    updateData: "updateData"
};