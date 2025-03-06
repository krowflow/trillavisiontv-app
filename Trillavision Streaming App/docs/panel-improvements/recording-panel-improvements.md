# Recording Panel Improvements

## Current Issues

The Recording panel currently has several layout issues:

1. Recording settings take up significant vertical space
2. Format and resolution selectors are not space-efficient
3. Limited space for recording history and status information
4. Controls and options are not organized optimally

## Proposed Solution

Redesign the Recording panel to efficiently organize recording controls and settings while providing better access to recording history.

### Component Structure

```jsx
<div className="flex flex-col h-full max-h-[200px] overflow-hidden">
  <h2 className="text-base font-semibold mb-1.5">Recording</h2>
  
  <div className="flex-1 overflow-y-auto custom-scrollbar">
    {/* Main content */}
  </div>
</div>
```

### Key Improvements

1. **Tabbed Interface** - Use tabs to separate recording controls and history
2. **Compact Controls** - Make recording settings more space-efficient
3. **Status Indicators** - Use compact status pills for important information
4. **Responsive Layout** - Ensure all elements adapt to the available space

## Detailed Implementation

### 1. Recording Tabs

```jsx
{/* Recording tabs */}
<div className="flex mb-2 text-[11px] border-b border-gray-200">
  <button className="px-2 py-1 border-b-2 border-primary flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    Record
  </button>
  <button className="px-2 py-1 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    History
  </button>
  <button className="px-2 py-1 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    Settings
  </button>
</div>
```

### 2. Record Tab Content

```jsx
{/* Not Recording State */}
<div>
  {/* Recording controls */}
  <div className="flex justify-center mb-3">
    <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>
  </div>
  
  {/* Quick settings */}
  <div className="grid grid-cols-2 gap-1.5 mb-2">
    <div className="flex flex-col">
      <label className="text-[10px] text-gray-500 mb-0.5">Format</label>
      <select className="h-6 text-[11px] rounded-md border-gray-300">
        <option>MP4</option>
        <option>MKV</option>
        <option>MOV</option>
      </select>
    </div>
    <div className="flex flex-col">
      <label className="text-[10px] text-gray-500 mb-0.5">Resolution</label>
      <select className="h-6 text-[11px] rounded-md border-gray-300">
        <option>1080p</option>
        <option>720p</option>
        <option>480p</option>
      </select>
    </div>
  </div>
  
  {/* Audio/Video toggles */}
  <div className="flex justify-between mb-2">
    <div className="flex-1 flex items-center justify-center">
      <span className="text-[10px] text-gray-700 mr-1">Video</span>
      <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked
        />
        <span className="block h-4 w-8 rounded-full bg-primary"></span>
        <span className="absolute left-4 top-0.5 bg-white h-3 w-3 rounded-full transition-transform"></span>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <span className="text-[10px] text-gray-700 mr-1">Audio</span>
      <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked
        />
        <span className="block h-4 w-8 rounded-full bg-primary"></span>
        <span className="absolute left-4 top-0.5 bg-white h-3 w-3 rounded-full transition-transform"></span>
      </div>
    </div>
  </div>
  
  {/* Storage info */}
  <div className="p-1.5 bg-gray-50 rounded-md">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-gray-500">Storage Location:</span>
      <span className="text-[10px] text-gray-700 truncate max-w-[150px]">C:/Videos/Recordings</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-gray-500">Available Space:</span>
      <span className="text-[10px] text-gray-700">128.5 GB</span>
    </div>
  </div>
</div>
```

### 3. Recording State

