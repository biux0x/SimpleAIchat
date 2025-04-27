import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Settings, Moon, Sun, MessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { toggleSettings } = useSettings();

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-6 h-6 text-blue-500" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">AI Chat Interface</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleSettings}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;