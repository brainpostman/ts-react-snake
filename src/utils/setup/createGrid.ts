function createStartingGrid(accessibleWidth: number, accessibleHeight: number, wallThickness = 2) {
    const width = accessibleHeight + wallThickness;
    const height = accessibleWidth + wallThickness;
    const initialGrid: number[][] = [];
    for (let i = 0; i < height; i++) {
        initialGrid.push([]);
        for (let j = 0; j < width; j++) {
            if (i <= 1 || i >= height || j <= 1 || j >= width) {
                initialGrid[i].push(3);
            } else {
                initialGrid[i].push(0);
            }
        }
    }
    const headInitialY = Math.floor(Math.round(height / 2) - 2);
    const headInitialX = Math.floor(Math.round(width / 3) - 1);
    initialGrid[headInitialY][headInitialX] = 1;
    const tailInitial: number[][] = [];
    for (let i = 1; i < 3; i++) {
        let snakePathCell = [headInitialY + i, headInitialX];
        tailInitial.push(snakePathCell);
    }
    for (let pathCell of initialGrid) {
        initialGrid[pathCell[0]][pathCell[1]] = 1;
    }
}
