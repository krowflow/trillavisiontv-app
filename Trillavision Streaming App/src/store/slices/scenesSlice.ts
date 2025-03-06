import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Scene, Source } from '../../types';

interface ScenesState {
  scenes: Scene[];
  currentSceneId: string | null;
}

const initialState: ScenesState = {
  scenes: [],
  currentSceneId: null
};

/**
 * Scenes slice for managing scenes and sources
 */
const scenesSlice = createSlice({
  name: 'scenes',
  initialState,
  reducers: {
    /**
     * Add a new scene
     */
    addScene: (state, action: PayloadAction<Scene>) => {
      state.scenes.push(action.payload);
      if (state.scenes.length === 1) {
        state.currentSceneId = action.payload.id;
      }
    },
    
    /**
     * Update an existing scene
     */
    updateScene: (state, action: PayloadAction<Scene>) => {
      const index = state.scenes.findIndex(scene => scene.id === action.payload.id);
      if (index !== -1) {
        state.scenes[index] = action.payload;
      }
    },
    
    /**
     * Remove a scene
     */
    removeScene: (state, action: PayloadAction<string>) => {
      state.scenes = state.scenes.filter(scene => scene.id !== action.payload);
      if (state.currentSceneId === action.payload && state.scenes.length > 0) {
        state.currentSceneId = state.scenes[0].id;
      } else if (state.scenes.length === 0) {
        state.currentSceneId = null;
      }
    },
    
    /**
     * Set the current active scene
     */
    setCurrentScene: (state, action: PayloadAction<string>) => {
      state.currentSceneId = action.payload;
      state.scenes = state.scenes.map(scene => ({
        ...scene,
        active: scene.id === action.payload
      }));
    },
    
    /**
     * Add a source to a scene
     */
    addSource: (state, action: PayloadAction<{ sceneId: string; source: Source }>) => {
      const { sceneId, source } = action.payload;
      const sceneIndex = state.scenes.findIndex(scene => scene.id === sceneId);
      if (sceneIndex !== -1) {
        state.scenes[sceneIndex].sources.push(source);
      }
    },
    
    /**
     * Update a source in a scene
     */
    updateSource: (state, action: PayloadAction<{ sceneId: string; source: Source }>) => {
      const { sceneId, source } = action.payload;
      const sceneIndex = state.scenes.findIndex(scene => scene.id === sceneId);
      if (sceneIndex !== -1) {
        const sourceIndex = state.scenes[sceneIndex].sources.findIndex(s => s.id === source.id);
        if (sourceIndex !== -1) {
          state.scenes[sceneIndex].sources[sourceIndex] = source;
        }
      }
    },
    
    /**
     * Remove a source from a scene
     */
    removeSource: (state, action: PayloadAction<{ sceneId: string; sourceId: string }>) => {
      const { sceneId, sourceId } = action.payload;
      const sceneIndex = state.scenes.findIndex(scene => scene.id === sceneId);
      if (sceneIndex !== -1) {
        state.scenes[sceneIndex].sources = state.scenes[sceneIndex].sources.filter(
          source => source.id !== sourceId
        );
      }
    }
  }
});

export const {
  addScene,
  updateScene,
  removeScene,
  setCurrentScene,
  addSource,
  updateSource,
  removeSource
} = scenesSlice.actions;

export default scenesSlice.reducer;