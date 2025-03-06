# PanelCard Component Enhancement Plan

## Current State

The PanelCard component currently serves as a wrapper for all panels in the dashboard, providing consistent styling and behavior. It uses the Card component underneath and adds functionality for:

- Collapsing panels
- Maximizing panels
- Closing panels
- Displaying a title and icon

## Enhancement Goals

Our goal is to enhance the PanelCard component to:

1. **Work with the enhanced Card component** - Utilize the new padding, variant, and other props
2. **Standardize on 300px height** - Resolve the discrepancy between documentation and implementation
3. **Improve header and content layout** - Better organization of panel elements
4. **Enhance collapse and maximize functionality** - Add smooth animations and transitions

## Implementation Plan

### 1. Update PanelCard Interface

```typescript
interface PanelCardProps {
  title: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  isResizable?: boolean;
  isCollapsible?: boolean;
  isMaximizable?: boolean;
  defaultCollapsed?: boolean;
  // New props
  variant?: 'default' | 'elevated' | 'flat';
  headerVariant?: 'default' | 'subtle' | 'transparent';
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  headerPadding?: 'none' | 'sm' | 'md' | 'lg';
  actions?: React.ReactNode;
  badge?: number | string;
  height?: number | string;
}
```

### 2. Update PanelCard Implementation

```tsx
export const PanelCard: React.FC<PanelCardProps> = ({
  title,
  icon,
  onClose,
  children,
  className = '',
  isResizable = false,
  isCollapsible = false,
  isMaximizable = false,
  defaultCollapsed = false,
  variant = 'default',
  headerVariant = 'default',
  contentPadding = 'md',
  headerPadding = 'md',
  actions,
  badge,
  height = '300px'
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMaximized, setIsMaximized] = React.useState(false);
  
  // Handle collapse toggle with animation
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Handle maximize toggle with animation
  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
  };
  
  // Determine card classes based on state
  const cardClasses = classNames(
    className,
    'transition-all duration-200',
    {
      'fixed inset-4 z-50': isMaximized,
      'h-full': !isMaximized
    }
  );
  
  // Create header actions
  const headerActions = (
    <div className="flex items-center space-x-1">
      {actions}
      
      {isCollapsible && (
        <button
          onClick={handleCollapseToggle}
          className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </button>
      )}
      
      {isMaximizable && (
        <button
          onClick={handleMaximizeToggle}
          className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
            </svg>
          )}
        </button>
      )}
      
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close"
          title="Close"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
  
  return (
    <Card 
      className={cardClasses}
      variant={variant}
    >
      <CardHeader 
        title={title}
        icon={icon}
        className="flex-shrink-0"
        padding={headerPadding}
        variant={headerVariant}
        actions={headerActions}
      >
        {badge && (
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">
            {badge}
          </span>
        )}
      </CardHeader>
      
      <div 
        className={classNames(
          "overflow-hidden transition-all duration-200",
          isCollapsed ? "max-h-0" : "max-h-[500px]"
        )}
      >
        <CardContent 
          scrollable 
          className="flex-1 overflow-auto"
          padding={contentPadding}
        >
          {children}
        </CardContent>
      </div>
      
      {isResizable && !isCollapsed && !isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" 
          title="Resize"
          onMouseDown={(e) => {
            // Resize logic would go here
            // This is a placeholder for future implementation
            e.preventDefault();
          }}
        />
      )}
    </Card>
  );
};
```

### 3. Implement Smooth Collapse Animation

The current implementation toggles the collapsed state without animation. We'll enhance this by:

1. Using CSS transitions for height changes
2. Using max-height for smoother animations
3. Adding proper timing functions for natural motion

```css
/* Add to index.css or as a styled component */
.panel-collapse-enter {
  max-height: 0;
  overflow: hidden;
}

.panel-collapse-enter-active {
  max-height: 300px;
  transition: max-height 200ms ease-in-out;
  overflow: hidden;
}

.panel-collapse-exit {
  max-height: 300px;
  overflow: hidden;
}

.panel-collapse-exit-active {
  max-height: 0;
  transition: max-height 200ms ease-in-out;
  overflow: hidden;
}
```

