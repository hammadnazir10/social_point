import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconThumbUp, IconThumbDown, IconMessageCircle2 } from '@tabler/icons-react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import Avatar from '@/components/common/Avatar';
import { getAnonymousUserId } from '@/hooks/anonymousUser';


/**
 * TopicCard component for displaying individual topic details
 * with interactions like voting and comment count
 */
const TopicCard = ({ topic }) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const anonymousUserId = getAnonymousUserId();

  const {
    _id,
    title,
    description,
    hashtags,
    userId,
    trendingScore,
    createdAt
  } = topic;

  // Format date to readable string
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Handle trending score update
  const handleTrendingScore = async (score) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/topics/${_id}/trending`,
        { score, userId: anonymousUserId }
      );

      onUpdate({ ...topic, trendingScore: score });
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating score', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition duration-200 ease-in-out hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Avatar
            src={userId?.profilePicture}
            alt={userId?.username || 'Anonymous'}
            size="md"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {userId?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      <Link to={`/topic/${_id}`} className="block hover:no-underline">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {description}
        </p>
      </Link>

      {hashtags?.length > 0 && (
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
          <button
            onClick={() => handleTrendingScore(trendingScore + 1)}
            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <IconThumbUp className="w-4 h-4" />
            <span>{trendingScore || 0}</span>
          </button>
          <button
            onClick={() => handleTrendingScore(Math.max(0, trendingScore - 1))}
            className="flex items-center space-x-1 hover:text-red-600 dark:hover:text-red-400"
          >
            <IconThumbDown className="w-4 h-4" />
          </button>
          <Link
            to={`/topic/${_id}`}
            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <IconMessageCircle2 className="w-4 h-4" />
            <span>Comments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
