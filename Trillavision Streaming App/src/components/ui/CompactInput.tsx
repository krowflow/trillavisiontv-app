import React from 'react';
import classNames from 'classnames';

interface CompactInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: 'xs' | 'sm' | 'md';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

/**
 * CompactInput component provides a compact version of the Input component
 * for better space utilization in panels.
 *
 * @param inputSize - The size of the input ('xs', 'sm', or 'md')
 * @param fullWidth - Whether the input should take up the full width
 * @param leftIcon - Optional icon to display on the left side
 * @param rightIcon - Optional icon to display on the right side
 * @param error - Whether the input has an error
 * @param className - Additional CSS classes to apply
 */
export const CompactInput: React.FC<CompactInputProps> = ({
  inputSize = 'sm',
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
          sizeClasses[inputSize],
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

export default CompactInput;