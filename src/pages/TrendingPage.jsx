import { useEffect } from 'react';
import TopicList from '@/components/topics/TopicList';

/**
 * TrendingPage component that displays trending topics
 */
const TrendingPage = () => {
  useEffect(() => {
    document.title = 'VocalPoint - Trending Topics';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Trending Topics
      </h1> */}
      <TopicList isTrending={true} />
    </div>
  );
};

export default TrendingPage;