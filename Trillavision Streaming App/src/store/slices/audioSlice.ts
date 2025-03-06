import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioChannel, AudioProcessor, VSTPlugin } from '../../types';

interface AudioState {
  channels: AudioChannel[];
  selectedChannelId: string | null;
  selectedProcessorId: string | null;
  vstPlugins: VSTPlugin[];
  isVSTBrowserOpen: boolean;
  vstError: string | null;
}

const initialState: AudioState = {
  channels: [],
  selectedChannelId: null,
  selectedProcessorId: null,
  vstPlugins: [],
  isVSTBrowserOpen: false,
  vstError: null
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setSelectedChannel: (state, action: PayloadAction<string | null>) => {
      state.selectedChannelId = action.payload;
    },
    
    setSelectedProcessor: (state, action: PayloadAction<string | null>) => {
      state.selectedProcessorId = action.payload;
    },
    
    addVSTPlugin: (state, action: PayloadAction<VSTPlugin>) => {
      state.vstPlugins.push(action.payload);
    },
    
    setVSTBrowserOpen: (state, action: PayloadAction<boolean>) => {
      state.isVSTBrowserOpen = action.payload;
    },
    
    setVSTError: (state, action: PayloadAction<string | null>) => {
      state.vstError = action.payload;
    },
    
    addProcessor: (state, action: PayloadAction<{channelId: string; processor: AudioProcessor}>) => {
      const channel = state.channels.find(c => c.id === action.payload.channelId);
      if (channel) {
        channel.processors.push(action.payload.processor);
      }
    },
    
    updateProcessor: (state, action: PayloadAction<{
      channelId: string;
      processorId: string;
      updates: Partial<AudioProcessor>;
    }>) => {
      const { channelId, processorId, updates } = action.payload;
      const channel = state.channels.find(c => c.id === channelId);
      if (channel) {
        const processor = channel.processors.find(p => p.id === processorId);
        if (processor) {
          Object.assign(processor, updates);
        }
      }
    },
    
    removeProcessor: (state, action: PayloadAction<{channelId: string; processorId: string}>) => {
      const channel = state.channels.find(c => c.id === action.payload.channelId);
      if (channel) {
        channel.processors = channel.processors.filter(p => p.id !== action.payload.processorId);
      }
    }
  }
});

export const {
  setSelectedChannel,
  setSelectedProcessor,
  addVSTPlugin,
  setVSTBrowserOpen,
  setVSTError,
  addProcessor,
  updateProcessor,
  removeProcessor
} = audioSlice.actions;

export default audioSlice.reducer;