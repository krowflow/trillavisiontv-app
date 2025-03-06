import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

/**
 * Stream events enum
 */
export enum StreamEvents {
  STATUS_UPDATE = 'stream:status',
  VIEWER_COUNT = 'stream:viewers',
  CHAT_MESSAGE = 'chat:message'
}

/**
 * Custom hook for WebSocket connections
 * @param url - WebSocket server URL
 * @returns Socket instance and connection status
 */
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection with error handling
    try {
      const socket = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000,
        autoConnect: true,
      });

      // Set up event listeners
      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.log('Socket connection error:', error.message);
        setIsConnected(false);
      });

      // Store socket reference
      socketRef.current = socket;

      // Clean up on unmount
      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
      setIsConnected(false);
    }
  }, []);

  /**
   * Send a message through the socket
   */
  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current && socketRef.current.connected) {
      try {
        // Ensure data is serializable
        const serializedData = JSON.parse(JSON.stringify(data));
        socketRef.current.emit(event, serializedData);
      } catch (error) {
        console.error('Error emitting socket event:', error);
      }
    } else {
      console.log('Socket not connected, cannot emit event:', event);
    }
  }, []);

  /**
   * Subscribe to a socket event
   */
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      const wrappedCallback = (data: any) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event handler for ${event}:`, error);
        }
      };
      
      socketRef.current.on(event, wrappedCallback);
      
      // Return unsubscribe function
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event, wrappedCallback);
        }
      };
    }
    
    // Return a no-op function if socket is not available
    return () => {};
  }, []);

  /**
   * Unsubscribe from a socket event
   */
  const off = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off
  };
};