import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatSettings, SettingsContextType } from '../types/types';

const defaultSettings: ChatSettings = {
  baseUrl: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  modelId: 'gpt-3.5-turbo',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ChatSettings>(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isSettingsOpen, toggleSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};