import React from 'react';
import classNames from 'classnames';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusIndicatorProps {
  status: StatusType;
  text: string;
  className?: string;
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
}

/**
 * StatusIndicator component for displaying status information with appropriate visual cues.
 * 
 * @param status - The type of status ('success', 'warning', 'error', 'info', or 'neutral')
 * @param text - The text to display
 * @param className - Additional CSS classes to apply
 * @param animated - Whether to animate the status indicator
 * @param size - The size of the indicator ('xs', 'sm', or 'md')
 * @param icon - Optional icon to display instead of the default dot
 */
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

export default StatusIndicator;