/**
 * Production environment configuration
 */
const config = {
  // API configuration
  api: {
    baseUrl: '/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  
  // Socket configuration
  socket: {
    url: '',
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
  },
  
  // YouTube API configuration
  youtube: {
    scopes: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ],
    apiKey: ''
  },
  
  // FFmpeg configuration
  ffmpeg: {
    defaultVideoSettings: {
      bitrate: '2500k',
      maxBitrate: '3000k',
      bufferSize: '6000k',
      fps: 30,
      resolution: '1280x720'
    },
    defaultAudioSettings: {
      bitrate: '128k'
    }
  },
  
  // Logging configuration
  logging: {
    level: 'info',
    consoleEnabled: false,
    maxEntries: 1000
  },
  
  // Feature flags
  features: {
    multiPlatformStreaming: false,
    advancedAudioProcessing: true,
    customOverlays: true,
    sceneTransitions: true,
    recordingEnabled: true
  },
  
  // Performance settings
  performance: {
    hardwareAcceleration: true,
    lowLatencyMode: false,
    maxBitrate: 6000,
    cacheSize: 500
  }
};

export default config;