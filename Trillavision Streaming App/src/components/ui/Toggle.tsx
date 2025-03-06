import React from 'react';
import classNames from 'classnames';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelClassName?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
  labelClassName
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const toggleSizes = {
    sm: {
      toggle: 'w-8 h-4',
      dot: 'h-3 w-3',
      translate: 'translate-x-4'
    },
    md: {
      toggle: 'w-11 h-6',
      dot: 'h-5 w-5',
      translate: 'translate-x-5'
    },
    lg: {
      toggle: 'w-14 h-7',
      dot: 'h-6 w-6',
      translate: 'translate-x-7'
    }
  };

  const currentSize = toggleSizes[size];

  return (
    <label className={classNames(
      'inline-flex items-center cursor-pointer',
      { 'opacity-50 cursor-not-allowed': disabled },
      className
    )}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <div
          className={classNames(
            `${currentSize.toggle} rounded-full transition-colors`,
            checked ? 'bg-primary' : 'bg-gray-700'
          )}
        ></div>
        <div
          className={classNames(
            `absolute left-0.5 top-0.5 ${currentSize.dot} bg-white rounded-full shadow transform transition-transform`,
            checked ? currentSize.translate : 'translate-x-0'
          )}
        ></div>
      </div>
      {label && (
        <span className={classNames(
          'ml-3 text-sm font-medium text-white',
          labelClassName
        )}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;