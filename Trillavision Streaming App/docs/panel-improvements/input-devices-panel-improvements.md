# Input Devices Panel Improvements

## Current Issues

The Input Devices panel currently has several layout issues:

1. Device selection dropdowns take up significant vertical space
2. Multiple device types (Camera, Microphone, Screen) are stacked vertically
3. Limited space for device options and settings
4. No efficient way to handle multiple devices of each type

## Proposed Solution

Redesign the Input Devices panel to efficiently organize device selection options and provide better access to device settings.

### Component Structure

```jsx
<div className="flex flex-col h-full max-h-[200px] overflow-hidden">
  <h2 className="text-base font-semibold mb-1.5">Input Devices</h2>
  
  <div className="flex-1 overflow-y-auto custom-scrollbar">
    {/* Main content */}
  </div>
</div>
```

### Key Improvements

1. **Tabbed Interface** - Use tabs to separate different device types
2. **Compact Dropdowns** - Make device selection controls more space-efficient
3. **Quick Settings** - Add easy access to common device settings
4. **Responsive Layout** - Ensure all elements adapt to the available space

## Detailed Implementation

### 1. Device Type Tabs

```jsx
{/* Device type tabs */}
<div className="flex mb-2 text-[11px] border-b border-gray-200">
  <button className="px-2 py-1 border-b-2 border-primary flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    Camera
  </button>
  <button className="px-2 py-1 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
    Microphone
  </button>
  <button className="px-2 py-1 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    Screen
  </button>
</div>
```

### 2. Camera Tab Content

```jsx
{/* Camera selection */}
<div className="mb-2">
  <div className="flex items-center justify-between mb-1">
    <label className="text-[11px] text-gray-700 font-medium">Select Camera</label>
    <button className="text-[10px] text-primary hover:text-primary-dark">Refresh</button>
  </div>
  <div className="relative">
    <select className="w-full h-7 text-[11px] pr-8 rounded-md border-gray-300">
      <option>Sony ZV-E1 Vlogging Camera</option>
      <option>Integrated Webcam</option>
      <option>Logitech C920</option>
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

{/* Camera preview */}
<div className="mb-2 bg-gray-100 rounded-md h-16 flex items-center justify-center">
  <div className="text-[10px] text-gray-500">Camera Preview</div>
</div>

{/* Quick settings */}
<div className="grid grid-cols-2 gap-1.5">
  <div className="flex flex-col">
    <label className="text-[10px] text-gray-500 mb-0.5">Resolution</label>
    <select className="h-6 text-[10px] rounded-md border-gray-300">
      <option>1080p</option>
      <option>720p</option>
      <option>480p</option>
    </select>
  </div>
  <div className="flex flex-col">
    <label className="text-[10px] text-gray-500 mb-0.5">Frame Rate</label>
    <select className="h-6 text-[10px] rounded-md border-gray-300">
      <option>30 fps</option>
      <option>60 fps</option>
      <option>24 fps</option>
    </select>
  </div>
</div>

{/* Advanced settings button */}
<button className="w-full h-6 text-[10px] text-primary bg-primary-light bg-opacity-10 rounded mt-2 hover:bg-opacity-20">
  Advanced Camera Settings
</button>
```

### 3. Microphone Tab Content

```jsx
{/* Microphone selection */}
<div className="mb-2">
  <div className="flex items-center justify-between mb-1">
    <label className="text-[11px] text-gray-700 font-medium">Select Microphone</label>
    <button className="text-[10px] text-primary hover:text-primary-dark">Refresh</button>
  </div>
  <div className="relative">
    <select className="w-full h-7 text-[11px] pr-8 rounded-md border-gray-300">
      <option>Shure SM7B (Main)</option>
      <option>Built-in Microphone</option>
      <option>Headset Microphone</option>
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

{/* Audio level meter */}
<div className="mb-2">
  <div className="flex items-center justify-between mb-1">
    <label className="text-[10px] text-gray-500">Input Level</label>
    <div className="flex items-center">
      <button className="text-[10px] text-gray-500 hover:text-gray-700 mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      </button>
      <button className="text-[10px] text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </button>
    </div>
  </div>
  <div className="h-4 bg-gray-100 rounded-md overflow-hidden">
    <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-3/5"></div>
  </div>
</div>

{/* Quick settings */}
<div className="grid grid-cols-2 gap-1.5">
  <div className="flex flex-col">
    <label className="text-[10px] text-gray-500 mb-0.5">Gain</label>
    <div className="flex items-center">
      <input
        type="range"
        min="0"
        max="100"
        value="75"
        className="flex-1 h-1"
      />
      <span className="text-[10px] w-6 text-right">75%</span>
    </div>
  </div>
  <div className="flex flex-col">
    <label className="text-[10px] text-gray-500 mb-0.5">Monitoring</label>
    <select className="h-6 text-[10px] rounded-md border-gray-300">
      <option>Off</option>
      <option>Monitor</option>
      <option>Monitor + Echo</option>
    </select>
  </div>
</div>

{/* Podcasting mode toggle */}
<div className="flex items-center mt-2">
  <input
    type="checkbox"
    id="podcastingMode"
    className="h-3 w-3 text-primary border-gray-300 rounded"
  />
  <label htmlFor="podcastingMode" className="ml-1 text-[11px] text-gray-700">
    Enable Podcasting Mode (Dual Microphone)
  </label>
</div>

{/* Advanced settings button */}
<button className="w-full h-6 text-[10px] text-primary bg-primary-light bg-opacity-10 rounded mt-2 hover:bg-opacity-20">
  Advanced Audio Settings
</button>
```

