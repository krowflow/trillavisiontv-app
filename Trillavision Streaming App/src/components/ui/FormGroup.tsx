import React from 'react';
import classNames from 'classnames';

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

/**
 * FormGroup component provides consistent layout and styling for form fields,
 * including labels, inputs, and help text.
 * 
 * @param label - The label text for the form field
 * @param htmlFor - The ID of the input element this label is for
 * @param className - Additional CSS classes to apply
 * @param children - The form field(s) to render
 * @param helpText - Optional help text to display below the field
 * @param error - Optional error message to display
 * @param required - Whether the field is required
 * @param compact - Whether to use compact styling
 */
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

export default FormGroup;