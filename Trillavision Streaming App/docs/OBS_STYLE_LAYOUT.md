# OBS-Style Layout Implementation Guide for Trillavision T.V.

## Overview

This document outlines the layout and organization changes needed to implement an OBS-style interface for Trillavision T.V. while maintaining our existing functionality and design language.

## Layout Structure

### Preview/Program Windows

1. **Window Sizing**
   - Reduce window heights to approximately 40% of viewport
   - Maintain 16:9 aspect ratio
   - Windows should sit side-by-side in studio mode
   - Single window should expand when not in studio mode

2. **Transition Panel**
   - Sits between Preview and Program windows in studio mode
   - Contains quick transition controls
   - Disappears in single window mode

### Panel Organization

The interface will maintain four main panels below the preview/program windows:

1. **Scenes Panel (Left)**
   - Scene list with thumbnails
   - Scene collection management
   - Add/remove scene controls
   - Scene properties and filters
   - Quick access to scene transitions

2. **Sources Panel (Center-Left)**
   - Source list for current scene
   - Source visibility toggles
   - Source properties access
   - Source ordering controls
   - Add/remove source buttons
   - Source filters

3. **Audio Mixer Panel (Center-Right)**
   - VU meters for all audio sources
   - Per-source volume controls
   - Mute/unmute toggles
   - Audio monitoring options
   - Advanced audio properties
   - VST plugin controls
   - Podcasting mode controls

4. **Controls Panel (Right)**
   - Stream control buttons
   - Recording controls
   - Studio mode toggle
   - YouTube connection status
   - Settings access
   - Exit button

## Panel Dimensions and Layout

### Viewport Organization
```
+------------------+-------+------------------+
|     Preview      | Trans |     Program     |
|                  | ition |                 |
+------------------+-------+------------------+
+--------+---------+--------+----------------+
| Scenes | Sources | Audio  |    Controls    |
|        |         | Mixer  |                |
+--------+---------+--------+----------------+
```

### Sizing Guidelines
- Total height should not exceed viewport
- Panels should maintain consistent heights
- No scrolling required for main controls
- Proportional widths:
  - Scenes: 20%
  - Sources: 30%
  - Audio Mixer: 30%
  - Controls: 20%

## Feature Organization

### 1. Scenes Panel
- Scene list
- Scene collection dropdown
- Scene transitions
- Scene properties
- Scene filters

### 2. Sources Panel
- Source list
- Source properties
- Source filters
- Transform controls
- Interaction properties

### 3. Audio Mixer Panel
- Audio levels
- Volume controls
- Audio processors
  - Compressor
  - Gate
  - EQ
  - Limiter
  - De-esser
- VST plugins
- Podcasting controls

### 4. Controls Panel
- Stream status
- Start/Stop streaming
- Start/Stop recording
- Studio mode toggle
- Settings access
- YouTube integration
- Exit application

## Implementation Notes

1. **Existing Functionality**
   - Maintain all current features and capabilities
   - Keep existing color scheme and design language
   - Preserve tab system for panel management
   - Retain popup card functionality

2. **Panel Management**
   - Maximum 4 panels visible simultaneously
   - Panels should not extend beyond preview/program borders
   - All controls visible without scrolling
   - Logical grouping of related controls

3. **Responsive Behavior**
   - Maintain aspect ratios at all viewport sizes
   - Scale preview/program windows proportionally
   - Keep controls accessible and visible
   - No horizontal scrolling

4. **User Experience**
   - Quick access to essential controls
   - Logical flow from left to right
   - Clear visual hierarchy
   - Consistent interaction patterns

## Technical Requirements

1. **Layout Components**
   - Flexbox/Grid for main layout
   - CSS Grid for panel organization
   - Responsive breakpoints
   - Aspect ratio preservation

2. **State Management**
   - Panel visibility state
   - Studio mode state
   - Window size calculations
   - Layout mode tracking

3. **Performance Considerations**
   - Efficient rendering
   - Minimal layout shifts
   - Smooth transitions
   - Optimized panel updates

## Migration Strategy

1. **Phase 1: Layout Structure**
   - Implement new window sizing
   - Add transition panel
   - Organize main panels

2. **Phase 2: Panel Organization**
   - Reorganize controls into logical groups
   - Implement panel sizing
   - Add panel constraints

3. **Phase 3: Feature Migration**
   - Move features to appropriate panels
   - Update interaction patterns
   - Implement new transitions

4. **Phase 4: Polish**
   - Fine-tune spacing
   - Optimize responsiveness
   - Add final transitions
   - Implement edge cases

## Success Criteria

1. **Layout**
   - All controls visible without scrolling
   - Consistent panel sizes
   - Proper aspect ratios
   - Smooth transitions

2. **Functionality**
   - All existing features preserved
   - Logical control grouping
   - Efficient workflow
   - Intuitive navigation

3. **Performance**
   - No layout shifts
   - Smooth animations
   - Responsive behavior
   - Efficient updates

4. **User Experience**
   - Clear visual hierarchy
   - Consistent interaction patterns
   - Intuitive control access
   - Professional appearance