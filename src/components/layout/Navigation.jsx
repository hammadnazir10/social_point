import { NavLink } from 'react-router-dom';
import { IconHome, IconTrendingUp, IconSearch, IconUser, IconPlus } from '@tabler/icons-react';

/**
 * Navigation component with responsive design and active state styling
 */
const Navigation = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: <IconHome className="w-5 h-5" /> },
    { path: '/trending', label: 'Trending', icon: <IconTrendingUp className="w-5 h-5" /> },
    { path: '/search', label: 'Search', icon: <IconSearch className="w-5 h-5" /> },
    { path: '/topic/create', label: 'New Topic', icon: <IconPlus className="w-5 h-5" /> },
    // { path: '/profile', label: 'Profile', icon: <IconUser className="w-5 h-5" /> }
  ];

  const navLinkClasses = ({ isActive }) => [
    'flex items-center px-4 py-2 text-sm font-medium rounded-md',
    'transition-colors duration-200',
    isActive
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
  ].join(' ');

  return (
    <nav className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClasses}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden w-full justify-between">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => [
                  'flex flex-col items-center justify-center px-2 py-1 text-xs font-medium',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                ].join(' ')}
              >
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;