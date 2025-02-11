import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IconEdit, IconTrash, IconArrowLeft, IconShare } from '@tabler/icons-react';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';
import { getAnonymousUserId } from '@/hooks/anonymousUser';
import Button from '@/components/common/Button';
import CommentList from '@/components/comments/CommentList';
import HashtagList from '@/components/common/HashtagList';
import Avatar from '@/components/common/Avatar';

const TopicDetailPage = () => {
  const { id } = useParams();
  console.log('idd ', id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getAnonymousUserId();

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/topics/${id}`);
      setTopic(response.data.data);
      document.title = `${response.data.data.title} - VocalPoint`;
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching topic');
      showToast(error.response?.data?.message || 'Error fetching topic', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/topics/${id}`);
      showToast('Topic deleted successfully', 'success');
      navigate('/');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting topic', 'error');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: topic.title,
        text: topic.description,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!topic) return null;

  const isOwner = userId === topic.userId;
  const formattedDate = new Date(topic.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<IconArrowLeft className="w-5 h-5" />}>
          Back
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={handleShare} leftIcon={<IconShare className="w-5 h-5" />}>
            Share
          </Button>
          {/* {isOwner && (
            <>
              <Link to={`/topic/edit/${id}`}>
                <Button variant="outline" leftIcon={<IconEdit className="w-5 h-5" />}>
                  Edit
                </Button>
              </Link>
              <Button variant="danger" onClick={handleDelete} leftIcon={<IconTrash className="w-5 h-5" />}>
                Delete
              </Button>
            </>
          )} */}
        </div>
      </div>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{topic.title}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <Link to={`/profile/${topic.userId}`} className="flex items-center">
              <Avatar src={topic.userId?.profilePicture} alt={topic.userId?.username} size="md" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{topic.userId?.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
              </div>
            </Link>
          </div>
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300">{topic.description}</p>
          </div>
          {topic.hashtags?.length > 0 && (
            <div className="mb-6">
              <HashtagList hashtags={topic.hashtags} size="lg" />
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-4">
              <span>{topic.trendingScore || 0} trending points</span>
              <span>•</span>
              <span>Comments</span>
            </div>
          </div>
        </div>
      </article>
      <div className="mt-8">
        <CommentList topicId={id} />
      </div>
    </div>
  );
};

export default TopicDetailPage;