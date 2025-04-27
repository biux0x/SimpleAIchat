import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType } from '../types/types';
import { Copy, Check, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageProps {
  message: MessageType;
  isStreaming?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isStreaming = false }) => {
  const [copied, setCopied] = useState(false);
  const [codeBlockCopied, setCodeBlockCopied] = useState<string | null>(null);
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef(message.content);
  const streamRef = useRef<number>(0);
  const isUser = message.role === 'user';
  
  useEffect(() => {
    if (!isStreaming || isUser) {
      setDisplayedContent(message.content);
      contentRef.current = message.content;
      return;
    }

    const newContent = message.content.slice(displayedContent.length);
    if (newContent) {
      setDisplayedContent(prev => prev + newContent);
    }
    contentRef.current = message.content;
  }, [message.content, isStreaming, isUser]);

  const copyToClipboard = async (text: string, blockId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (blockId) {
        setCodeBlockCopied(blockId);
        setTimeout(() => setCodeBlockCopied(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div 
      className={`p-4 mb-4 max-w-full animate-fadeIn backdrop-blur-sm rounded-xl border ${
        isUser 
          ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' 
          : 'bg-gray-50/80 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'
      } shadow-lg hover:shadow-xl transition-shadow duration-200`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
        </div>
        {!isUser && (
          <button
            onClick={() => copyToClipboard(message.content)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Copy message"
          >
            {copied ? (
              <div className="flex items-center gap-1 text-green-500">
                <Check className="w-4 h-4" />
                <span className="text-xs">Copied!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Copy className="w-4 h-4" />
                <span className="text-xs">Copy</span>
              </div>
            )}
          </button>
        )}
      </div>
      <div className="text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeContent = String(children).replace(/\n$/, '');
              const blockId = inline ? null : `code-${Math.random().toString(36).substr(2, 9)}`;

              return !inline && match ? (
                <div className="relative group">
                  <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                    <div className={`px-2 py-1 rounded text-xs ${
                      match[1] === 'typescript' ? 'bg-blue-500' :
                      match[1] === 'javascript' ? 'bg-yellow-500' :
                      match[1] === 'python' ? 'bg-green-500' :
                      'bg-gray-500'
                    } text-white`}>
                      {match[1]}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClipboard(codeContent, blockId);
                      }}
                      className={`px-3 py-1 rounded-md transition-all duration-200 flex items-center gap-1 ${
                        codeBlockCopied === blockId
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      aria-label="Copy code"
                    >
                      {codeBlockCopied === blockId ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-xs">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl border border-gray-700/50 dark:border-gray-600/50 !bg-gray-900 shadow-lg"
                    showLineNumbers={true}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      paddingTop: '2.5rem',
                    }}
                    {...props}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-gray-200 dark:bg-gray-800 rounded-md px-1.5 py-0.5 font-mono text-sm" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {displayedContent}
        </ReactMarkdown>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;