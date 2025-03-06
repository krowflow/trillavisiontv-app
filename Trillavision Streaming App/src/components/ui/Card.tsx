import React from 'react';
import classNames from 'classnames';
import { X } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  onClose?: () => void;
  maxHeight?: string | number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'flat';
}

/**
 * Enhanced Card component with improved overflow handling
 * - Added padding prop for customizable padding
 * - Added variant prop for different card styles
 * - Improved overflow handling for better content display
 * - Standardized padding and margins
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  footer,
  bordered = false,
  hoverable = false,
  onClose,
  maxHeight,
  padding = 'md',
  variant = 'default'
}) => {
  // Get padding classes based on padding prop
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-2';
      case 'lg': return 'p-6';
      case 'md':
      default: return 'p-4';
    }
  };

  // Get variant classes based on variant prop
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated': return 'shadow-lg';
      case 'flat': return 'shadow-none';
      case 'default':
      default: return 'shadow-custom';
    }
  };

  return (
    <div
      className={classNames(
        'bg-white rounded-lg flex flex-col overflow-hidden',
        {
          'border border-gray-200': bordered,
          'transition-shadow hover:shadow-lg': hoverable
        },
        !hoverable && getVariantClasses(),
        className
      )}
      style={{ maxHeight }}
    >
      {(title || subtitle || onClose) && (
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {children}
      </div>

      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * CardHeader component for consistent card headers with improved styling
 */
export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle' | 'transparent';
  actions?: React.ReactNode;
}> = ({
  title,
  subtitle,
  icon,
  onClose,
  className,
  padding = 'md',
  variant = 'default',
  actions
}) => {
  // Get padding classes based on padding prop
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return 'px-0 py-0';
      case 'sm': return 'px-2 py-2';
      case 'lg': return 'px-6 py-4';
      case 'md':
      default: return 'px-4 py-3';
    }
  };

  // Get variant classes based on variant prop
  const getVariantClasses = () => {
    switch (variant) {
      case 'subtle': return 'border-b border-gray-100';
      case 'transparent': return 'border-b border-transparent';
      case 'default':
      default: return 'border-b border-gray-200';
    }
  };

  return (
    <div className={classNames(
      "flex-shrink-0",
      getPaddingClasses(),
      getVariantClasses(),
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon && <div className="mr-2 text-primary">{icon}</div>}
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          {actions}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

/**
 * CardContent component for consistent card content with improved overflow handling
 */
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, className, scrollable = true, padding = 'md' }) => {
  // Get padding classes based on padding prop
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-2';
      case 'lg': return 'p-6';
      case 'md':
      default: return 'p-4';
    }
  };

  return (
    <div
      className={classNames(
        "flex-1 min-h-0",
        getPaddingClasses(),
        {
          "overflow-y-auto custom-scrollbar": scrollable,
          "overflow-hidden": !scrollable
        },
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * CardFooter component for consistent card footers with improved styling
 */
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle' | 'transparent';
}> = ({ children, className, padding = 'md', variant = 'default' }) => {
  // Get padding classes based on padding prop
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return 'px-0 py-0';
      case 'sm': return 'px-2 py-2';
      case 'lg': return 'px-6 py-4';
      case 'md':
      default: return 'px-4 py-3';
    }
  };

  // Get variant classes based on variant prop
  const getVariantClasses = () => {
    switch (variant) {
      case 'subtle': return 'bg-gray-50 border-t border-gray-100';
      case 'transparent': return 'border-t border-gray-100';
      case 'default':
      default: return 'bg-gray-50 border-t border-gray-200';
    }
  };

  return (
    <div className={classNames(
      "flex-shrink-0",
      getPaddingClasses(),
      getVariantClasses(),
      className
    )}>
      {children}
    </div>
  );
};

export default Card;