import { Outlet } from 'react-router-dom';

/**
 * AuthLayout component for authentication pages
 * Provides a clean layout without header and navigation
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Outlet />
    </div>
  );
};

export default AuthLayout;