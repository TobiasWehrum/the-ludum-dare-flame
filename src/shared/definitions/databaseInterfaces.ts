export interface IData {
    score: number;
}

export function generateDefaultData(): IData {
    const data: IData = {
        score: 42
    };

    return data;
}