### 4. Implement Maximize Animation

The current implementation toggles the maximized state without animation. We'll enhance this by:

1. Using CSS transitions for position and size changes
2. Adding a backdrop when maximized
3. Adding proper timing functions for natural motion

```css
/* Add to index.css or as a styled component */
.panel-maximize-enter {
  position: fixed;
  z-index: 50;
  transform: scale(0.95);
  opacity: 0.8;
}

.panel-maximize-enter-active {
  transform: scale(1);
  opacity: 1;
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

.panel-maximize-exit {
  transform: scale(1);
  opacity: 1;
}

.panel-maximize-exit-active {
  transform: scale(0.95);
  opacity: 0.8;
  transition: transform 200ms ease-in, opacity 200ms ease-in;
}
```

### 5. Add Panel Backdrop for Maximized State

When a panel is maximized, we'll add a backdrop to focus attention on the panel:

```tsx
{isMaximized && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 z-40"
    onClick={handleMaximizeToggle}
  />
)}
```

### 6. Standardize Panel Height

We'll standardize the panel height to 300px to match the current implementation:

```tsx
// In the PanelCard component
const defaultHeight = '300px';

// Use the height prop or default
const panelHeight = height || defaultHeight;

// Apply the height to the Card component
<Card 
  className={cardClasses}
  variant={variant}
  style={{ 
    height: isMaximized ? 'auto' : panelHeight,
    maxHeight: isMaximized ? 'calc(100vh - 2rem)' : panelHeight
  }}
>
```

### 7. Add Keyboard Accessibility

Enhance keyboard accessibility for panel actions:

```tsx
// Add keyboard support for collapse toggle
<button
  onClick={handleCollapseToggle}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCollapseToggle();
    }
  }}
  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
  aria-label={isCollapsed ? 'Expand' : 'Collapse'}
  title={isCollapsed ? 'Expand' : 'Collapse'}
  tabIndex={0}
>
  {/* Icon */}
</button>
```

## Maintaining Current Design

To ensure we don't disturb the current design:

1. **Keep the same color scheme** - Use the existing purple and white color palette
2. **Maintain the same visual hierarchy** - Keep the same header and content structure
3. **Preserve existing functionality** - Ensure all current features continue to work
4. **Match the current styling** - Use the same border radius, shadows, and spacing

## Testing Plan

1. **Visual Testing** - Ensure the enhanced PanelCard looks identical to the current version
2. **Functional Testing** - Verify all functionality (collapse, maximize, close) works correctly
3. **Animation Testing** - Ensure animations are smooth and natural
4. **Accessibility Testing** - Verify keyboard navigation and screen reader support
5. **Cross-browser Testing** - Test in Chrome, Firefox, Safari, and Edge

## Implementation Timeline

| Task | Estimated Time |
|------|----------------|
| Update PanelCard Interface | 30 minutes |
| Update PanelCard Implementation | 2 hours |
| Implement Collapse Animation | 1 hour |
| Implement Maximize Animation | 1 hour |
| Add Panel Backdrop | 30 minutes |
| Standardize Panel Height | 30 minutes |
| Add Keyboard Accessibility | 1 hour |
| Testing and Refinement | 2 hours |
| **Total** | **8.5 hours** |

## Conclusion

The enhanced PanelCard component will provide a more polished and consistent user experience while maintaining the current design aesthetic. The improvements focus on:

1. **Better integration** with the enhanced Card component
2. **Smoother animations** for collapse and maximize actions
3. **Standardized height** to resolve documentation/implementation discrepancy
4. **Improved accessibility** for keyboard users
5. **More customization options** through new props

These enhancements will make the panels more user-friendly and maintainable while preserving the current look and feel of the application.