import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '../types/types';

interface ChatHistoryContextType {
  conversations: Message[][];
  currentConversation: Message[];
  setCurrentConversation: (messages: Message[]) => void;
  addConversation: (messages: Message[]) => void;
  clearHistory: () => void;
  deleteConversation: (index: number) => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const ChatHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Message[][]>([]);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);

  const addConversation = (messages: Message[]) => {
    setConversations(prev => [...prev, messages]);
  };

  const clearHistory = () => {
    setConversations([]);
    setCurrentConversation([]);
  };

  const deleteConversation = (index: number) => {
    setConversations(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ChatHistoryContext.Provider 
      value={{ 
        conversations, 
        currentConversation, 
        setCurrentConversation, 
        addConversation,
        clearHistory,
        deleteConversation
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = (): ChatHistoryContextType => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};