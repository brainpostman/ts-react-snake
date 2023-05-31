import { configureStore } from '@reduxjs/toolkit';
import initialGameStateReducer from './slices/initialGameState';
import initialGridStateReducer from './slices/initialGridState';
export const store = configureStore({
    reducer: {
        initialGameState: initialGameStateReducer,
        initialGridState: initialGridStateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
