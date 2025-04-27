import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import SettingsPanel from './components/SettingsPanel';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Header />
          <main>
            <ChatInterface />
          </main>
          <SettingsPanel />
        </div>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;