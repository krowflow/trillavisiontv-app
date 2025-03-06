# Known Issues

## VST Browser Integration (Priority: High)

### Issue Description
The VST browser modal has several integration issues with the audio mixer:

1. **Plugin Selection Not Persisting**
   - When selecting a VST plugin, the UI sometimes reverts back to the mixer view
   - Plugin state is not consistently maintained after selection
   - Root cause appears to be state management between VSTBrowser and AudioMixer components

2. **State Management**
   - Selected plugins are not properly tracked in the Redux store
   - Channel processor state updates are not always reflected immediately
   - Need to implement proper Redux actions for VST management

### Technical Details
- Location: `src/components/audio/VSTBrowser.tsx` and `src/components/audio/AudioMixer.tsx`
- Related Files: 
  - `src/services/vst-service.ts`
  - `src/store/slices/audioSlice.ts` (needs to be created)

### Proposed Solutions
1. Implement proper Redux state management for VST plugins
2. Create dedicated audio slice for managing VST state
3. Improve error handling and loading states
4. Add proper type safety throughout VST integration

### Implementation Plan
1. Create new Redux slice for audio state
2. Move VST state management to Redux
3. Implement proper loading and error states
4. Add comprehensive logging
5. Add unit tests for VST integration

### Workaround
Currently, users need to:
1. Close and reopen the VST browser after selection
2. Manually verify plugin loading in the channel strip
3. Refresh the page if plugins become unresponsive