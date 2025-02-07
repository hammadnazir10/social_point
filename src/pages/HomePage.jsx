import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import TopicList from '@/components/topics/TopicList';
import Button from '@/components/common/Button';

/**
 * HomePage component that displays trending and recent topics
 * Features:
 * - Display trending topics
 * - Show recent topics
 * - Create new topic button for authenticated users
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'VocalPoint - Home';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to VocalPoint
        </h1>
        {isAuthenticated && (
          <Link to="/topic/create">
            <Button
              variant="primary"
              leftIcon={<IconPlus className="w-5 h-5" />}
            >
              New Topic
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-12">
        {/* Trending Topics Section */}
        <section>
          <TopicList isTrending={true} />
        </section>

        {/* Recent Topics Section */}
        <section>
          <TopicList isTrending={false} />
        </section>

        {/* Call to Action for Non-authenticated Users */}
        {!isAuthenticated && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Join the Discussion
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Sign up now to participate in discussions and share your thoughts!
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button variant="primary">Sign Up</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
