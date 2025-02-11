import { useEffect } from 'react';
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
 * - Create new topic button
 */
const HomePage = () => {
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'VocalPoint - Home';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
         
        </h1>
        <Link to="/topic/create">
          <Button
            variant="primary"
            leftIcon={<IconPlus className="w-5 h-5" />}
          >
            New Topic
          </Button>
        </Link>
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
      </div>
    </div>
  );
};

export default HomePage;