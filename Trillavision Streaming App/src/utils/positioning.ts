/**
 * Utility functions for positioning modals, dropdowns, and other UI elements
 */

export type Placement = 'top' | 'right' | 'bottom' | 'left' | 'center';

export interface PositionOptions {
  placement?: Placement;
  offset?: number;
  preventOverflow?: boolean;
  flip?: boolean;
  matchWidth?: boolean;
}

/**
 * Calculate the position for a modal element
 * @param trigger The trigger element that opened the modal
 * @param modal The modal element to position
 * @param options Positioning options
 * @returns The calculated position
 */
export const calculateModalPosition = (
  trigger: HTMLElement | null,
  modal: HTMLElement,
  options: PositionOptions = {}
): { top: number; left: number } => {
  const {
    placement = 'center',
    offset = 8,
    preventOverflow = true,
    flip = true,
    matchWidth = false
  } = options;
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get modal dimensions
  const modalRect = modal.getBoundingClientRect();
  
  // Default position (center of viewport)
  let top = (viewportHeight - modalRect.height) / 2;
  let left = (viewportWidth - modalRect.width) / 2;
  
  // If we have a trigger element, position relative to it
  if (trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    
    switch (placement) {
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
      // Center is the default
    }
    
    // Match width if requested
    if (matchWidth) {
      modal.style.width = `${triggerRect.width}px`;
    }
  }
  
  // Prevent overflow if enabled
  if (preventOverflow) {
    // Prevent top overflow
    if (top < 0) {
      top = offset;
    }
    
    // Prevent right overflow
    if (left + modalRect.width > viewportWidth) {
      left = viewportWidth - modalRect.width - offset;
    }
    
    // Prevent bottom overflow
    if (top + modalRect.height > viewportHeight) {
      if (flip && placement === 'bottom' && trigger) {
        // Flip to top if placement is bottom
        const triggerRect = trigger.getBoundingClientRect();
        top = triggerRect.top - modalRect.height - offset;
      } else {
        top = viewportHeight - modalRect.height - offset;
      }
    }
    
    // Prevent left overflow
    if (left < 0) {
      left = offset;
    }
  }
  
  return { top, left };
};

/**
 * Calculate the position for a dropdown element
 * @param trigger The trigger element that opened the dropdown
 * @param dropdown The dropdown element to position
 * @param options Positioning options
 * @returns The calculated position
 */
export const calculateDropdownPosition = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  options: PositionOptions = {}
): { top: number; left: number } => {
  const {
    placement = 'bottom',
    offset = 4,
    preventOverflow = true,
    flip = true,
    matchWidth = false
  } = options;
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get trigger dimensions and position
  const triggerRect = trigger.getBoundingClientRect();
  
  // Get dropdown dimensions
  const dropdownRect = dropdown.getBoundingClientRect();
  
  // Calculate initial position based on preferred placement
  let top, left;
  
  switch (placement) {
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
    default:
      top = triggerRect.bottom + offset;
      left = triggerRect.left;
  }
  
  // Match width if requested
  if (matchWidth) {
    dropdown.style.width = `${triggerRect.width}px`;
  }
  
  // Prevent overflow if enabled
  if (preventOverflow) {
    // Check if dropdown would overflow bottom
    if (top + dropdownRect.height > viewportHeight) {
      if (flip && placement === 'bottom') {
        // Position above trigger instead
        top = triggerRect.top - dropdownRect.height - offset;
      } else {
        // Align to bottom of viewport
        top = viewportHeight - dropdownRect.height - offset;
      }
    }
    
    // Check if dropdown would overflow right
    if (left + dropdownRect.width > viewportWidth) {
      if (placement === 'right' && flip) {
        // Position to the left of trigger
        left = triggerRect.left - dropdownRect.width - offset;
      } else {
        // Align right edge with viewport
        left = viewportWidth - dropdownRect.width - offset;
      }
    }
    
    // Check if dropdown would overflow top
    if (top < 0) {
      if (flip && placement === 'top') {
        // Position below trigger instead
        top = triggerRect.bottom + offset;
      } else {
        // Align to top of viewport
        top = offset;
      }
    }
    
    // Check if dropdown would overflow left
    if (left < 0) {
      if (placement === 'left' && flip) {
        // Position to the right of trigger
        left = triggerRect.right + offset;
      } else {
        // Align left edge with viewport
        left = offset;
      }
    }
  }
  
  return { top, left };
};

/**
 * Position a modal element relative to a trigger element
 * @param trigger The trigger element that opened the modal
 * @param modal The modal element to position
 * @param options Positioning options
 */
export const positionModal = (
  trigger: HTMLElement | null,
  modal: HTMLElement,
  options: PositionOptions = {}
): void => {
  const { top, left } = calculateModalPosition(trigger, modal, options);
  
  // Apply position
  modal.style.position = 'absolute';
  modal.style.top = `${top}px`;
  modal.style.left = `${left}px`;
  modal.style.zIndex = '1000';
};

/**
 * Position a dropdown element relative to a trigger element
 * @param trigger The trigger element that opened the dropdown
 * @param dropdown The dropdown element to position
 * @param options Positioning options
 */
export const positionDropdown = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  options: PositionOptions = {}
): void => {
  const { top, left } = calculateDropdownPosition(trigger, dropdown, options);
  
  // Apply position
  dropdown.style.position = 'absolute';
  dropdown.style.top = `${top}px`;
  dropdown.style.left = `${left}px`;
  dropdown.style.zIndex = '1000';
};

/**
 * Position a context menu at the specified coordinates
 * @param x The x coordinate
 * @param y The y coordinate
 * @param menu The menu element to position
 * @param offset The offset from the coordinates
 */
export const positionContextMenu = (
  x: number,
  y: number,
  menu: HTMLElement,
  offset: number = 2
): void => {
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get menu dimensions
  const menuRect = menu.getBoundingClientRect();
  
  // Calculate position
  let top = y + offset;
  let left = x + offset;
  
  // Prevent overflow
  if (left + menuRect.width > viewportWidth) {
    left = viewportWidth - menuRect.width - offset;
  }
  
  if (top + menuRect.height > viewportHeight) {
    top = viewportHeight - menuRect.height - offset;
  }
  
  // Apply position
  menu.style.position = 'fixed';
  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
  menu.style.zIndex = '1000';
};