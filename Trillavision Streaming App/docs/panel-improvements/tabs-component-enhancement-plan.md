# Tabs Component Enhancement Plan

## Current State

The current Tabs component provides basic tab functionality with:
- Tab switching
- Icon support
- Two variants (default and dark)
- Scrollable content

## Enhancement Goals

1. **Dynamic Tab Content**
   - Add support for lazy loading tab content
   - Add support for dynamic tab addition/removal
   - Add support for controlled and uncontrolled modes

2. **Improved Tab Styling**
   - Enhance contrast for better visibility
   - Add more variants for different contexts
   - Improve active tab indication
   - Add hover and focus states

3. **Enhanced Scrolling Behavior**
   - Add horizontal scrolling for tabs when they overflow
   - Improve content scrolling with better padding and overflow handling
   - Add scroll to active tab functionality

4. **Tab Badges and Notifications**
   - Add support for badge counts
   - Add support for notification indicators
   - Add support for custom badge styling

## Implementation Plan

### 1. Update Interface

```typescript
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: number | string;
  notification?: boolean;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  activeTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'dark' | 'primary' | 'minimal' | 'card';
  className?: string;
  contentClassName?: string;
  scrollable?: boolean;
  tabsScrollable?: boolean;
  lazyLoad?: boolean;
  align?: 'start' | 'center' | 'end' | 'stretch';
  size?: 'sm' | 'md' | 'lg';
  onTabClose?: (tabId: string) => void;
  allowAddTab?: boolean;
  onAddTab?: () => void;
}
```

### 2. Implement Tab Styling Improvements

- Add more variants with distinct styling
- Enhance active tab indication with stronger contrast
- Improve hover and focus states for better accessibility
- Add size options for different contexts

```tsx
const getTabHeaderClasses = (tabId: string) => {
  const isActive = tabId === activeTabId;
  
  // Base classes for all variants
  const baseClasses = classNames(
    'font-medium transition-colors flex items-center',
    {
      'opacity-50 cursor-not-allowed': tab.disabled,
      'cursor-pointer': !tab.disabled
    }
  );
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }[size || 'md'];
  
  // Variant-specific classes
  switch (variant) {
    case 'dark':
      return classNames(
        baseClasses,
        sizeClasses,
        isActive
          ? 'text-primary border-b-2 border-primary font-semibold'
          : 'text-gray-400 border-b-2 border-transparent hover:text-white hover:border-gray-700 focus:text-white focus:border-gray-600'
      );
    case 'primary':
      return classNames(
        baseClasses,
        sizeClasses,
        isActive
          ? 'bg-primary text-white rounded-t-md'
          : 'text-gray-700 hover:bg-primary-light hover:bg-opacity-10 focus:bg-primary-light focus:bg-opacity-20 rounded-t-md'
      );
    case 'minimal':
      return classNames(
        baseClasses,
        sizeClasses,
        isActive
          ? 'text-primary font-semibold'
          : 'text-gray-500 hover:text-gray-700 focus:text-gray-800'
      );
    case 'card':
      return classNames(
        baseClasses,
        sizeClasses,
        isActive
          ? 'bg-white border-t border-l border-r border-gray-200 rounded-t-md -mb-px'
          : 'bg-gray-100 border border-gray-200 rounded-t-md hover:bg-gray-50'
      );
    default:
      return classNames(
        baseClasses,
        sizeClasses,
        isActive
          ? 'text-primary border-b-2 border-primary font-semibold'
          : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-800 focus:border-gray-400'
      );
  }
};
```

### 3. Implement Horizontal Tab Scrolling

- Add a scrollable container for tabs
- Add scroll buttons for better UX
- Implement scroll to active tab functionality

