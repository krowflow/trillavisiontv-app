# Panel Management and Positioning Logic

## Current Issues

After reviewing the application and OBS Studio examples, we've identified several critical issues with panel management and positioning:

1. **Panel Overflow**: When multiple tabs are clicked, panels appear in rows of four extending down the page, causing panels to be hidden behind the app footer
2. **Modal Positioning**: Modals and dropdowns may extend beyond viewport boundaries or get hidden behind other elements
3. **Inconsistent Behavior**: Lack of consistent logic for how panels appear, stack, and replace each other
4. **Poor Space Management**: Inefficient use of available viewport space

## Proposed Solution

Implement a comprehensive panel management system that controls how panels appear, interact, and replace each other, along with proper positioning for all modals and dropdowns.

## Panel Management Logic

### 1. Maximum Panel Limit

```jsx
// In Dashboard component
const MAX_VISIBLE_PANELS = 4;

// When opening a new panel
const openPanel = (panel: keyof typeof activePanels) => {
  setActivePanels(prev => {
    // Count currently active panels
    const activeCount = Object.values(prev).filter(Boolean).length;
    
    // If we're already at max capacity, replace the oldest panel
    if (activeCount >= MAX_VISIBLE_PANELS && !prev[panel]) {
      // Find the oldest panel to replace
      const panelsArray = Object.entries(prev)
        .filter(([_, isActive]) => isActive)
        .sort((a, b) => panelOpenTimes[a[0]] - panelOpenTimes[b[0]]);
      
      const oldestPanel = panelsArray[0][0] as keyof typeof prev;
      
      // Create new state with oldest panel closed and new panel open
      return {
        ...prev,
        [oldestPanel]: false,
        [panel]: true
      };
    }
    
    // Otherwise just open the new panel
    return { ...prev, [panel]: true };
  });
  
  // Record the time this panel was opened
  setPanelOpenTimes(prev => ({
    ...prev,
    [panel]: Date.now()
  }));
};
```

### 2. Panel Grid Layout

```jsx
// In Dashboard component
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[200px]">
  {/* Render only active panels in a fixed grid */}
  {Object.entries(activePanels)
    .filter(([_, isActive]) => isActive)
    .map(([panelKey, _]) => (
      <Card key={panelKey} className="h-full p-3">
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => closePanel(panelKey as keyof typeof activePanels)}
            className="h-6 w-6 p-0 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>
        {renderPanelContent(panelKey as keyof typeof activePanels)}
      </Card>
    ))}
</div>
```

### 3. Panel Replacement Strategy

When a user clicks on a tab that would open a new panel:

1. Check if the panel is already open
   - If yes, do nothing (or optionally focus on that panel)
   - If no, continue to step 2
2. Check if we're already at the maximum number of visible panels
   - If no, simply open the new panel
   - If yes, determine which panel to replace:
     - Option A: Replace the oldest opened panel (FIFO)
     - Option B: Replace the least recently used panel (LRU)
     - Option C: Allow user to configure replacement behavior

### 4. Panel State Tracking

```jsx
// In Dashboard component
const [activePanels, setActivePanels] = useState<{
  [key: string]: boolean;
}>({
  streamControls: false,
  deviceSettings: false,
  sceneManager: true,
  sourceManager: true,
  layoutManager: true,
  brandSettings: false,
  streamSettings: false,
  chat: false,
  audioMixer: false,
  analytics: false,
  sceneTransition: false,
  overlayTemplates: false,
  recording: false
});

// Track when each panel was opened
const [panelOpenTimes, setPanelOpenTimes] = useState<{
  [key: string]: number;
}>({});

// Track when each panel was last interacted with
const [panelLastUsed, setPanelLastUsed] = useState<{
  [key: string]: number;
}>({});
```

## Modal and Dropdown Positioning

### 1. Modal Positioning Logic