### 4. Screen Tab Content

```jsx
{/* Screen selection */}
<div className="mb-2">
  <div className="flex items-center justify-between mb-1">
    <label className="text-[11px] text-gray-700 font-medium">Select Display</label>
    <button className="text-[10px] text-primary hover:text-primary-dark">Refresh</button>
  </div>
  <div className="relative">
    <select className="w-full h-7 text-[11px] pr-8 rounded-md border-gray-300">
      <option>Primary Display</option>
      <option>Secondary Display</option>
      <option>Application Window</option>
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

{/* Screen preview */}
<div className="mb-2 bg-gray-100 rounded-md h-16 flex items-center justify-center">
  <div className="text-[10px] text-gray-500">Screen Preview</div>
</div>

{/* Quick settings */}
<div className="grid grid-cols-2 gap-1.5">
  <div className="flex flex-col">
    <label className="text-[10px] text-gray-500 mb-0.5">Resolution</label>
    <select className="h-6 text-[10px] rounded-md border-gray-300">
      <option>Source Resolution</option>
      <option>1080p</option>
      <option>720p</option>
    </select>
  </div>
  <div className="flex flex-col">
    <label className="text-[10px] text-gray-500 mb-0.5">Frame Rate</label>
    <select className="h-6 text-[10px] rounded-md border-gray-300">
      <option>60 fps</option>
      <option>30 fps</option>
      <option>15 fps</option>
    </select>
  </div>
</div>

{/* Capture options */}
<div className="flex items-center mt-2">
  <input
    type="checkbox"
    id="captureCursor"
    className="h-3 w-3 text-primary border-gray-300 rounded"
    checked
  />
  <label htmlFor="captureCursor" className="ml-1 text-[11px] text-gray-700">
    Capture Cursor
  </label>
</div>

{/* Advanced settings button */}
<button className="w-full h-6 text-[10px] text-primary bg-primary-light bg-opacity-10 rounded mt-2 hover:bg-opacity-20">
  Advanced Screen Capture Settings
</button>
```

### 5. Add Device Button

```jsx
{/* Add device button - shown in all tabs */}
<div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
  <button className="px-2 py-1 text-[10px] bg-primary text-white rounded-md hover:bg-primary-dark flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    Add Device
  </button>
  <button className="px-2 py-1 text-[10px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
    Device Manager
  </button>
</div>
```

## Key Design Principles Applied

1. **Fixed Height Constraint**: Ensuring the panel stays within 200px height
2. **Efficient Space Usage**: Using compact controls and device selectors
3. **Progressive Disclosure**: Using tabs to show only relevant device types at a time
4. **Consistent Typography**: Using smaller font sizes (10-11px) for content
5. **Proper Overflow Handling**: Implementing scrolling only within the content area

## Implementation Notes

1. The component should maintain the selected tab state
2. Device lists should be populated dynamically from available devices
3. Preview areas should show actual device output when possible
4. Settings should be saved and applied immediately when changed

## CSS Considerations

1. Use `max-h-[200px]` to enforce the height constraint
2. Use `overflow-y-auto` with `custom-scrollbar` for the content area
3. Use smaller text sizes: `text-[10px]` and `text-[11px]`
4. Use `grid` layouts with appropriate column counts for space efficiency
5. Use compact form controls with reduced height: `h-6` or `h-7`

## Before/After Comparison

### Before:
- Device selection dropdowns take up significant vertical space
- Multiple device types are stacked vertically
- Limited space for device options and settings
- No efficient way to handle multiple devices of each type

### After:
- Tabbed interface separates device types
- Compact device selection controls
- Quick access to common settings
- Preview areas for visual feedback
- All elements fit within the fixed panel height

This redesign maintains all functionality while significantly improving the layout and user experience within the fixed panel dimensions.