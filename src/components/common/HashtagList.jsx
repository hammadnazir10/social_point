import { Link } from 'react-router-dom';
import { IconHash } from '@tabler/icons-react';

/**
 * HashtagList component for displaying a list of hashtags with optional interaction
 * Features:
 * - Displays hashtags in a responsive grid/flex layout
 * - Optional onClick handler for interactive hashtags
 * - Shows count if provided
 * - Supports linking to search results
 */
const HashtagList = ({
  hashtags = [],
  onClick,
  showCount = false,
  isInteractive = true,
  className = '',
  size = 'md'
}) => {
  // Size variants for the hashtags
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  // Base classes for the container
  const containerClasses = [
    'flex',
    'flex-wrap',
    'gap-2',
    className
  ].filter(Boolean).join(' ');

  // Base classes for individual hashtags
  const hashtagClasses = [
    'inline-flex',
    'items-center',
    'rounded-full',
    'font-medium',
    sizeClasses[size],
    isInteractive ? [
      'transition-colors',
      'cursor-pointer',
      'bg-blue-100',
      'text-blue-800',
      'hover:bg-blue-200',
      'dark:bg-blue-900',
      'dark:text-blue-200',
      'dark:hover:bg-blue-800'
    ].join(' ') : [
      'bg-gray-100',
      'text-gray-800',
      'dark:bg-gray-700',
      'dark:text-gray-200'
    ].join(' ')
  ].filter(Boolean).join(' ');

  // Render hashtag with count if available
  const renderHashtag = (tag) => {
    const content = (
      <>
        <IconHash className="w-3.5 h-3.5 mr-1" />
        <span>{tag.name || tag}</span>
        {showCount && tag.count && (
          <span className="ml-1 text-blue-600 dark:text-blue-400">
            ({tag.count})
          </span>
        )}
      </>
    );

    if (isInteractive) {
      return (
        <Link
          key={tag.name || tag}
          to={`/search?q=${encodeURIComponent(tag.name || tag)}`}
          className={hashtagClasses}
          onClick={() => onClick?.(tag)}
        >
          {content}
        </Link>
      );
    }

    return (
      <span key={tag.name || tag} className={hashtagClasses}>
        {content}
      </span>
    );
  };

  if (!hashtags.length) {
    return null;
  }

  return (
    <div className={containerClasses}>
      {hashtags.map(tag => renderHashtag(tag))}
    </div>
  );
};

export default HashtagList;
