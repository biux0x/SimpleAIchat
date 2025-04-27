export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSettings {
  baseUrl: string;
  apiKey: string;
  modelId: string;
}

export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface SettingsContextType {
  settings: ChatSettings;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}