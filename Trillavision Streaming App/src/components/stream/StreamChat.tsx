import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { StreamStatus } from '../../types';
import { useSocket, StreamEvents } from '../../hooks/useSocket';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Send, MessageSquare, User, Clock, AlertCircle } from 'lucide-react';
import { logger, LogCategory } from '../../utils/logging';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
  userType?: 'viewer' | 'moderator' | 'owner';
}

interface StreamChatProps {
  onClose?: () => void;
}

/**
 * Stream chat component
 */
export const StreamChat: React.FC<StreamChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { status } = useSelector((state: RootState) => state.stream);
  const { emit, on, isConnected } = useSocket();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Listen for chat messages
  useEffect(() => {
    setIsConnecting(true);
    
    const unsubscribe = on(StreamEvents.CHAT_MESSAGE, (message: ChatMessage) => {
      logger.debug(LogCategory.SOCKET, 'Received chat message', { message });
      setMessages(prev => [...prev, message]);
      setIsConnecting(false);
      setConnectionError(null);
    });
    
    // Simulate connection status for demo
    const timer = setTimeout(() => {
      setIsConnecting(false);
      if (!isConnected) {
        setConnectionError('Could not connect to chat server. Please try again later.');
        logger.error(LogCategory.SOCKET, 'Failed to connect to chat server');
      }
    }, 2000);
    
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [on, isConnected]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      username: 'You', // In a real app, this would be the user's name
      message: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
      userType: 'owner'
    };
    
    // Add to local messages
    setMessages(prev => [...prev, message]);
    
    // Send to server
    emit(StreamEvents.CHAT_MESSAGE, message);
    logger.debug(LogCategory.SOCKET, 'Sent chat message', { message });
    
    // Clear input
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Generate some mock messages if none exist
  useEffect(() => {
    if (messages.length === 0 && status === StreamStatus.LIVE) {
      const mockMessages: ChatMessage[] = [
        {
          id: 'mock-1',
          username: 'Viewer1',
          message: 'Hello! Great stream today!',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          userType: 'viewer'
        },
        {
          id: 'mock-2',
          username: 'Moderator',
          message: 'Welcome everyone to the stream!',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          userType: 'moderator'
        },
        {
          id: 'mock-3',
          username: 'Viewer2',
          message: 'Is this a new feature you\'re showing?',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          userType: 'viewer'
        },
        {
          id: 'mock-4',
          username: 'You',
          message: 'Yes, we\'re demonstrating the new streaming platform!',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          isOwn: true,
          userType: 'owner'
        },
        {
          id: 'mock-5',
          username: 'Viewer3',
          message: 'The audio quality is great today!',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          userType: 'viewer'
        }
      ];
      
      setMessages(mockMessages);
    }
  }, [messages.length, status]);
  
  // Get user badge based on user type
  const getUserBadge = (userType?: string) => {
    if (userType === 'owner') {
      return <span className="bg-primary text-white text-xs px-1 py-0.5 rounded">Host</span>;
    } else if (userType === 'moderator') {
      return <span className="bg-green-600 text-white text-xs px-1 py-0.5 rounded">Mod</span>;
    }
    return null;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <MessageSquare size={18} className="text-primary mr-2" />
          <h2 className="font-semibold">Live Chat</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isConnecting ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin mb-3">
              <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-500">Connecting to chat...</p>
          </div>
        ) : connectionError ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertCircle size={32} className="text-red-500 mb-3" />
            <p className="text-red-500 font-medium mb-2">Connection Error</p>
            <p className="text-gray-500 mb-4">{connectionError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsConnecting(true);
                setConnectionError(null);
                // Simulate reconnection
                setTimeout(() => {
                  setIsConnecting(false);
                  // 50% chance of success for demo purposes
                  if (Math.random() > 0.5) {
                    setConnectionError(null);
                  } else {
                    setConnectionError('Could not connect to chat server. Please try again later.');
                  }
                }, 2000);
              }}
            >
              Reconnect
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            {status === StreamStatus.LIVE ? (
              <p>No messages yet. Start the conversation!</p>
            ) : (
              <p>Chat is only available when streaming.</p>
            )}
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.isOwn
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className={`font-medium text-sm flex items-center ${message.isOwn ? 'text-white' : 'text-gray-700'}`}>
                    {message.isOwn ? (
                      <>
                        <span className="mr-1">{message.username}</span>
                        {getUserBadge(message.userType)}
                      </>
                    ) : (
                      <>
                        <User size={12} className="mr-1" />
                        <span className="mr-1">{message.username}</span>
                        {getUserBadge(message.userType)}
                      </>
                    )}
                  </span>
                  <span className={`ml-2 text-xs flex items-center ${message.isOwn ? 'text-white opacity-70' : 'text-gray-500'}`}>
                    <Clock size={10} className="mr-1" />
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p>{message.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <div className="flex">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
            disabled={status !== StreamStatus.LIVE || !!connectionError}
            className="flex-1 mr-2"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || status !== StreamStatus.LIVE || !!connectionError}
            leftIcon={<Send size={16} />}
          >
            Send
          </Button>
        </div>
        
        {status !== StreamStatus.LIVE && (
          <p className="text-xs text-gray-500 mt-2">
            Chat is only available when streaming is active.
          </p>
        )}
      </div>
    </div>
  );
};

export default StreamChat;