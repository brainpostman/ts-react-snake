import { useState } from 'react';
import styles from './App.module.scss';
import { useAppDispatch } from './hooks/ReduxHooks';
import { setInitialGameState } from './store/slices/initialGameState';
import { useNavigate } from 'react-router-dom';

const App = () => {
    const dispatch = useAppDispatch();
    const maxWidth = 20;
    const maxHeight = 20;
    const minWidth = 12;
    const minHeight = 9;
    const wallThickness = 2;
    const [gridWidth, setGridWidth] = useState(minWidth);
    const [gridHeight, setGridHeight] = useState(minHeight);
    const navigate = useNavigate();

    const handleGameStart = () => {
        if (
            gridWidth < minWidth ||
            gridHeight < minHeight ||
            gridWidth > maxWidth ||
            gridHeight > maxHeight
        ) {
            return;
        }

        let initialGridData = createStartingGrid(gridWidth, gridHeight, wallThickness);

        const initialStateData = setInitialPositions(
            initialGridData,
            wallThickness,
            gridWidth,
            gridHeight
        );
        dispatch(setInitialGameState(initialStateData));
        navigate('/game');
    };

    function createStartingGrid(
        accessibleWidth: number,
        accessibleHeight: number,
        wallThickness = 2
    ): number[][] {
        const width = accessibleWidth + wallThickness * 2;
        const height = accessibleHeight + wallThickness * 2;
        const emptyGrid: number[][] = [];
        for (let i = 0; i < height; i++) {
            emptyGrid.push([]);
            for (let j = 0; j < width; j++) {
                if (
                    i <= wallThickness - 1 ||
                    i >= accessibleHeight + wallThickness ||
                    j <= wallThickness - 1 ||
                    j >= accessibleWidth + wallThickness
                ) {
                    emptyGrid[i].push(3);
                } else {
                    emptyGrid[i].push(0);
                }
            }
        }
        return emptyGrid;
    }

    function setInitialPositions(
        emptyGrid: number[][],
        wallThickness: number,
        accessibleWidth: number,
        accessibleHeight: number
    ) {
        const width = accessibleWidth + wallThickness;
        const height = accessibleHeight + wallThickness;
        const headInitialY = Math.floor(Math.round(height / 2));
        const headInitialX = Math.floor(Math.round(width / 3) - 1);
        const headInitial = [headInitialY, headInitialX];
        emptyGrid[headInitialY][headInitialX] = 1;
        const tailInitial: number[][] = [];
        for (let i = 1; i < 3; i++) {
            tailInitial.push([headInitialY + i, headInitialX]);
        }
        for (let pathCell of tailInitial) {
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
        return { headInitial, tailInitial, foodInitial, gridInitial: emptyGrid, wallThickness };
    }

    return (
        <div className={styles.App}>
            <div className={styles.menu}>
                <p>{`Enter grid size (between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight}):`}</p>
                <p>Width:</p>
                <input
                    type='number'
                    value={gridWidth}
                    onChange={(e) => setGridWidth(+e.target.value)}
                />
                <p>Height:</p>
                <input
                    type='number'
                    value={gridHeight}
                    onChange={(e) => setGridHeight(+e.target.value)}
                />
                <button onClick={handleGameStart}>Continue</button>
            </div>
        </div>
    );
};

export default App;
