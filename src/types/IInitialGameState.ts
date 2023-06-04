export interface IInitialGridState {
    gridInitial: number[][];
}

export interface IInitialGameState extends IInitialGridState {
    headInitial: number[];
    tailInitial: number[][];
    foodInitial: number[];
    wallThickness: number;
    difficulty: number;
}