```jsx
{/* Recording State */}
<div>
  {/* Recording status */}
  <div className="flex items-center justify-center mb-3">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center relative">
        <div className="absolute w-6 h-6 bg-white rounded-sm"></div>
        <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-75"></div>
      </div>
      <div className="mt-1 flex items-center">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1 animate-pulse"></div>
        <span className="text-[11px] font-medium text-red-600">RECORDING</span>
      </div>
    </div>
  </div>
  
  {/* Recording info */}
  <div className="grid grid-cols-3 gap-1 mb-2">
    <div className="p-1 bg-gray-50 rounded-md text-center">
      <div className="text-[9px] text-gray-500">Duration</div>
      <div className="text-[12px] font-medium">01:24:36</div>
    </div>
    <div className="p-1 bg-gray-50 rounded-md text-center">
      <div className="text-[9px] text-gray-500">Size</div>
      <div className="text-[12px] font-medium">1.2 GB</div>
    </div>
    <div className="p-1 bg-gray-50 rounded-md text-center">
      <div className="text-[9px] text-gray-500">Bitrate</div>
      <div className="text-[12px] font-medium">12 Mbps</div>
    </div>
  </div>
  
  {/* Recording controls */}
  <div className="flex justify-between mb-2">
    <button className="px-2 py-1 text-[10px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      Split Recording
    </button>
    <button className="px-2 py-1 text-[10px] bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Stop Recording
    </button>
  </div>
  
  {/* File info */}
  <div className="p-1.5 bg-gray-50 rounded-md">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-gray-500">Filename:</span>
      <span className="text-[10px] text-gray-700 truncate max-w-[150px]">Recording_2025-03-05_20-29-05.mp4</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-gray-500">Location:</span>
      <span className="text-[10px] text-gray-700 truncate max-w-[150px]">C:/Videos/Recordings</span>
    </div>
  </div>
</div>
```

### 4. History Tab Content

```jsx
{/* Recording history */}
<div className="space-y-1.5">
  {/* Recording entry 1 */}
  <div className="p-1.5 bg-gray-50 rounded-md">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-medium text-gray-700 truncate max-w-[150px]">Recording_2025-03-05_18-45-12.mp4</span>
      <span className="text-[9px] text-gray-500">2.4 GB</span>
    </div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[9px] text-gray-500">Duration: 1:24:36</span>
      <span className="text-[9px] text-gray-500">1080p</span>
    </div>
    <div className="flex justify-end space-x-1">
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
        Play
      </button>
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
        Folder
      </button>
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-red-600 rounded-md hover:bg-gray-50">
        Delete
      </button>
    </div>
  </div>
  
  {/* Recording entry 2 */}
  <div className="p-1.5 bg-gray-50 rounded-md">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-medium text-gray-700 truncate max-w-[150px]">Recording_2025-03-04_20-12-45.mp4</span>
      <span className="text-[9px] text-gray-500">1.8 GB</span>
    </div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[9px] text-gray-500">Duration: 0:58:22</span>
      <span className="text-[9px] text-gray-500">1080p</span>
    </div>
    <div className="flex justify-end space-x-1">
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
        Play
      </button>
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
        Folder
      </button>
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-red-600 rounded-md hover:bg-gray-50">
        Delete
      </button>
    </div>
  </div>
  
  {/* Recording entry 3 */}
  <div className="p-1.5 bg-gray-50 rounded-md">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-medium text-gray-700 truncate max-w-[150px]">Recording_2025-03-03_15-30-08.mp4</span>
      <span className="text-[9px] text-gray-500">3.2 GB</span>
    </div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[9px] text-gray-500">Duration: 2:12:05</span>
      <span className="text-[9px] text-gray-500">1080p</span>
    </div>
    <div className="flex justify-end space-x-1">
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
        Play
      </button>
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
        Folder
      </button>
      <button className="px-1.5 py-0.5 text-[9px] bg-white border border-gray-300 text-red-600 rounded-md hover:bg-gray-50">
        Delete
      </button>
    </div>
  </div>
</div>
```

### 5. Settings Tab Content

