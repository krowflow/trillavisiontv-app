import { configureStore } from '@reduxjs/toolkit';
import scenesReducer from './slices/scenesSlice';
import streamReducer from './slices/streamSlice';
import brandReducer from './slices/brandSlice';
import recordingReducer from './slices/recordingSlice';
import audioReducer from './slices/audioSlice';

export const rootReducer = {
  scenes: scenesReducer,
  stream: streamReducer,
  brand: brandReducer,
  recording: recordingReducer,
  audio: audioReducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;