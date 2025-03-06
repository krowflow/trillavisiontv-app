# Reusable Form Components Plan

## Overview

This document outlines a plan for creating reusable form components that will help improve the panel card elements in the Trillavision Streaming App. These components will provide consistent styling, better space utilization, and improved user experience across all panels.

## Goals

1. **Create consistent form layouts** - Standardize form element spacing and organization
2. **Improve space utilization** - Develop compact controls for better use of limited panel space
3. **Enhance visual feedback** - Provide clear status indicators for form state
4. **Maintain current design aesthetic** - Ensure new components match the existing UI

## Components to Create

### 1. FormGroup Component

The FormGroup component will provide consistent layout and styling for form fields, including labels, inputs, and help text.

#### Interface

```typescript
interface FormGroupProps {
  label: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
  helpText?: string;
  error?: string;
  required?: boolean;
  compact?: boolean;
}
```

#### Implementation

```tsx
export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  className,
  children,
  helpText,
  error,
  required = false,
  compact = false
}) => {
  return (
    <div className={classNames(
      compact ? 'mb-1.5' : 'mb-3',
      className
    )}>
      <label 
        className={classNames(
          "block font-medium text-gray-700 mb-1",
          compact ? "text-xs" : "text-sm"
        )}
        htmlFor={htmlFor}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {helpText && (
        <p className={classNames(
          "mt-1 text-gray-500",
          compact ? "text-[10px]" : "text-xs"
        )}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p className={classNames(
          "mt-1 text-red-500",
          compact ? "text-[10px]" : "text-xs"
        )}>
          {error}
        </p>
      )}
    </div>
  );
};
```

#### Usage Example

```tsx
<FormGroup 
  label="Stream Title" 
  htmlFor="streamTitle"
  helpText="Enter a title for your stream"
  compact
>
  <Input 
    id="streamTitle"
    value={streamTitle}
    onChange={(e) => setStreamTitle(e.target.value)}
    placeholder="My Awesome Stream"
    size="sm"
  />
</FormGroup>
```

### 2. CompactInput Component

A compact version of the Input component for better space utilization in panels.

#### Interface

```typescript
interface CompactInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'xs' | 'sm' | 'md';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}
```

#### Implementation

```tsx
export const CompactInput: React.FC<CompactInputProps> = ({
  size = 'sm',
  fullWidth = false,
  leftIcon,
  rightIcon,
  error = false,
  className,
  ...props
}) => {
  const sizeClasses = {
    xs: 'h-5 text-[10px] px-1.5',
    sm: 'h-6 text-xs px-2',
    md: 'h-7 text-sm px-2.5'
  };
  
  return (
    <div className={classNames(
      'relative inline-flex items-center',
      fullWidth && 'w-full',
      className
    )}>
      {leftIcon && (
        <div className="absolute left-2 flex items-center pointer-events-none text-gray-400">
          {leftIcon}
        </div>
      )}
      
      <input
        className={classNames(
          'rounded-md border focus:outline-none focus:ring-1 focus:ring-primary',
          sizeClasses[size],
          leftIcon && 'pl-7',
          rightIcon && 'pr-7',
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary',
          fullWidth && 'w-full'
        )}
        {...props}
      />
      
      {rightIcon && (
        <div className="absolute right-2 flex items-center pointer-events-none text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
};
```

#### Usage Example

```tsx
<CompactInput
  size="xs"
  placeholder="Search..."
  leftIcon={<Search size={12} />}
  fullWidth
/>
```

### 3. CompactSelect Component

A compact version of the Select component for better space utilization in panels.

#### Interface

```typescript
interface SelectOption {
  value: string;
  label: string;
}

interface CompactSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md';
  fullWidth?: boolean;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}
```

#### Implementation

```tsx
export const CompactSelect: React.FC<CompactSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  size = 'sm',
  fullWidth = false,
  error = false,
  disabled = false,
  className
}) => {
  const sizeClasses = {
    xs: 'h-5 text-[10px]',
    sm: 'h-6 text-xs',
    md: 'h-7 text-sm'
  };
  
  return (
    <div className={classNames(
      'relative inline-block',
      fullWidth && 'w-full',
      className
    )}>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        className={classNames(
          'appearance-none rounded-md border pr-8 focus:outline-none focus:ring-1 focus:ring-primary',
          sizeClasses[size],
          size === 'xs' ? 'px-1.5' : size === 'sm' ? 'px-2' : 'px-2.5',
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary',
          disabled && 'opacity-50 cursor-not-allowed',
          fullWidth && 'w-full'
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
};
```

#### Usage Example

```tsx
<CompactSelect
  options={[
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'facebook', label: 'Facebook' }
  ]}
  value={platform}
  onChange={setPlatform}
  size="xs"
  fullWidth
/>
```

### 4. StatusIndicator Component

A component for displaying status information with appropriate visual cues.

#### Interface

```typescript
type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusIndicatorProps {
  status: StatusType;
  text: string;
  className?: string;
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
}
```

#### Implementation

