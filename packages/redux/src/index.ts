import { configureStore } from '@reduxjs/toolkit';
import { formSlice } from './slice/form-slice';

export const store = configureStore({
    reducer: {
        [formSlice.name]: formSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
