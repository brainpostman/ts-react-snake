import { configureStore } from '@reduxjs/toolkit';
import initialGameStateReducer from './slices/initialGameState';
export const store = configureStore({
    reducer: {
        initialGameState: initialGameStateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
