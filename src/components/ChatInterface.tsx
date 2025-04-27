import React, { useState, useRef } from 'react';
import { Message as MessageType } from '../types/types';
import { useSettings } from '../context/SettingsContext';
import { sendMessage } from '../utils/api';
import Message from './Message';
import { Send, AlertCircle, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ChatInterface: React.FC = () => {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!settings.apiKey) {
      setError('Please set your API key in the settings first');
      return;
    }

    const userMessage: MessageType = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    const assistantMessage: MessageType = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage, assistantMessage];
    setMessages(newMessages);
    setStreamingMessageId(assistantMessage.id);
    setInput('');
    setError(null);
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      await sendMessage(
        [...messages, userMessage],
        settings,
        abortControllerRef.current.signal,
        (chunk) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400 max-w-md backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-8 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Start a New Conversation
              </h2>
              <p className="mb-6 leading-relaxed">
                Ask anything and get real-time responses from your AI assistant.
              </p>
              <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                <p>Start typing below to begin your conversation.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map(message => (
              <Message 
                key={message.id} 
                message={message}
                isStreaming={message.id === streamingMessageId}
              />
            ))}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mt-4 rounded-md flex items-start max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                Check your API settings and ensure your API key is valid.
              </p>
            </div>
          </div>
        )}
        
        {isLoading && !streamingMessageId && (
          <div className="flex items-center space-x-2 mt-4 text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-sm">AI is thinking...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit}
        className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4"
      >
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-end rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 max-h-[150px] p-4 pr-16 rounded-2xl bg-transparent text-gray-900 dark:text-gray-100 
                       placeholder-gray-500 dark:placeholder-gray-400 resize-none overflow-y-auto
                       focus:outline-none focus:ring-0"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              className={`absolute right-2 bottom-2 p-2 rounded-xl ${
                isLoading || !input.trim()
                  ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } text-white transition-all duration-200 shadow-sm`}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;