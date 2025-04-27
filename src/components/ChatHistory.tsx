import React, { useState } from 'react';
import { useChatHistory } from '../context/ChatHistoryContext';
import { MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ChatHistory: React.FC = () => {
  const { conversations, setCurrentConversation, clearHistory, deleteConversation } = useChatHistory();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectConversation = (conversation: any[]) => {
    setCurrentConversation(conversation);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-20 left-4 z-20 p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
        aria-label="Toggle chat history"
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      <div 
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative z-10 w-72 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Chat History</h2>
          <button
            onClick={clearHistory}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            aria-label="Clear history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-128px)]">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {conversations.map((conversation, index) => (
                <div
                  key={index}
                  className="group relative p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <p className="text-sm truncate">
                    {conversation[0]?.content.substring(0, 50)}...
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(index);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHistory;