import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IInitialGridState } from '../../types/IInitialGameState';

const initialState: IInitialGridState = {
    gridInitial: [],
};

export const gridStateSlice = createSlice({
    name: 'initialGridState',
    initialState,
    reducers: {
        setInitialGridState: ({ gridInitial }, action: PayloadAction<IInitialGridState>) => {
            gridInitial = action.payload.gridInitial;
        },
    },
});

export default gridStateSlice.reducer;

export const setInitialGridState = gridStateSlice.actions.setInitialGridState;