```tsx
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  text,
  className,
  animated = false,
  size = 'sm',
  icon
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      case 'neutral': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const sizeClasses = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm'
  };
  
  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5'
  };
  
  return (
    <div className={classNames(
      'flex items-center',
      sizeClasses[size],
      className
    )}>
      {icon ? (
        <span className={classNames(
          'mr-1.5 flex-shrink-0',
          status === 'success' && 'text-green-500',
          status === 'warning' && 'text-yellow-500',
          status === 'error' && 'text-red-500',
          status === 'info' && 'text-blue-500',
          status === 'neutral' && 'text-gray-500'
        )}>
          {icon}
        </span>
      ) : (
        <div 
          className={classNames(
            'rounded-full mr-1.5 flex-shrink-0',
            dotSizeClasses[size],
            getStatusColor(),
            animated && 'animate-pulse'
          )} 
        />
      )}
      <span className={classNames(
        'font-medium',
        status === 'success' && 'text-green-700',
        status === 'warning' && 'text-yellow-700',
        status === 'error' && 'text-red-700',
        status === 'info' && 'text-blue-700',
        status === 'neutral' && 'text-gray-700'
      )}>
        {text}
      </span>
    </div>
  );
};
```

#### Usage Example

```tsx
<StatusIndicator
  status="success"
  text="Stream is live"
  animated
  size="xs"
/>
```

### 5. CompactToggle Component

A compact version of the Toggle component for better space utilization in panels.

#### Interface

```typescript
interface CompactToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}
```

#### Implementation

```tsx
export const CompactToggle: React.FC<CompactToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'sm',
  disabled = false,
  className
}) => {
  const toggleSizeClasses = {
    xs: 'w-6 h-3',
    sm: 'w-8 h-4',
    md: 'w-10 h-5'
  };
  
  const knobSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };
  
  const labelSizeClasses = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm'
  };
  
  return (
    <label className={classNames(
      'inline-flex items-center cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={classNames(
            'rounded-full transition-colors',
            toggleSizeClasses[size],
            checked ? 'bg-primary' : 'bg-gray-300'
          )}
        />
        <div
          className={classNames(
            'absolute top-0.5 left-0.5 bg-white rounded-full transform transition-transform',
            knobSizeClasses[size],
            checked && (
              size === 'xs' ? 'translate-x-3' :
              size === 'sm' ? 'translate-x-4' :
              'translate-x-5'
            )
          )}
        />
      </div>
      {label && (
        <span className={classNames(
          'ml-2',
          labelSizeClasses[size]
        )}>
          {label}
        </span>
      )}
    </label>
  );
};
```

#### Usage Example

```tsx
<CompactToggle
  checked={isPrivate}
  onChange={setIsPrivate}
  label="Private Stream"
  size="xs"
/>
```

### 6. InlineEdit Component

A component for inline editing of values with minimal space usage.

#### Interface

```typescript
interface InlineEditProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}
```

#### Implementation

```tsx
export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  placeholder,
  size = 'sm',
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const sizeClasses = {
    xs: 'text-[10px] h-4',
    sm: 'text-xs h-5',
    md: 'text-sm h-6'
  };
  
  useEffect(() => {
    setEditValue(value);
  }, [value]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(editValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };
  
  return (
    <div className={className}>
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={classNames(
            'w-full px-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={classNames(
            'cursor-text px-1 border border-transparent hover:border-gray-200 rounded',
            sizeClasses[size],
            !value && 'text-gray-400'
          )}
        >
          {value || placeholder || 'Click to edit'}
        </div>
      )}
    </div>
  );
};
```

#### Usage Example

```tsx
<InlineEdit
  value={streamTitle}
  onChange={setStreamTitle}
  placeholder="Enter stream title"
  size="xs"
/>
```

## Implementation Plan

### 1. Create Component Files

Create the following files in the `src/components/ui` directory:

- `FormGroup.tsx`
- `CompactInput.tsx`
- `CompactSelect.tsx`
- `StatusIndicator.tsx`
- `CompactToggle.tsx`
- `InlineEdit.tsx`

### 2. Implement Components

Implement each component according to the specifications above, ensuring they match the current design aesthetic.

### 3. Create Tests

Create test files for each component to ensure they function correctly:

- `FormGroup.test.tsx`
- `CompactInput.test.tsx`
- `CompactSelect.test.tsx`
- `StatusIndicator.test.tsx`
- `CompactToggle.test.tsx`
- `InlineEdit.test.tsx`

### 4. Create Documentation

Create documentation for each component with usage examples:

- Add JSDoc comments to each component
- Create a storybook story for each component (if storybook is used)

### 5. Update Existing Components

Update existing panel components to use the new form components:

- Replace standard form elements with compact versions
- Add form groups for better organization
- Add status indicators where appropriate

## Timeline

| Task | Estimated Time |
|------|----------------|
| Create FormGroup Component | 1 hour |
| Create CompactInput Component | 1 hour |
| Create CompactSelect Component | 1 hour |
| Create StatusIndicator Component | 1 hour |
| Create CompactToggle Component | 1 hour |
| Create InlineEdit Component | 1 hour |
| Create Tests | 2 hours |
| Create Documentation | 1 hour |
| Update Existing Components | 2 hours |
| **Total** | **11 hours** |

## Success Criteria

The implementation will be considered successful if:

1. All components are implemented according to the specifications
2. Components match the current design aesthetic
3. Components improve space utilization in panels
4. Components provide consistent form layouts
5. Components enhance visual feedback for form state
6. Tests pass for all components
7. Documentation is complete and accurate

## Conclusion

These reusable form components will provide a solid foundation for improving the panel card elements in the Trillavision Streaming App. By standardizing form layouts, improving space utilization, and enhancing visual feedback, we can create a more consistent and user-friendly interface while maintaining the current design aesthetic.