```jsx
// Utility function for positioning modals
const positionModal = (triggerElement, modalElement, options = {}) => {
  const {
    preferredPlacement = 'center', // 'center', 'top', 'right', 'bottom', 'left'
    offset = 8,
    preventOverflow = true
  } = options;
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get trigger element dimensions and position
  const triggerRect = triggerElement.getBoundingClientRect();
  
  // Get modal dimensions
  const modalRect = modalElement.getBoundingClientRect();
  
  // Calculate initial position based on preferred placement
  let top, left;
  
  switch (preferredPlacement) {
    case 'center':
      top = (viewportHeight - modalRect.height) / 2;
      left = (viewportWidth - modalRect.width) / 2;
      break;
    case 'top':
      top = triggerRect.top - modalRect.height - offset;
      left = triggerRect.left + (triggerRect.width - modalRect.width) / 2;
      break;
    case 'right':
      top = triggerRect.top + (triggerRect.height - modalRect.height) / 2;
      left = triggerRect.right + offset;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset;
      left = triggerRect.left + (triggerRect.width - modalRect.width) / 2;
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height - modalRect.height) / 2;
      left = triggerRect.left - modalRect.width - offset;
      break;
  }
  
  // Prevent overflow if enabled
  if (preventOverflow) {
    // Prevent top overflow
    if (top < 0) top = offset;
    // Prevent right overflow
    if (left + modalRect.width > viewportWidth) 
      left = viewportWidth - modalRect.width - offset;
    // Prevent bottom overflow
    if (top + modalRect.height > viewportHeight)
      top = viewportHeight - modalRect.height - offset;
    // Prevent left overflow
    if (left < 0) left = offset;
  }
  
  // Apply position
  modalElement.style.top = `${top}px`;
  modalElement.style.left = `${left}px`;
};
```

### 2. Dropdown Menu Positioning

```jsx
// Utility function for positioning dropdown menus
const positionDropdown = (triggerElement, dropdownElement, options = {}) => {
  const {
    preferredPlacement = 'bottom', // 'top', 'right', 'bottom', 'left'
    offset = 4,
    preventOverflow = true
  } = options;
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get trigger element dimensions and position
  const triggerRect = triggerElement.getBoundingClientRect();
  
  // Get dropdown dimensions
  const dropdownRect = dropdownElement.getBoundingClientRect();
  
  // Calculate initial position based on preferred placement
  let top, left;
  
  switch (preferredPlacement) {
    case 'top':
      top = triggerRect.top - dropdownRect.height - offset;
      left = triggerRect.left;
      break;
    case 'right':
      top = triggerRect.top;
      left = triggerRect.right + offset;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset;
      left = triggerRect.left;
      break;
    case 'left':
      top = triggerRect.top;
      left = triggerRect.left - dropdownRect.width - offset;
      break;
  }
  
  // Prevent overflow if enabled
  if (preventOverflow) {
    // Check if dropdown would overflow bottom
    if (top + dropdownRect.height > viewportHeight) {
      // Position above trigger instead
      top = triggerRect.top - dropdownRect.height - offset;
    }
    
    // Check if dropdown would overflow right
    if (left + dropdownRect.width > viewportWidth) {
      // Align right edge with trigger right edge
      left = triggerRect.right - dropdownRect.width;
    }
    
    // Check if dropdown would overflow top
    if (top < 0) {
      // Position below trigger instead
      top = triggerRect.bottom + offset;
    }
    
    // Check if dropdown would overflow left
    if (left < 0) {
      // Align left edge with trigger left edge
      left = triggerRect.left;
    }
  }
  
  // Apply position
  dropdownElement.style.top = `${top}px`;
  dropdownElement.style.left = `${left}px`;
};
```

### 3. Context Menu Positioning

```jsx
// Event handler for context menus
const handleContextMenu = (event, menuElement) => {
  event.preventDefault();
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get menu dimensions
  const menuRect = menuElement.getBoundingClientRect();
  
  // Get click position
  let { clientX, clientY } = event;
  
  // Prevent overflow
  if (clientX + menuRect.width > viewportWidth) {
    clientX = viewportWidth - menuRect.width - 5;
  }
  
  if (clientY + menuRect.height > viewportHeight) {
    clientY = viewportHeight - menuRect.height - 5;
  }
  
  // Apply position
  menuElement.style.top = `${clientY}px`;
  menuElement.style.left = `${clientX}px`;
  
  // Show menu
  menuElement.style.display = 'block';
  
  // Add event listener to hide menu when clicking outside
  const hideMenu = () => {
    menuElement.style.display = 'none';
    document.removeEventListener('click', hideMenu);
  };
  
  document.addEventListener('click', hideMenu);
};
```

## Implementation Strategy

### 1. Panel Management Component

Create a dedicated `PanelManager` component that handles:

