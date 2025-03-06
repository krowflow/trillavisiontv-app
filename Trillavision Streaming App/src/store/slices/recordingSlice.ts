import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordingState, RecordingInfo } from '../../types';

const initialState: RecordingState = {
  isRecording: false,
  currentRecording: null,
  error: null,
  recordings: []
};

const recordingSlice = createSlice({
  name: 'recording',
  initialState,
  reducers: {
    startRecording: (state, action: PayloadAction<RecordingInfo>) => {
      state.isRecording = true;
      state.currentRecording = action.payload;
      state.error = null;
    },
    
    stopRecording: (state, action: PayloadAction<RecordingInfo>) => {
      state.isRecording = false;
      state.currentRecording = action.payload;
      state.recordings.push(action.payload);
    },
    
    updateRecording: (state, action: PayloadAction<RecordingInfo>) => {
      state.currentRecording = action.payload;
    },
    
    setRecordingError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    clearRecordingError: (state) => {
      state.error = null;
    },
    
    addRecording: (state, action: PayloadAction<RecordingInfo>) => {
      state.recordings.push(action.payload);
    },
    
    removeRecording: (state, action: PayloadAction<string>) => {
      state.recordings = state.recordings.filter(r => r.id !== action.payload);
    }
  }
});

export const {
  startRecording,
  stopRecording,
  updateRecording,
  setRecordingError,
  clearRecordingError,
  addRecording,
  removeRecording
} = recordingSlice.actions;

export default recordingSlice.reducer;