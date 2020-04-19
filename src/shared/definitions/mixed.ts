import { IData } from "./databaseInterfaces";

export const config = {
    FireShrinkPerSecond: 1,
    FireTargetSizeSpeed: 0.1,
    FireStoke1WoodCount: 1,
    FireStoke10WoodCount: 10,
    FireStoke100WoodCount: 100,
    TransportWoodCount: 10,
    ChopTreeWoodResult: 50
};

export const actions = {
    Stoke1: "Stoke1",
    Stoke10: "Stoke10",
    Stoke100: "Stoke100",
    TransportWood: "TransportWood",
    ChopTree: "ChopTree",
    PlantTree: "PlantTree"
};

const factor = 1;

export const times = {
    [actions.Stoke1]: 1 / factor,
    [actions.Stoke10]: 1 / factor,
    [actions.Stoke100]: 1 / factor,
    [actions.TransportWood]: 10 / factor,
    [actions.ChopTree]: 20 / factor,
    [actions.PlantTree]: 180 / factor,
};

export function fireGrowthPerSecond(data: IData) {
    if (data.fireSize === 0)
        return 0;

    return (Math.pow(data.woodInFire, 0.5) - data.fireSize) / 50 - 0.1;
}

export function fireBurnPerSecond(data: IData) {
    return data.fireSize * 0.1;
}