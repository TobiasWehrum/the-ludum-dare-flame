export interface IData {
    startedBy: string;
    fireSize: number;
    woodInFire: number;
    woodNearFire: number;
    woodInForest: number;
    trees: number;
    lastTick: number;
    fireStart: number;
    recordFireTimeMS: number;
    recordFireTimeMSBy: string;
    recordFireSize: number;
    recordFireSizeBy: string;
    recordTrees: number;
    recordFiresStarted: number;
    recordPlayersOnline: number;
    totalPlayers: number;
    totalActionsTaken: number;
}

export interface ILogLine {
    playerName: string;
    text: string;
}

export function generateDefaultData(): IData {
    const startTrees = 10;
    const data: IData = {
        startedBy: "",
        fireSize: 0,
        woodInFire: 10,
        woodNearFire: 10,
        woodInForest: 50,
        trees: startTrees,
        lastTick: Date.now(),
        fireStart: 0,
        recordFireSize: 0,
        recordFireSizeBy: "",
        recordFireTimeMS: 0,
        recordFireTimeMSBy: "",
        recordTrees: startTrees,
        recordFiresStarted: 0,
        recordPlayersOnline: 0,
        totalPlayers: 0,
        totalActionsTaken: 0
    };

    return data;
}