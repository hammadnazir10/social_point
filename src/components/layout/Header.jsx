import { Link } from 'react-router-dom';
import { IconUser, IconSettings, IconLogout } from '@tabler/icons-react';
import { getAnonymousUserId } from '@/hooks/anonymousUser';
import Button from '@/components/common/Button';
import ThemeToggle from '@/components/common/ThemeToggle';

const Header = () => {
  const userId = getAnonymousUserId();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
            VocalPoint
            </Link>
          </div>
          <div className="flex items-center">
          <ThemeToggle />
            {/* <Link to={`/profile/${userId}`} className="flex items-center space-x-2">
              <IconUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Profile</span>
            </Link> */}
            <Link to="/settings" className="flex items-center space-x-2 ml-4">
              <IconSettings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Settings</span>
            </Link>
            {/* <Button variant="ghost" className="ml-4">
              <IconLogout className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Logout</span>
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;