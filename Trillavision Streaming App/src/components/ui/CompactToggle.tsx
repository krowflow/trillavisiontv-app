import React from 'react';
import classNames from 'classnames';

interface CompactToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * CompactToggle component provides a compact version of the Toggle component
 * for better space utilization in panels.
 * 
 * @param checked - Whether the toggle is checked
 * @param onChange - Function to call when the toggle changes
 * @param label - Optional label text
 * @param size - The size of the toggle ('xs', 'sm', or 'md')
 * @param disabled - Whether the toggle is disabled
 * @param className - Additional CSS classes to apply
 * @param id - The ID of the toggle element
 */
export const CompactToggle: React.FC<CompactToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'sm',
  disabled = false,
  className,
  id
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
    <label 
      className={classNames(
        'inline-flex items-center cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      htmlFor={id}
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-label={label || "Toggle"}
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

export default CompactToggle;