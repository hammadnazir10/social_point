import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';
import TopicCard from '@/components/topics/TopicCard';
import CommentCard from '@/components/comments/CommentCard';
import HashtagList from '@/components/common/HashtagList';
import SearchBar from '@/components/search/SearchBar';

/**
 * SearchPage component for searching and displaying topics and comments
 * Features:
 * - Search by hashtags
 * - Display trending hashtags
 * - Filter results by type (topics/comments)
 * - Responsive grid layout
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const [results, setResults] = useState({
    topics: [],
    comments: []
  });
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      searchContent();
      document.title = `Search: ${query} - VocalPoint`;
    } else {
      document.title = 'Search - VocalPoint';
    }
    fetchTrendingHashtags();
  }, [query]);

  const searchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/search/combined?hashtags=${encodeURIComponent(query)}`
      );

      setResults({
        topics: response.data.data.topics.results,
        comments: response.data.data.comments.results
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error performing search');
      showToast(error.response?.data?.message || 'Error performing search', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingHashtags = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/search/trending-hashtags`
      );
      setTrendingHashtags(response.data.data);
    } catch (error) {
      console.error('Error fetching trending hashtags:', error);
    }
  };

  const handleTopicUpdate = (updatedTopic) => {
    setResults(prev => ({
      ...prev,
      topics: prev.topics.map(topic =>
        topic._id === updatedTopic._id ? updatedTopic : topic
      )
    }));
  };

  const handleTopicDelete = (topicId) => {
    setResults(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic._id !== topicId)
    }));
  };

  const handleCommentUpdate = (updatedComment) => {
    setResults(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    }));
  };

  const handleCommentDelete = (commentId) => {
    setResults(prev => ({
      ...prev,
      comments: prev.comments.filter(comment => comment._id !== commentId)
    }));
  };

  const filteredResults = activeTab === 'all'
    ? [...results.topics, ...results.comments].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    : activeTab === 'topics'
      ? results.topics
      : results.comments;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Search
        </h1>
        <div className="max-w-2xl">
          <SearchBar />
        </div>
      </div>

      {/* Trending Hashtags */}
      {trendingHashtags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Trending Hashtags
          </h2>
          <HashtagList
            hashtags={trendingHashtags.map(tag => ({
              name: tag._id,
              count: tag.count
            }))}
            showCount
            size="lg"
          />
        </div>
      )}

      {/* Search Results */}
      {query ? (
        <div className="space-y-6">
          {/* Result Tabs */}
          <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All ({results.topics.length + results.comments.length})
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === 'topics'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Topics ({results.topics.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === 'comments'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Comments ({results.comments.length})
            </button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <IconSearch className="w-16 h-16 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <IconSearch className="w-16 h-16 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredResults.map(result => (
                'title' in result ? (
                  <TopicCard
                    key={result._id}
                    topic={result}
                    onDelete={handleTopicDelete}
                    onUpdate={handleTopicUpdate}
                  />
                ) : (
                  <CommentCard
                    key={result._id}
                    comment={result}
                    onDelete={handleCommentDelete}
                    onUpdate={handleCommentUpdate}
                  />
                )
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <IconSearch className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Enter a hashtag to search for topics and comments
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
