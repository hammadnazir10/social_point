import { useState, useEffect } from 'react';
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
  const [hasLiked, setHasLiked] = useState(false); // Track if user has liked
  const [hasDisliked, setHasDisliked] = useState(false); // Track if user has disliked
  const [trendingScore, setTrendingScore] = useState(topic.trendingScore); // Add trendingScore state

  const anonymousUserId = getAnonymousUserId();

  const {
    _id,
    title,
    description,
    hashtags,
    userId,
    createdAt
  } = topic;

  // Format date to readable string
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Check if the user has already liked or disliked the post
  useEffect(() => {
    const likedTopics = JSON.parse(localStorage.getItem('likedTopics')) || {};
    const dislikedTopics = JSON.parse(localStorage.getItem('dislikedTopics')) || {};
    if (likedTopics[_id]) {
      setHasLiked(true);
    }
    if (dislikedTopics[_id]) {
      setHasDisliked(true);
    }
  }, [_id]);

  const handleTrendingScore = async (score, action) => {
    if (hasLiked || hasDisliked) {
      showToast(`You have already ${hasLiked ? 'liked' : 'disliked'} this topic!`, "error");
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log("Sending request to update score:", {
        url: `${import.meta.env.VITE_API_URL}/api/topics/${_id}/trending`,
        data: { score, userId: anonymousUserId },
      });
  
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/topics/${_id}/trending`,
        { score, userId: anonymousUserId }
      );
  
      const likedTopics = JSON.parse(localStorage.getItem('likedTopics')) || {};
      const dislikedTopics = JSON.parse(localStorage.getItem('dislikedTopics')) || {};
  
      if (action === 'like') {
        likedTopics[_id] = true;
        localStorage.setItem('likedTopics', JSON.stringify(likedTopics));
        setHasLiked(true);
      } else if (action === 'dislike') {
        dislikedTopics[_id] = true;
        localStorage.setItem('dislikedTopics', JSON.stringify(dislikedTopics));
        setHasDisliked(true);
      }
  
      setTrendingScore(score);
  
      showToast(`${action.charAt(0).toUpperCase() + action.slice(1)}d successfully!`, "success");
    } catch (error) {
      console.error("Error updating score:", error);
      showToast(error.response?.data?.message || 'Error updating score', 'error');
    } finally {
      setIsLoading(false);
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
            onClick={() => handleTrendingScore(trendingScore + 1, 'like')}
            className={`flex items-center space-x-1 ${
              hasLiked ? 'text-blue-600 dark:text-blue-400 cursor-not-allowed' : 'hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            disabled={hasLiked || hasDisliked}
          >
            <IconThumbUp className="w-4 h-4" />
            <span>{trendingScore || 0}</span>
          </button>
          <button
            onClick={() => handleTrendingScore(Math.max(0, trendingScore - 1), 'dislike')}
            className={`flex items-center space-x-1 ${
              hasDisliked ? 'text-red-600 dark:text-red-400 cursor-not-allowed' : 'hover:text-red-600 dark:hover:text-red-400'
            }`}
            disabled={hasLiked || hasDisliked}
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