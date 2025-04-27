import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Save } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, isSettingsOpen, toggleSettings } = useSettings();
  const [tempSettings, setTempSettings] = React.useState({ ...settings });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempSettings({ ...tempSettings, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    toggleSettings();
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-auto p-6 shadow-lg animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">API Settings</h2>
          <button
            onClick={toggleSettings}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base URL
              </label>
              <input
                type="url"
                id="baseUrl"
                name="baseUrl"
                value={tempSettings.baseUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="https://api.openai.com/v1/chat/completions"
                required
              />
            </div>
            
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={tempSettings.apiKey}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="sk-..."
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
            
            <div>
              <label htmlFor="modelId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model ID
              </label>
              <input
                type="text"
                id="modelId"
                name="modelId"
                value={tempSettings.modelId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="gpt-3.5-turbo"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </form>
        
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Instructions</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-4">
            <li>Enter the OpenAI API endpoint or your custom API server URL</li>
            <li>Provide your API key (starts with "sk-" for OpenAI)</li>
            <li>Specify the model ID (e.g., gpt-3.5-turbo, gpt-4)</li>
            <li>Settings are saved in your browser's local storage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;