```jsx
// PanelManager.tsx
import React, { useState, useEffect } from 'react';

interface PanelManagerProps {
  children: React.ReactNode;
  maxPanels?: number;
  replacementStrategy?: 'fifo' | 'lru';
}

export const PanelManager: React.FC<PanelManagerProps> = ({
  children,
  maxPanels = 4,
  replacementStrategy = 'fifo'
}) => {
  // Panel state management logic
  const [activePanels, setActivePanels] = useState<string[]>([]);
  const [panelOpenTimes, setPanelOpenTimes] = useState<Record<string, number>>({});
  const [panelLastUsed, setPanelLastUsed] = useState<Record<string, number>>({});
  
  // Panel management methods
  const openPanel = (panelId: string) => {
    // Implementation of panel opening with replacement logic
  };
  
  const closePanel = (panelId: string) => {
    // Implementation of panel closing
  };
  
  const focusPanel = (panelId: string) => {
    // Implementation of panel focusing
  };
  
  // Provide context to children
  return (
    <PanelContext.Provider value={{ 
      activePanels, 
      openPanel, 
      closePanel, 
      focusPanel 
    }}>
      {children}
    </PanelContext.Provider>
  );
};
```

### 2. Positioning Utilities

Create utility functions for positioning:

```jsx
// positioning.ts
export const calculateModalPosition = (
  trigger: HTMLElement | null,
  modal: HTMLElement,
  placement: 'center' | 'top' | 'right' | 'bottom' | 'left' = 'center',
  offset = 8
): { top: number; left: number } => {
  // Implementation of modal positioning logic
};

export const calculateDropdownPosition = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom',
  offset = 4
): { top: number; left: number } => {
  // Implementation of dropdown positioning logic
};
```

### 3. React Hooks for Positioning

Create custom hooks for easy positioning:

```jsx
// useModalPosition.ts
export const useModalPosition = (
  triggerRef: React.RefObject<HTMLElement>,
  modalRef: React.RefObject<HTMLElement>,
  options: PositionOptions = {}
) => {
  // Implementation of modal positioning hook
};

// useDropdownPosition.ts
export const useDropdownPosition = (
  triggerRef: React.RefObject<HTMLElement>,
  dropdownRef: React.RefObject<HTMLElement>,
  options: PositionOptions = {}
) => {
  // Implementation of dropdown positioning hook
};
```

## Dashboard Component Updates

Update the Dashboard component to implement the panel management logic:

```jsx
// Dashboard.tsx
const Dashboard: React.FC = () => {
  // Panel state
  const [activePanels, setActivePanels] = useState<Record<string, boolean>>({
    // Initial panel state
  });
  
  // Panel tracking
  const [panelOpenTimes, setPanelOpenTimes] = useState<Record<string, number>>({});
  
  // Maximum number of visible panels
  const MAX_VISIBLE_PANELS = 4;
  
  // Panel management functions
  const openPanel = (panel: keyof typeof activePanels, exclusive = false) => {
    setActivePanels(prev => {
      // If exclusive mode, close all other panels
      if (exclusive) {
        const newPanels = Object.keys(prev).reduce((acc, key) => ({
          ...acc,
          [key]: key === panel
        }), {} as typeof prev);
        return newPanels;
      }
      
      // Count currently active panels
      const activeCount = Object.values(prev).filter(Boolean).length;
      
      // If panel is already active, do nothing
      if (prev[panel]) return prev;
      
      // If we're at max capacity, replace oldest panel
      if (activeCount >= MAX_VISIBLE_PANELS) {
        // Find oldest panel
        const oldestPanel = Object.entries(prev)
          .filter(([_, isActive]) => isActive)
          .sort((a, b) => panelOpenTimes[a[0]] - panelOpenTimes[b[0]])
          [0][0] as keyof typeof prev;
        
        // Replace it
        return {
          ...prev,
          [oldestPanel]: false,
          [panel]: true
        };
      }
      
      // Otherwise just open the new panel
      return { ...prev, [panel]: true };
    });
    
    // Record open time
    setPanelOpenTimes(prev => ({
      ...prev,
      [panel]: Date.now()
    }));
  };
  
  // Rest of component...
};
```

## Benefits of This Approach

1. **Controlled Panel Management**: Ensures only a maximum of 4 panels are visible at once
2. **Intelligent Replacement**: Replaces panels based on a consistent strategy (FIFO or LRU)
3. **Proper Positioning**: All modals and dropdowns are positioned to avoid overflow and hidden elements
4. **Consistent User Experience**: Users can predict how the UI will behave when opening new panels
5. **Efficient Space Usage**: Makes optimal use of available viewport space

## Implementation Notes

1. The panel management logic should be implemented at the Dashboard component level
2. Positioning utilities should be implemented as reusable functions or hooks
3. All modals and dropdowns should use the positioning utilities
4. The maximum number of visible panels should be configurable but default to 4
5. The replacement strategy should be configurable but default to FIFO (First In, First Out)

This approach ensures that our panel management and positioning logic matches the professional quality of OBS Studio's interface, with panels, modals, and dropdowns that are properly positioned and never extend beyond the viewport or get hidden behind other elements.