```jsx
{/* Recording settings */}
<div className="space-y-2">
  {/* Format settings */}
  <div>
    <label className="block text-[11px] text-gray-700 font-medium mb-1">Recording Format</label>
    <div className="relative">
      <select className="w-full h-7 text-[11px] pr-8 rounded-md border-gray-300">
        <option>MP4 (H.264 / AAC)</option>
        <option>MKV (H.264 / AAC)</option>
        <option>MOV (H.264 / AAC)</option>
        <option>MP4 (HEVC / AAC)</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
  
  {/* Quality settings */}
  <div className="grid grid-cols-2 gap-1.5">
    <div className="flex flex-col">
      <label className="text-[10px] text-gray-700 mb-0.5">Video Quality</label>
      <select className="h-6 text-[11px] rounded-md border-gray-300">
        <option>High (12 Mbps)</option>
        <option>Medium (8 Mbps)</option>
        <option>Low (4 Mbps)</option>
        <option>Custom</option>
      </select>
    </div>
    <div className="flex flex-col">
      <label className="text-[10px] text-gray-700 mb-0.5">Audio Quality</label>
      <select className="h-6 text-[11px] rounded-md border-gray-300">
        <option>High (320 kbps)</option>
        <option>Medium (192 kbps)</option>
        <option>Low (128 kbps)</option>
      </select>
    </div>
  </div>
  
  {/* Storage location */}
  <div>
    <label className="block text-[11px] text-gray-700 font-medium mb-1">Storage Location</label>
    <div className="flex">
      <input
        type="text"
        value="C:/Videos/Recordings"
        className="flex-1 h-7 text-[11px] rounded-l-md border-gray-300"
        readOnly
      />
      <button className="px-2 h-7 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md text-gray-700 hover:bg-gray-200">
        Browse
      </button>
    </div>
  </div>
  
  {/* Advanced options */}
  <div className="space-y-1">
    <div className="flex items-center">
      <input
        type="checkbox"
        id="separateAudioTracks"
        className="h-3 w-3 text-primary border-gray-300 rounded"
      />
      <label htmlFor="separateAudioTracks" className="ml-1 text-[11px] text-gray-700">
        Record separate audio tracks
      </label>
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        id="autoFilename"
        className="h-3 w-3 text-primary border-gray-300 rounded"
        checked
      />
      <label htmlFor="autoFilename" className="ml-1 text-[11px] text-gray-700">
        Automatic file naming
      </label>
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        id="recordStream"
        className="h-3 w-3 text-primary border-gray-300 rounded"
        checked
      />
      <label htmlFor="recordStream" className="ml-1 text-[11px] text-gray-700">
        Record while streaming
      </label>
    </div>
  </div>
</div>
```

### 6. Action Buttons

```jsx
{/* Action buttons - shown in all tabs */}
<div className="mt-2 pt-2 border-t border-gray-200">
  <div className="flex justify-between">
    <button className="px-2 py-1 text-[10px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
      Open Recordings Folder
    </button>
    <button className="px-2 py-1 text-[10px] bg-primary text-white rounded-md hover:bg-primary-dark">
      Save Settings
    </button>
  </div>
</div>
```

## Key Design Principles Applied

1. **Fixed Height Constraint**: Ensuring the panel stays within 200px height
2. **Efficient Space Usage**: Using compact controls and status indicators
3. **Progressive Disclosure**: Using tabs to separate recording, history, and settings
4. **Consistent Typography**: Using smaller font sizes (9-11px) for content
5. **Proper Overflow Handling**: Implementing scrolling only within the content area

## Implementation Notes

1. The component should maintain the selected tab state
2. The recording state should update in real-time
3. Recording history should be populated from actual recordings
4. Settings should be saved and applied immediately when changed

## CSS Considerations

1. Use `max-h-[200px]` to enforce the height constraint
2. Use `overflow-y-auto` with `custom-scrollbar` for the content area
3. Use smaller text sizes: `text-[9px]`, `text-[10px]`, and `text-[11px]`
4. Use `grid` layouts with appropriate column counts for space efficiency
5. Use compact form controls with reduced height: `h-6` or `h-7`

## Before/After Comparison

### Before:
- Recording settings take up significant vertical space
- Format and resolution selectors are not space-efficient
- Limited space for recording history and status information
- Controls and options are not organized optimally

### After:
- Tabbed interface separates recording controls, history, and settings
- Compact recording controls and settings
- Efficient display of recording history
- Clear status indicators and information
- All elements fit within the fixed panel height

This redesign maintains all functionality while significantly improving the layout and user experience within the fixed panel dimensions.