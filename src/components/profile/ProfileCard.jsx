import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconPencil, IconMail, IconCalendar } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';

/**
 * ProfileCard component for displaying user profile information
 * Supports both viewing own profile and other users' profiles
 */
const ProfileCard = ({ profile, isOwnProfile = false }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Format join date
  const joinDate = new Date(profile?.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo Area */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-12 left-6">
          <Avatar
            src={profile?.profilePicture}
            alt={profile?.username}
            size="xl"
            className="ring-4 ring-white dark:ring-gray-800"
          />
        </div>

        {/* Edit Profile Button */}
        {isOwnProfile && (
          <div className="absolute top-2 right-6">
            <Link to="/profile/edit">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconPencil className="w-4 h-4" />}
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        )}

        {/* Profile Details */}
        <div className="mt-16">
          <div className="flex flex-col space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {profile?.username}
            </h2>
            
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <IconMail className="w-4 h-4" />
              <span>{profile?.email}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <IconCalendar className="w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile?.topicsCount || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile?.commentsCount || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {profile?.trendingScore || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Trending Score</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recent Activity
            </h3>
            {profile?.recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {profile.recentActivity.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-start space-x-3 text-sm"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      {activity.type === 'topic' ? '📝' : '💬'}
                    </div>
                    <div>
                      <Link
                        to={`/topic/${activity.topicId}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {activity.title}
                      </Link>
                      <p className="text-gray-500 dark:text-gray-400">
                        {activity.type === 'topic' ? 'Created a new topic' : 'Commented on'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