```tsx
// Add refs for scrolling
const tabsContainerRef = useRef<HTMLDivElement>(null);
const activeTabRef = useRef<HTMLButtonElement>(null);

// Scroll to active tab when it changes
useEffect(() => {
  if (tabsScrollable && activeTabRef.current && tabsContainerRef.current) {
    const container = tabsContainerRef.current;
    const activeTab = activeTabRef.current;
    
    // Calculate scroll position to center the active tab
    const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
    
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  }
}, [activeTabId, tabsScrollable]);

// Render scrollable tabs container
<div className="relative flex-shrink-0">
  {tabsScrollable && scrollPosition > 0 && (
    <button
      className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white to-transparent px-2 flex items-center"
      onClick={scrollLeft}
    >
      <ChevronLeft size={16} />
    </button>
  )}
  
  <div 
    ref={tabsContainerRef}
    className={classNames(
      'flex border-b flex-shrink-0',
      tabsScrollable ? 'overflow-x-auto custom-scrollbar-hidden' : '',
      variant === 'dark' ? 'border-gray-800' : 'border-gray-200',
      `justify-${align || 'start'}`
    )}
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        ref={tab.id === activeTabId ? activeTabRef : null}
        className={getTabHeaderClasses(tab.id)}
        onClick={() => !tab.disabled && handleTabClick(tab.id)}
        disabled={tab.disabled}
      >
        {tab.icon && <span className="mr-2">{tab.icon}</span>}
        {tab.label}
        {tab.badge && (
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">
            {tab.badge}
          </span>
        )}
        {tab.notification && (
          <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
        )}
      </button>
    ))}
    
    {allowAddTab && (
      <button
        className="px-3 text-gray-500 hover:text-primary"
        onClick={onAddTab}
      >
        <Plus size={16} />
      </button>
    )}
  </div>
  
  {tabsScrollable && hasMoreTabs && (
    <button
      className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white to-transparent px-2 flex items-center"
      onClick={scrollRight}
    >
      <ChevronRight size={16} />
    </button>
  )}
</div>
```

### 4. Implement Dynamic Tab Content

- Add support for lazy loading tab content
- Add support for controlled and uncontrolled modes

```tsx
// Support for controlled mode
const [internalActiveTabId, setInternalActiveTabId] = useState(defaultTabId || tabs[0]?.id);
const activeTabId = props.activeTabId !== undefined ? props.activeTabId : internalActiveTabId;

// Handle tab click
const handleTabClick = (tabId: string) => {
  if (props.activeTabId === undefined) {
    setInternalActiveTabId(tabId);
  }
  
  if (onChange) {
    onChange(tabId);
  }
};

// Render tab content with lazy loading support
<div className={classNames(
  'flex-1 min-h-0',
  scrollable ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden',
  contentClassName
)}>
  {tabs.map((tab) => {
    // If not lazy loading, render all tabs but hide inactive ones
    // If lazy loading, only render the active tab
    const shouldRender = !lazyLoad || tab.id === activeTabId;
    const isActive = tab.id === activeTabId;
    
    return shouldRender ? (
      <div
        key={tab.id}
        className={classNames(
          'h-full w-full transition-opacity duration-200',
          isActive ? 'opacity-100' : 'opacity-0 hidden'
        )}
      >
        {tab.content}
      </div>
    ) : null;
  })}
</div>
```

### 5. Add Tab Badge and Notification Support

- Implement badge display in tab headers
- Add notification indicators
- Support custom badge styling

```tsx
// Add badge and notification to tab header
{tab.badge && (
  <span className={classNames(
    "ml-2 px-1.5 py-0.5 text-xs rounded-full",
    typeof tab.badge === 'number' && tab.badge > 0
      ? "bg-primary text-white"
      : "bg-gray-200 text-gray-700"
  )}>
    {tab.badge}
  </span>
)}

{tab.notification && (
  <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
)}
```

## Expected Outcome

The enhanced Tabs component will provide:

1. **Better Visual Clarity**
   - Improved contrast and styling
   - Clear indication of active tab
   - Support for different visual styles

2. **Improved User Experience**
   - Horizontal scrolling for many tabs
   - Lazy loading for better performance
   - Badge and notification support for status indication

3. **More Flexibility**
   - Support for dynamic tab management
   - Multiple size and alignment options
   - Controlled and uncontrolled modes

4. **Better Integration with Panels**
   - Consistent styling with other panel elements
   - Improved space utilization
   - Better overflow handling

These enhancements will make the Tabs component more versatile and user-friendly, improving the overall panel experience in the Trillavision Streaming App.