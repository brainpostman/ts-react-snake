export function createStartingGrid(
    accessibleWidth: number,
    accessibleHeight: number,
    wallThickness = 2
): number[][] {
    const width = accessibleHeight + wallThickness;
    const height = accessibleWidth + wallThickness;
    const emptyGrid: number[][] = [];
    for (let i = 0; i < height; i++) {
        emptyGrid.push([]);
        for (let j = 0; j < width; j++) {
            if (i <= 1 || i >= height || j <= 1 || j >= width) {
                emptyGrid[i].push(3);
            } else {
                emptyGrid[i].push(0);
            }
        }
    }
    return emptyGrid;
}
