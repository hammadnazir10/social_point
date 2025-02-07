import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';

/**
 * MainLayout component that wraps the main content with header and navigation
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;