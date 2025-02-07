import { IconLoader2 } from '@tabler/icons-react';

/**
 * Loader component for displaying loading states
 * @param {Object} props
 * @param {string} [props.size='md'] - Size of the loader (sm, md, lg)
 * @param {string} [props.className] - Additional CSS classes
 */
const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <IconLoader2
        className={`animate-spin ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
};

export default Loader;