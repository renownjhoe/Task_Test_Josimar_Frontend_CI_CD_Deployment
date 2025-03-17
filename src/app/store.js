import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import brtReducer from '../features/brtSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    brts: brtReducer,
  },
});