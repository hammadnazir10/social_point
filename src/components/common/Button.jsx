import { forwardRef } from 'react';
import { IconLoader2 } from '@tabler/icons-react';

/**
 * Button component that supports different variants, sizes, and states
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline, ghost)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.isLoading] - Loading state
 * @param {boolean} [props.fullWidth] - Whether button should take full width
 * @param {boolean} [props.disabled] - Disabled state
 * @param {React.ReactNode} [props.leftIcon] - Icon to show on left
 * @param {React.ReactNode} [props.rightIcon] - Icon to show on right
 */
const Button = forwardRef((
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    isLoading = false,
    fullWidth = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
  },
  ref
) => {
  // Base classes for the button
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:hover:bg-gray-800 dark:text-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Disabled classes
  const disabledClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';

  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    disabledClasses,
    className
  ].join(' ');

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={buttonClasses}
      {...props}
    >
      {isLoading && (
        <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!isLoading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
