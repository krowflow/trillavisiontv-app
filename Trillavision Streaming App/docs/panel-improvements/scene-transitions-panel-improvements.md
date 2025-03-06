# Scene Transitions Panel Improvements

## Current Issues

The Scene Transitions panel currently has several layout issues:

1. Too much content for the fixed panel height (200px)
2. Inefficient use of space with large buttons and form elements
3. Multiple sections stacked vertically, requiring excessive scrolling
4. "Create New Transition" form takes up too much space

## Proposed Solution

Redesign the Scene Transitions panel to make better use of the available space while maintaining all functionality.

### Component Structure

```jsx
<div className="flex flex-col h-full max-h-[200px] overflow-hidden">
  <h2 className="text-base font-semibold mb-1.5">Scene Transitions</h2>
  
  <div className="flex-1 overflow-y-auto custom-scrollbar">
    {/* Main content */}
  </div>
</div>
```

### Key Improvements

1. **Tabbed Interface** - Use tabs to separate different functionality
2. **Compact Transition Grid** - Display transitions in a more space-efficient grid
3. **Simplified Settings** - Show only essential settings for the selected transition
4. **Collapsible Sections** - Allow users to expand/collapse sections as needed
5. **Responsive Layout** - Ensure all elements adapt to the available space

## Detailed Implementation

### 1. Component Header

```jsx
<div className="flex flex-col h-full max-h-[200px] overflow-hidden">
  <h2 className="text-base font-semibold mb-1.5">Scene Transitions</h2>
  
  {/* Tabs */}
  <div className="flex mb-1 text-[11px] border-b border-gray-200">
    <button className="px-2 py-1 border-b-2 border-primary">Transitions</button>
    <button className="px-2 py-1">Settings</button>
    <button className="px-2 py-1">Create New</button>
  </div>
  
  {/* Content area */}
  <div className="flex-1 overflow-y-auto custom-scrollbar">
    {/* Tab content */}
  </div>
</div>
```

### 2. Transitions Tab

```jsx
{/* Available Transitions */}
<div className="mb-2">
  <h3 className="text-[11px] font-medium text-gray-700 mb-1">Available Transitions</h3>
  <div className="grid grid-cols-3 gap-1">
    {transitions.map(transition => (
      <button
        key={transition.id}
        className={`p-1 rounded-md flex flex-col items-center justify-center ${
          transition.id === selectedTransitionId
            ? 'bg-primary-light bg-opacity-10 border border-primary-light'
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}
        onClick={() => handleTransitionSelect(transition.id)}
      >
        {getTransitionIcon(transition.type)}
        <span className="text-[10px] mt-1">{transition.name}</span>
        <span className="text-[9px] text-gray-500">{transition.duration}ms</span>
      </button>
    ))}
  </div>
</div>

{/* Quick Duration Control */}
<div className="flex items-center mb-2">
  <span className="text-[11px] w-16">Duration:</span>
  <input
    type="range"
    min="100"
    max="3000"
    step="100"
    value={selectedTransition.duration}
    onChange={(e) => handleUpdateTransitionDuration(parseInt(e.target.value))}
    className="flex-1 h-1"
  />
  <span className="text-[11px] w-12 text-right">{selectedTransition.duration}ms</span>
</div>

{/* Preview Button */}
<button
  className="w-full h-8 flex items-center justify-center text-[11px] bg-primary-light bg-opacity-10 hover:bg-opacity-20 text-primary rounded-md"
  onClick={handlePreviewTransition}
  disabled={isPreviewPlaying}
>
  <Play size={12} className="mr-1" />
  Preview Transition
