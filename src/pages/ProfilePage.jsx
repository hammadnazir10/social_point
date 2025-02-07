import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import ProfileCard from '@/components/profile/ProfileCard';
import TopicCard from '@/components/topics/TopicCard';
import CommentCard from '@/components/comments/CommentCard';
import { IconLayoutGrid, IconMessage } from '@tabler/icons-react';

/**
 * ProfilePage component for displaying user profiles
 * Shows user information, topics, and comments
 */
const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [topics, setTopics] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('topics');
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = !userId || userId === user?.id;
  const profileId = isOwnProfile ? user?.id : userId;
  console.log(isOwnProfile)
  console.log(profileId)
  useEffect(() => {
    if (profileId) {
      fetchProfileData();
    }
  }, [profileId]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log(headers,"headers")
      const [profileRes, topicsRes, commentsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/users/${profileId}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/topics?userId=${profileId}`, { headers }),  // Make sure this works with your backend logic
        axios.get(`${import.meta.env.VITE_API_URL}/api/comments?userId=${profileId}`, { headers })
      ]);
      

      setProfile(profileRes.data.data);
      setTopics(topicsRes.data.data);
      setComments(commentsRes.data.data);

      document.title = `${profileRes.data.data.username}'s Profile - VocalPoint`;
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Error fetching profile data',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicDelete = (topicId) => {
    setTopics(topics.filter(topic => topic._id !== topicId));
  };

  const handleTopicUpdate = (updatedTopic) => {
    setTopics(topics.map(topic =>
      topic._id === updatedTopic._id ? updatedTopic : topic
    ));
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  const handleCommentUpdate = (updatedComment) => {
    setComments(comments.map(comment =>
      comment._id === updatedComment._id ? updatedComment : comment
    ));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileCard profile={profile} isOwnProfile={isOwnProfile} />

      <div className="mt-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('topics')}
              className={`${
                activeTab === 'topics'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <IconLayoutGrid className="w-5 h-5 mr-2" />
              Topics ({topics.length})
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <IconMessage className="w-5 h-5 mr-2" />
              Comments ({comments.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'topics' ? (
          topics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <TopicCard
                  key={topic._id}
                  topic={topic}
                  onDelete={handleTopicDelete}
                  onUpdate={handleTopicUpdate}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No topics created yet.
            </p>
          )
        ) : (
          comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  onDelete={handleCommentDelete}
                  onUpdate={handleCommentUpdate}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No comments made yet.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
