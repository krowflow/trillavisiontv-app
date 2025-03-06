import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandSettings, Overlay } from '../../types';

const initialState: BrandSettings = {
  name: 'Trillavision T.V.',
  logo: '/assets/logo.svg',
  colors: {
    primary: '#2A0944',
    secondary: '#F5F5F5'
  },
  overlays: []
};

/**
 * Brand slice for managing branding and overlays
 */
const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    /**
     * Update brand settings
     */
    updateBrandSettings: (state, action: PayloadAction<Partial<BrandSettings>>) => {
      return { ...state, ...action.payload };
    },
    
    /**
     * Add overlay
     */
    addOverlay: (state, action: PayloadAction<Overlay>) => {
      state.overlays.push(action.payload);
    },
    
    /**
     * Update overlay
     */
    updateOverlay: (state, action: PayloadAction<Overlay>) => {
      const index = state.overlays.findIndex(overlay => overlay.id === action.payload.id);
      if (index !== -1) {
        state.overlays[index] = action.payload;
      }
    },
    
    /**
     * Remove overlay
     */
    removeOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter(overlay => overlay.id !== action.payload);
    },
    
    /**
     * Toggle overlay visibility
     */
    toggleOverlayVisibility: (state, action: PayloadAction<string>) => {
      const index = state.overlays.findIndex(overlay => overlay.id === action.payload);
      if (index !== -1) {
        state.overlays[index].visible = !state.overlays[index].visible;
      }
    }
  }
});

export const {
  updateBrandSettings,
  addOverlay,
  updateOverlay,
  removeOverlay,
  toggleOverlayVisibility
} = brandSlice.actions;

export default brandSlice.reducer;