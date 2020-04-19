export const config = {
    FireShrinkPerSecond: 1,
    FireStoke: 10,
    FireStokeWoodCount: 1,
    TransportWoodCount: 10,
    ChopTreeWoodResult: 100
};

export const actions = {
    Stoke: "Stoke",
    TransportWood: "TransportWood",
    ChopTree: "ChopTree",
    PlantTree: "PlantTree"
};

const factor = 1;

export const times = {
    [actions.Stoke]: 1 / factor,
    [actions.TransportWood]: 10 / factor,
    [actions.ChopTree]: 10 / factor,
    [actions.PlantTree]: 120 / factor,
};
