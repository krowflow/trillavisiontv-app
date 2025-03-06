import React from 'react';
import classNames from 'classnames';

interface SelectOption {
  value: string;
  label: string;
}

interface CompactSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  inputSize?: 'xs' | 'sm' | 'md';
  fullWidth?: boolean;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  ariaLabel?: string;
}

/**
 * CompactSelect component provides a compact version of the Select component
 * for better space utilization in panels.
 * 
 * @param options - Array of options to display in the select
 * @param value - The currently selected value
 * @param onChange - Function to call when the selection changes
 * @param placeholder - Optional placeholder text
 * @param inputSize - The size of the select ('xs', 'sm', or 'md')
 * @param fullWidth - Whether the select should take up the full width
 * @param error - Whether the select has an error
 * @param disabled - Whether the select is disabled
 * @param className - Additional CSS classes to apply
 * @param id - The ID of the select element
 * @param name - The name of the select element
 * @param ariaLabel - Accessible label for the select element
 */
export const CompactSelect: React.FC<CompactSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  inputSize = 'sm',
  fullWidth = false,
  error = false,
  disabled = false,
  className,
  id,
  name,
  ariaLabel
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
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel || placeholder || "Select an option"}
        className={classNames(
          'appearance-none rounded-md border pr-8 focus:outline-none focus:ring-1 focus:ring-primary',
          sizeClasses[inputSize],
          inputSize === 'xs' ? 'px-1.5' : inputSize === 'sm' ? 'px-2' : 'px-2.5',
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

export default CompactSelect;