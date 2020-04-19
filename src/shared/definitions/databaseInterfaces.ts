export interface IData {
    fireSize: number;
    woodInFire: number;
    woodNearFire: number;
    woodInForest: number;
    trees: number;
    lastTick: number;
    fireStart: number;
    recordFireTimeMS: number;
    recordFireSize: number;
    recordTrees: number;
    recordFiresStarted: number;
    recordPlayersOnline: number;
}

export interface ILogLine {
    playerName: string;
    text: string;
}

export function generateDefaultData(): IData {
    const startTrees = 100;
    const data: IData = {
        fireSize: 0,
        woodInFire: 10,
        woodNearFire: 10,
        woodInForest: 100,
        trees: startTrees,
        lastTick: Date.now(),
        fireStart: 0,
        recordFireSize: 0,
        recordFireTimeMS: 0,
        recordTrees: startTrees,
        recordFiresStarted: 0,
        recordPlayersOnline: 0
    };

    return data;
}