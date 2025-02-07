import { forwardRef, useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

/**
 * Reusable Input component with built-in styling and error handling
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, password, email, etc.)
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.helperText - Helper text below input
 */
const Input = forwardRef((
  {
    type = 'text',
    label,
    error,
    required = false,
    helperText,
    className = '',
    startIcon,
    endIcon,
    showPasswordToggle = false,
    ...props
  },
  ref
) => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Base classes for the input container
  const containerClasses = [
    'relative',
    className
  ].filter(Boolean).join(' ');

  // Base classes for the input field
  const inputClasses = [
    'w-full',
    'px-3 py-2',
    'bg-white dark:bg-gray-800',
    'border rounded-md',
    'text-gray-900 dark:text-gray-100',
    'placeholder-gray-500 dark:placeholder-gray-400',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2',
    startIcon && 'pl-10',
    endIcon && 'pr-10',
    showPasswordToggle && 'pr-10',
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400'
  ].filter(Boolean).join(' ');

  // Label classes
  const labelClasses = [
    'block',
    'mb-1',
    'text-sm font-medium',
    error ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'
  ].filter(Boolean).join(' ');

  // Error message classes
  const errorClasses = 'mt-1 text-sm text-red-500';

  // Helper text classes
  const helperTextClasses = 'mt-1 text-sm text-gray-500 dark:text-gray-400';

  // Icon wrapper classes
  const iconWrapperClasses = [
    'absolute',
    'top-1/2',
    '-translate-y-1/2',
    'text-gray-400 dark:text-gray-500'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <span className={`${iconWrapperClasses} left-3`}>
            {startIcon}
          </span>
        )}

        <input
          ref={ref}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        {endIcon && !showPasswordToggle && (
          <span className={`${iconWrapperClasses} right-3`}>
            {endIcon}
          </span>
        )}

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className={`${iconWrapperClasses} right-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300`}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? (
              <IconEyeOff className="w-5 h-5" />
            ) : (
              <IconEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className={errorClasses} role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className={helperTextClasses}>{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
