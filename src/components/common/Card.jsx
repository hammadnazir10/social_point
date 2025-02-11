import { IconThumbUp, IconThumbDown, IconMessageCircle2 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Avatar from '@/components/common/Avatar';

/**
 * Card component for displaying topics, comments, or profile information
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description or content
 * @param {string} props.author - Author name
 * @param {string} props.authorImage - Author profile image URL
 * @param {string[]} props.hashtags - Array of hashtags
 * @param {number} props.likes - Number of likes
 * @param {number} props.dislikes - Number of dislikes
 * @param {number} props.comments - Number of comments
 * @param {string} props.createdAt - Creation timestamp
 * @param {string} props.link - Navigation link
 */
const Card = ({
  title,
  description,
  author,
  authorImage,
  hashtags = [],
  likes = 0,
  dislikes = 0,
  comments = 0,
  createdAt,
  link,
  className = ''
}) => {
  // Format date to readable string
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const cardClasses = [
    'bg-white dark:bg-gray-800',
    'rounded-lg shadow-md',
    'p-4 md:p-6',
    'transition duration-200 ease-in-out',
    'hover:shadow-lg',
    'border border-gray-200 dark:border-gray-700',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Avatar src={authorImage} alt={author} size="md" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {author}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      <Link to={link} className="block hover:no-underline">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {description}
        </p>
      </Link>

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <IconThumbUp className="w-4 h-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <IconThumbDown className="w-4 h-4" />
            <span>{dislikes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <IconMessageCircle2 className="w-4 h-4" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
