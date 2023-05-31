import { useState } from 'react';
import styles from './App.module.scss';
import { createStartingGrid } from './utils/setup/createStartingGrid';
import { useAppDispatch, useAppSelector } from './hooks/ReduxHooks';
import { setInitialGridState } from './store/slices/initialGridState';
import { setInitialState } from './utils/setup/setInitialPositions';
import { setInitialGameState } from './store/slices/initialGameState';
import { useNavigate } from 'react-router-dom';

const App = () => {
    const { gridInitial } = useAppSelector((state) => state.initialGameState);
    const dispatch = useAppDispatch();
    const maxWidth = 30;
    const maxHeight = 30;
    const minWidth = 12;
    const minHeight = 9;
    const wallThickness = 2;
    const [gridWidth, setGridWidth] = useState(gridInitial.length || minWidth);
    const [gridHeight, setGridHeight] = useState(gridInitial[0].length || minHeight);
    const [grid, setGrid] = useState<number[][] | null>(gridInitial.length ? gridInitial : []);
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
        const initialGridData = grid
            ? grid
            : createStartingGrid(gridWidth, gridHeight, wallThickness);
        if (!grid) {
            setGrid(initialGridData);
            dispatch(setInitialGridState({ gridInitial: initialGridData }));
        }
        const initialStateData = setInitialState(
            initialGridData,
            wallThickness,
            gridWidth,
            gridHeight
        );
        dispatch(setInitialGameState(initialStateData));
        navigate('/snake');
    };

    return (
        <div className={styles.App}>
            <div className={styles.menu}>
                <p>Enter grid size (between 12x9 and 30x30):</p>
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
