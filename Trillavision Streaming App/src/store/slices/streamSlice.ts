import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StreamSettings, StreamStatus, StreamAnalytics } from '../../types';

interface StreamState {
  settings: StreamSettings;
  status: StreamStatus;
  isConnectedToYouTube: boolean;
  error: string | null;
  viewerCount: number;
  duration: number;
  analytics: StreamAnalytics | null;
  lastAnalyticsUpdate: number;
}

const initialState: StreamState = {
  settings: {
    platform: 'youtube',
    quality: '1080p30',
    key: '',
    title: 'Trillavision T.V. Stream',
    description: '',
    isPrivate: false
  },
  status: StreamStatus.OFFLINE,
  isConnectedToYouTube: false,
  error: null,
  viewerCount: 0,
  duration: 0,
  analytics: null,
  lastAnalyticsUpdate: 0
};

/**
 * Stream slice for managing stream settings and status
 */
const streamSlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    /**
     * Update stream settings
     */
    updateStreamSettings: (state, action: PayloadAction<Partial<StreamSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    /**
     * Set stream status
     */
    setStreamStatus: (state, action: PayloadAction<StreamStatus>) => {
      state.status = action.payload;
    },
    
    /**
     * Set YouTube connection status
     */
    setYouTubeConnection: (state, action: PayloadAction<boolean>) => {
      state.isConnectedToYouTube = action.payload;
    },
    
    /**
     * Set stream error
     */
    setStreamError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    /**
     * Update viewer count
     */
    updateViewerCount: (state, action: PayloadAction<number>) => {
      state.viewerCount = action.payload;
    },
    
    /**
     * Update stream duration
     */
    updateDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    /**
     * Start streaming
     */
    startStream: (state) => {
      state.status = StreamStatus.CONNECTING;
      state.error = null;
    },
    
    /**
     * Stop streaming
     */
    stopStream: (state) => {
      state.status = StreamStatus.OFFLINE;
      state.duration = 0;
    },

    updateAnalytics: (state, action: PayloadAction<StreamAnalytics>) => {
      state.analytics = action.payload;
      state.lastAnalyticsUpdate = Date.now();
    },

    clearAnalytics: (state) => {
      state.analytics = null;
      state.lastAnalyticsUpdate = 0;
    }
  }
});

export const {
  updateStreamSettings,
  setStreamStatus,
  setYouTubeConnection,
  setStreamError,
  updateViewerCount,
  updateDuration,
  startStream,
  stopStream,
  updateAnalytics,
  clearAnalytics
} = streamSlice.actions;

export default streamSlice.reducer;