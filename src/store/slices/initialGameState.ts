import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IInitialGameState } from '../../types/IInitialGameState';

const initialState: IInitialGameState = {
    headInitial: [],
    tailInitial: [],
    foodInitial: [],
    gridInitial: [],
};

export const gameStateSlice = createSlice({
    name: 'initialGameState',
    initialState,
    reducers: {
        setInitialGameState: (
            { headInitial, tailInitial, foodInitial, gridInitial },
            action: PayloadAction<IInitialGameState>
        ) => {
            const newState = action.payload;
            headInitial = newState.headInitial;
            tailInitial = newState.tailInitial;
            foodInitial = newState.foodInitial;
            gridInitial = newState.gridInitial;
        },
    },
});

export default gameStateSlice.reducer;

export const setInitialGameState = gameStateSlice.actions.setInitialGameState;