</button>
```

### 3. Settings Tab

```jsx
{/* Compact Settings Form */}
<div className="space-y-2">
  {/* Settings vary by transition type */}
  {selectedTransition.type === TransitionType.FADE && (
    <div>
      <label className="block text-[11px] font-medium text-gray-700 mb-1">
        Easing
      </label>
      <select
        className="block w-full text-[11px] h-6 rounded-md border-gray-300"
        value={selectedTransition.settings.easing || 'ease-in-out'}
        onChange={(e) => handleUpdateTransitionSettings({ easing: e.target.value })}
      >
        <option value="linear">Linear</option>
        <option value="ease">Ease</option>
        <option value="ease-in">Ease In</option>
        <option value="ease-out">Ease Out</option>
        <option value="ease-in-out">Ease In Out</option>
      </select>
    </div>
  )}
  
  {/* Direction settings for applicable transitions */}
  {(selectedTransition.type === TransitionType.SLIDE || 
    selectedTransition.type === TransitionType.WIPE) && (
    <div>
      <label className="block text-[11px] font-medium text-gray-700 mb-1">
        Direction
      </label>
      <div className="grid grid-cols-2 gap-1">
        <button className="p-1 text-[10px] border rounded-md">Left</button>
        <button className="p-1 text-[10px] border rounded-md">Right</button>
        <button className="p-1 text-[10px] border rounded-md">Up</button>
        <button className="p-1 text-[10px] border rounded-md">Down</button>
      </div>
    </div>
  )}
  
  {/* Additional settings specific to transition types */}
  {/* ... */}
</div>
```

### 4. Create New Tab

```jsx
{/* Compact Create Form */}
<div className="space-y-2">
  <div>
    <label className="block text-[11px] font-medium text-gray-700 mb-1">
      Name
    </label>
    <input
      type="text"
      value={newTransitionName}
      onChange={(e) => setNewTransitionName(e.target.value)}
      placeholder="Enter name"
      className="block w-full text-[11px] h-6 rounded-md border-gray-300"
    />
  </div>
  
  <div>
    <label className="block text-[11px] font-medium text-gray-700 mb-1">
      Type
    </label>
    <select
      className="block w-full text-[11px] h-6 rounded-md border-gray-300"
      value={newTransitionType}
      onChange={(e) => setNewTransitionType(e.target.value as TransitionType)}
    >
      <option value={TransitionType.FADE}>Fade</option>
      <option value={TransitionType.CUT}>Cut</option>
      <option value={TransitionType.SLIDE}>Slide</option>
      <option value={TransitionType.ZOOM}>Zoom</option>
      <option value={TransitionType.WIPE}>Wipe</option>
    </select>
  </div>
  
  <div>
    <label className="block text-[11px] font-medium text-gray-700 mb-1">
      Duration (ms)
    </label>
    <input
      type="number"
      min="0"
      max="5000"
      step="100"
      value={newTransitionDuration}
      onChange={(e) => setNewTransitionDuration(parseInt(e.target.value))}
      className="block w-full text-[11px] h-6 rounded-md border-gray-300"
    />
  </div>
  
  <button
    className="w-full h-7 text-[11px] bg-primary text-white rounded-md hover:bg-primary-dark"
    onClick={handleAddTransition}
    disabled={!newTransitionName.trim()}
  >
    Create Transition
  </button>
</div>
```

## Key Design Principles Applied

1. **Fixed Height Constraint**: Ensuring the panel stays within 200px height
2. **Efficient Space Usage**: Using compact controls and multi-column layouts
3. **Progressive Disclosure**: Using tabs to show only relevant content at a time
4. **Consistent Typography**: Using smaller font sizes (10-11px) for content
5. **Proper Overflow Handling**: Implementing scrolling only within the content area

## Implementation Notes

1. The component should maintain the same functionality while improving the layout
2. All transitions and settings should remain accessible
3. The preview functionality should work the same way
4. The form for creating new transitions should be fully functional

## CSS Considerations

1. Use `max-h-[200px]` to enforce the height constraint
2. Use `overflow-y-auto` with `custom-scrollbar` for the content area
3. Use smaller text sizes: `text-[11px]` and `text-[10px]`
4. Use compact form controls with reduced height: `h-6` or `h-7`
5. Use `grid` layouts with appropriate column counts for space efficiency

## Before/After Comparison

### Before:
- Vertical stacking of all sections
- Large form elements and buttons
- Excessive scrolling required
- Inefficient use of space

### After:
- Tabbed interface for better organization
- Compact grid layouts for transitions
- Smaller, more efficient form controls
- Better use of available space
- No need for excessive scrolling

This redesign maintains all functionality while significantly improving the layout and user experience within the fixed panel dimensions.