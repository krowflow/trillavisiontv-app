import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export enum StreamEvents {
  STATUS_UPDATE = 'stream:status',
  VIEWER_COUNT = 'stream:viewers',
  CHAT_MESSAGE = 'chat:message'
}

export const createSocketConnection = () => {
  const socket = io(SOCKET_URL, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export default createSocketConnection;