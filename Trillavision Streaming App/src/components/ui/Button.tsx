import React from 'react';
import classNames from 'classnames';

/**
 * Enhanced Button component with improved contrast and additional options
 * - Added 'success' variant for success actions
 * - Added 'xs' size for very compact buttons
 * - Added 'iconOnly' prop for icon-only buttons with proper sizing
 * - Enhanced contrast for 'outline' variant
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  iconOnly = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-light disabled:bg-primary-dark',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-600 disabled:text-gray-600',
    ghost: 'text-primary hover:bg-primary hover:bg-opacity-10 disabled:text-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-800'
  };
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  const classes = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'opacity-70 cursor-not-allowed': disabled || isLoading,
      'w-full': fullWidth,
      'p-0 w-8 h-8 flex items-center justify-center': iconOnly && size === 'sm',
      'p-0 w-9 h-9 flex items-center justify-center': iconOnly && size === 'md',
      'p-0 w-10 h-10 flex items-center justify-center': iconOnly && size === 'lg',
      'p-0 w-7 h-7 flex items-center justify-center': iconOnly && size === 'xs'
    },
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className={iconOnly ? '' : 'mr-2'}>{leftIcon}</span>}
      {!iconOnly && children}
      {!isLoading && rightIcon && <span className={iconOnly ? '' : 'ml-2'}>{rightIcon}</span>}
    </button>
  );
};

export default Button;