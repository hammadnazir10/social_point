import { useMemo } from 'react';

/**
 * Avatar component for displaying user profile pictures
 * Features:
 * - Fallback to initials if no image
 * - Different sizes
 * - Custom styling support
 */
const Avatar = ({
  src,
  alt,
  size = 'md',
  className = ''
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  // Get initials from alt text
  const initials = useMemo(() => {
    if (!alt) return '';
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [alt]);

  // Base classes for the avatar
  const avatarClasses = [
    'rounded-full',
    'flex items-center justify-center',
    'overflow-hidden',
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  if (!src) {
    return (
      <div
        className={`${avatarClasses} bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-medium`}
        role="img"
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={avatarClasses}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">${initials}</text></svg>`
        )}`;
      }}
    />
  );
};

export default Avatar;