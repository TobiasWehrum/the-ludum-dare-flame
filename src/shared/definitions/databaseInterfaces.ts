export interface IData {
    fireSize: number;
    woodNearFire: number;
    woodInForest: number;
    trees: number;
    lastTick: number;
    fireStart: number;
    recordFireTimeMS: number;
    recordFireSize: number;
    recordTrees: number;
}

export function generateDefaultData(): IData {
    const startTrees = 100;
    const data: IData = {
        fireSize: 0,
        woodNearFire: 10,
        woodInForest: 100,
        trees: startTrees,
        lastTick: Date.now(),
        fireStart: 0,
        recordFireSize: 0,
        recordFireTimeMS: 0,
        recordTrees: startTrees
    };

    return data;
}