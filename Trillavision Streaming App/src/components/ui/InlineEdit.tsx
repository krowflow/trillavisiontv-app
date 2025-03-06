import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

interface InlineEditProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  id?: string;
}

/**
 * InlineEdit component for inline editing of values with minimal space usage.
 * 
 * @param value - The current value
 * @param onChange - Function to call when the value changes
 * @param placeholder - Optional placeholder text
 * @param size - The size of the component ('xs', 'sm', or 'md')
 * @param className - Additional CSS classes to apply
 * @param id - The ID of the input element
 */
export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  placeholder,
  size = 'sm',
  className,
  id
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
          id={id}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder || "Edit text"}
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
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsEditing(true);
            }
          }}
          aria-label={`Edit ${placeholder || "text"}`}
        >
          {value || placeholder || 'Click to edit'}
        </div>
      )}
    </div>
  );
};

export default InlineEdit;