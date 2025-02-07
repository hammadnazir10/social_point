import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { IconRefresh } from '@tabler/icons-react';
import axios from 'axios';
import TopicCard from './TopicCard';
import Button from '@/components/common/Button';

/**
 * TopicList component that displays a list of topics with refresh functionality
 * Supports trending topics view and regular topics list
 */
const TopicList = ({ isTrending = false }) => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/topics/trending`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      setTopics(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching topics');
      showToast(error.response?.data?.message || 'Error fetching topics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [isTrending]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <Button
          variant="secondary"
          onClick={fetchTopics}
          leftIcon={<IconRefresh className="w-5 h-5" />}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isTrending ? 'Trending Topics' : 'Recent Topics'}
        </h2>
        <Button
          variant="outline"
          onClick={fetchTopics}
          isLoading={isLoading}
          leftIcon={<IconRefresh className="w-5 h-5" />}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {isTrending
              ? 'No trending topics yet. Be the first to start a discussion!'
              : 'No topics found. Start a new discussion!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic._id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicList;