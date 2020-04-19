export interface IData {
    fireSize: number;
    woodNearFire: number;
    woodInForest: number;
    trees: number;
    lastTick: number;
    fireStart: number;
}

export function generateDefaultData(): IData {
    const data: IData = {
        fireSize: 0,
        woodNearFire: 10,
        woodInForest: 100,
        trees: 100,
        lastTick: Date.now(),
        fireStart: 0,
    };

    return data;
}