import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import winston from 'winston';

// Import route handlers
import youtubeRoutes from './routes/youtube.js';
import ffmpegRoutes from './routes/ffmpeg.js';
import streamRoutes from './routes/stream.js';

// Configure environment variables
dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/youtube', youtubeRoutes);
app.use('/api/ffmpeg', ffmpegRoutes);
app.use('/api/stream', streamRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('stream:status', (data) => {
    logger.info(`Stream status update: ${JSON.stringify(data)}`);
    socket.broadcast.emit('stream:status', data);
  });
  
  socket.on('stream:viewers', (count) => {
    logger.info(`Viewer count update: ${count}`);
    io.emit('stream:viewers', count);
  });
  
  socket.on('chat:message', (message) => {
    logger.info(`Chat message: ${JSON.stringify(message)}`);
    io.emit('chat:message', message);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API URL: http://localhost:${PORT}/api`);
  logger.info(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

export default server;