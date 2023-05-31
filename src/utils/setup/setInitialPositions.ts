export function setInitialState(
    emptyGrid: number[][],
    wallThickness: number,
    accessibleWidth: number,
    accessibleHeight: number
) {
    const width = accessibleHeight + wallThickness;
    const height = accessibleWidth + wallThickness;
    const headInitialY = Math.floor(Math.round(height / 2) - 2);
    const headInitialX = Math.floor(Math.round(width / 3) - 1);
    const headInitial = [headInitialY, headInitialX];
    emptyGrid[headInitialY][headInitialX] = 1;
    const tailInitial: number[][] = [];
    for (let i = 1; i < 3; i++) {
        let snakePathCell = [headInitialY + i, headInitialX];
        tailInitial.push(snakePathCell);
    }
    for (let pathCell of emptyGrid) {
        emptyGrid[pathCell[0]][pathCell[1]] = 1;
    }
    let foodInitialY = -1;
    let foodInitialX = -1;
    while (foodInitialY === -1) {
        let y = wallThickness + Math.floor(Math.random() * accessibleHeight);
        let x = wallThickness + Math.floor(Math.random() * accessibleWidth);
        if (emptyGrid[y][x] === 0) {
            emptyGrid[y][x] = 2;
            foodInitialY = y;
            foodInitialX = x;
        } else {
            continue;
        }
    }
    const foodInitial = [foodInitialY, foodInitialX];
    return { headInitial, tailInitial, foodInitial, gridInitial: emptyGrid };
}
