import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IInitialGameState } from '../../types/IInitialGameState';

const initialState: IInitialGameState = {
    headInitial: [],
    tailInitial: [],
    foodInitial: [],
    gridInitial: [],
    wallThickness: 2,
};

export const gameStateSlice = createSlice({
    name: 'initialGameState',
    initialState,
    reducers: {
        setInitialGameState: (state, action: PayloadAction<IInitialGameState>) => {
            const newState = action.payload;
            state.headInitial = newState.headInitial;
            state.tailInitial = newState.tailInitial;
            state.foodInitial = newState.foodInitial;
            state.gridInitial = newState.gridInitial;
            state.wallThickness = newState.wallThickness;
        },
    },
});

export default gameStateSlice.reducer;

export const setInitialGameState = gameStateSlice.actions.setInitialGameState;
