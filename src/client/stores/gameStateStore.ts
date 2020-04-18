import { observable, action, computed } from "mobx";
import { IInitialDataPackage } from "../../shared/definitions/socketIODefinitions";
import { IData } from "../../shared/definitions/databaseInterfaces";

export enum ConnectionStatus {
    Connecting,
    Connected,
    Disconnected
}

export class GameStateStore {
    @observable public connectionStatus: ConnectionStatus;
    @observable public connectionErrors: string[] = [];
    @observable public runningRequests = 0;

    @observable public loaded = false;
    @observable public data = new Data();

    @computed
    public get requestsAreRunning(): boolean {
        return this.runningRequests > 0;
    }

    @computed
    public get isInterfaceLocked(): boolean {
        //return this.requestsAreRunning;
        return false;
    }

    @action.bound
    public setConnectionStatusConnecting() {
        this.setNotLoaded();
        this.connectionStatus = ConnectionStatus.Connecting;
    }

    @action.bound
    public setConnectionStatusConnected() {
        this.clearConnectionErrors();
        this.connectionStatus = ConnectionStatus.Connected;
    }

    @action.bound
    public setConnectionStatusDisconnected() {
        this.setNotLoaded();
        this.connectionStatus = ConnectionStatus.Disconnected;
    }

    @action.bound
    public addConnectionError(error: string) {
        console.log(error);
        if (this.connectionErrors.length > 0) {
            if (this.connectionErrors[this.connectionErrors.length - 1] === error)
                return;
        }
        this.connectionErrors.push(error);
    }

    @action.bound
    public clearConnectionErrors() {
        this.connectionErrors = [];
    }

    @action.bound
    public setNotLoaded() {
        this.loaded = false;
        this.runningRequests = 0;
    }

    @action.bound
    public setInitialData(initialDataPackage: IInitialDataPackage) {
        const { data } = initialDataPackage;
        this.updateDataFrom(data);
        this.loaded = true;
    }

    @action.bound
    public updateDataFrom(dataPackage: IData) {
        updateObject(this.data, dataPackage);
        //console.log(this.data);
    }

    @action.bound
    public requestStarted() {
        this.runningRequests++;
    }

    @action.bound
    public requestFinished() {
        this.runningRequests--;
    }
}

class Data implements IData {
    @observable public score: number;

    //@observable public playerStates: PlayerState[] = [];
    //public playerStatesFactory = () => new PlayerState();
}

interface IReceiveCopy {
    copyFrom(source: IReceiveCopy): void;
}

type CreateNewFunction = () => any;

function updateObject(target: any, source: any, createNewObjectInTarget?: CreateNewFunction, createNewObjectInTargetInner?: CreateNewFunction) {
    if (createNewObjectInTarget) {
        for (const property in target) {
            if (!target.hasOwnProperty(property))
                continue;

            if (!source.hasOwnProperty(property)) {
                delete target[property];
            }
        }
    }

    for (const property in source) {
        if (!source.hasOwnProperty(property))
            continue;

        let targetHasValue = target.hasOwnProperty(property);

        if (!targetHasValue && createNewObjectInTarget) {
            target[property] = createNewObjectInTarget();
            targetHasValue = true;
        }

        if (!targetHasValue)
            continue;

        const sourceValue = source[property];
        const targetValue = target[property];
        const createNew = createNewObjectInTargetInner || target[property + "Factory"];
        const createNewInner = target[property + "FactoryInner"];
        if (Array.isArray(sourceValue)) {
            if (createNew) {
                copyObjectArray(targetValue, sourceValue, createNew, createNewInner);
            } else {
                targetValue.length = 0;
                for (const value of sourceValue) {
                    targetValue.push(value);
                }
            }
        } else if (sourceValue && (typeof sourceValue === "object")) {
            updateObject(targetValue, sourceValue, createNew, createNewInner);
        } else {
            target[property] = sourceValue;
        }
    }
}

function copyObjectArray<T extends IReceiveCopy>(target: T[], source: T[], createNew: CreateNewFunction, createNewObjectInTargetInner?: CreateNewFunction) {
    const sourceLength = source.length;
    if (target.length > sourceLength) {
        target.length = sourceLength;
    } else {
        while (target.length < sourceLength) {
            target.push(createNew());
        }
    }

    if (sourceLength === 0)
        return;

    for (let i = 0; i < sourceLength; i++) {
        updateObject(target[i], source[i], createNewObjectInTargetInner, undefined);
    }
}