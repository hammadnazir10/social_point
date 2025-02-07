import { useEffect } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '@/hooks/useTheme';

/**
 * ThemeToggle component for switching between light and dark themes
 * Persists theme preference in localStorage
 */
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    // Update document class when theme changes
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <IconSun className="w-5 h-5" />
      ) : (
        <IconMoon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;