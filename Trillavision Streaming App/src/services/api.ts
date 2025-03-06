import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ErrorCode } from '../utils/errorHandling';
import { logger, LogCategory } from '../utils/logging';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * API service for making HTTP requests to the backend
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('youtube_tokens');
    if (tokens) {
      config.headers.Authorization = `Bearer ${tokens}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Create a more detailed error object
    const enhancedError: any = new Error(
      error.response?.data?.message || error.message
    );
    
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;
    enhancedError.config = error.config;
    
    // Add error code based on status or error type
    if (error.response) {
      switch (error.response.status) {
        case 401:
          enhancedError.code = ErrorCode.UNAUTHORIZED;
          break;
        case 403:
          enhancedError.code = ErrorCode.AUTH_ERROR;
          break;
        default:
          enhancedError.code = ErrorCode.API_ERROR;
      }
    } else if (error.request) {
      enhancedError.code = ErrorCode.NETWORK_ERROR;
    } else if (error.message && error.message.includes('timeout')) {
      enhancedError.code = ErrorCode.TIMEOUT_ERROR;
    } else {
      enhancedError.code = ErrorCode.UNKNOWN_ERROR;
    }
    
    return Promise.reject(enhancedError);
  }
);

/**
 * Device API endpoints
 */
export const deviceApi = {
  /**
   * Get all available devices
   */
  getDevices: async () => {
    try {
      logger.debug(LogCategory.API, 'Getting available devices');
      
      // For demo purposes, return mock data
      return {
        cameras: [
          { id: 'sony-zv-e1', name: 'Sony ZV-E1 Vlogging Camera' },
          { id: 'camera1', name: 'Webcam C920' }
        ],
        microphones: [
          { 
            id: 'shure-sm7b-1', 
            name: 'Shure SM7B (Main)', 
            type: 'XLR Microphone',
            connection: 'Focusrite Clarett - Channel 1' 
          },
          { 
            id: 'shure-sm7b-2', 
            name: 'Shure SM7B (Secondary)', 
            type: 'XLR Microphone',
            connection: 'Focusrite Clarett - Channel 2' 
          },
          { 
            id: 'focusrite-clarett-3', 
            name: 'Focusrite Clarett - Channel 3', 
            type: 'Audio Interface',
            connection: 'Direct' 
          },
          { 
            id: 'focusrite-clarett-4', 
            name: 'Focusrite Clarett - Channel 4', 
            type: 'Audio Interface',
            connection: 'Direct' 
          }
        ],
        screens: [
          { id: 'screen1', name: 'Primary Display' },
          { id: 'screen2', name: 'Secondary Display' },
          { id: 'window', name: 'Application Window' }
        ]
      };
    } catch (error) {
      logger.error(LogCategory.API, 'Error getting devices', { error });
      throw error;
    }
  },
  
  /**
   * Add a new device
   */
  addDevice: async (deviceData: {
    type: string;
    name: string;
    connection?: string;
  }) => {
    try {
      const response = await api.post('/devices', deviceData);
      return response.data;
    } catch (error) {
      console.error('Error adding device:', error);
      return { 
        success: false,
        device: {
          id: `custom-${Date.now()}`,
          name: deviceData.name,
          type: deviceData.type,
          connection: deviceData.connection
        }
      };
    }
  },
  
  /**
   * Remove a device
   */
  removeDevice: async (deviceId: string) => {
    try {
      const response = await api.delete(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing device:', error);
      return { success: false };
    }
  },
  
  /**
   * Update device settings
   */
  updateDeviceSettings: async (deviceId: string, settings: {
    gain?: number;
    muted?: boolean;
    active?: boolean;
  }) => {
    try {
      const response = await api.put(`/devices/${deviceId}/settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating device settings:', error);
      return { success: false };
    }
  }
};

/**
 * YouTube API endpoints
 */
export const youtubeApi = {
  /**
   * Get YouTube authorization URL
   */
  getAuthUrl: async () => {
    try {
      const response = await api.get('/youtube/auth-url');
      return response.data;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      return { authUrl: null };
    }
  },
  
  /**
   * Exchange authorization code for tokens
   */
  exchangeCodeForTokens: async (code: string) => {
    try {
      const response = await api.post('/youtube/auth-callback', { code });
      return response.data;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return { success: false };
    }
  },
  
  /**
   * Create a new broadcast
   */
  createBroadcast: async (broadcastData: {
    title: string;
    description: string;
    scheduledStartTime?: string;
    privacyStatus?: string;
    tokens: any;
  }) => {
    try {
      const response = await api.post('/youtube/broadcasts', broadcastData);
      return response.data;
    } catch (error) {
      console.error('Error creating broadcast:', error);
      return { success: false };
    }
  },
  
  /**
   * Get broadcast status
   */
  getBroadcastStatus: async (broadcastId: string, tokens: any) => {
    try {
      const response = await api.get(`/youtube/broadcasts/${broadcastId}/status`, {
        params: { tokens: JSON.stringify(tokens) }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting broadcast status:', error);
      return { success: false };
    }
  },
  
  /**
   * Start a broadcast
   */
  startBroadcast: async (broadcastId: string, tokens: any) => {
    try {
      const response = await api.post(`/youtube/broadcasts/${broadcastId}/start`, { tokens });
      return response.data;
    } catch (error) {
      console.error('Error starting broadcast:', error);
      return { success: false };
    }
  },
  
  /**
   * End a broadcast
   */
  endBroadcast: async (broadcastId: string, tokens: any) => {
    try {
      const response = await api.post(`/youtube/broadcasts/${broadcastId}/end`, { tokens });
      return response.data;
    } catch (error) {
      console.error('Error ending broadcast:', error);
      return { success: false };
    }
  },

  /**
   * Get broadcast analytics
   */
  getBroadcastAnalytics: async (broadcastId: string, tokens: any) => {
    try {
      const response = await api.get(`/youtube/broadcasts/${broadcastId}/analytics`, {
        params: { tokens: JSON.stringify(tokens) }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting broadcast analytics:', error);
      return { success: false };
    }
  }
};

/**
 * FFmpeg API endpoints
 */
export const ffmpegApi = {
  /**
   * Get available input devices
   */
  getDevices: async () => {
    try {
      const response = await api.get('/ffmpeg/devices');
      return response.data;
    } catch (error) {
      console.error('Error getting devices:', error);
      // Return mock data as fallback
      return {
        cameras: [
          { id: 'sony-zv-e1', name: 'Sony ZV-E1 Vlogging Camera' },
          { id: 'camera1', name: 'Webcam C920' }
        ],
        microphones: [
          { 
            id: 'shure-sm7b-1', 
            name: 'Shure SM7B (Main)', 
            type: 'XLR Microphone',
            connection: 'Focusrite Clarett - Channel 1' 
          },
          { 
            id: 'shure-sm7b-2', 
            name: 'Shure SM7B (Secondary)', 
            type: 'XLR Microphone',
            connection: 'Focusrite Clarett - Channel 2' 
          },
          { 
            id: 'focusrite-clarett-3', 
            name: 'Focusrite Clarett - Channel 3', 
            type: 'Audio Interface',
            connection: 'Direct' 
          },
          { 
            id: 'focusrite-clarett-4', 
            name: 'Focusrite Clarett - Channel 4', 
            type: 'Audio Interface',
            connection: 'Direct' 
          }
        ],
        screens: [
          { id: 'screen1', name: 'Primary Display' },
          { id: 'screen2', name: 'Secondary Display' },
          { id: 'window', name: 'Application Window' }
        ]
      };
    }
  },
  
  /**
   * Start streaming to RTMP server
   */
  startStream: async (streamData: {
    inputSource: string;
    rtmpUrl: string;
    streamKey: string;
    videoSettings?: {
      bitrate?: string;
      maxBitrate?: string;
      bufferSize?: string;
      fps?: number;
      resolution?: string;
    };
    audioSettings?: {
      bitrate?: string;
      mixMultipleInputs?: boolean;
      primaryMicrophoneGain?: number;
      secondaryMicrophoneGain?: number;
    };
  }) => {
    try {
      const response = await api.post('/ffmpeg/stream', streamData);
      return response.data;
    } catch (error) {
      console.error('Error starting stream:', error);
      return { success: false };
    }
  },
  
  /**
   * Stop an active stream
   */
  stopStream: async (streamId: string) => {
    try {
      const response = await api.post(`/ffmpeg/stream/${streamId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping stream:', error);
      return { success: false };
    }
  },
  
  /**
   * Get stream information
   */
  getStreamInfo: async (streamId: string) => {
    try {
      const response = await api.get(`/ffmpeg/stream/${streamId}/info`);
      return response.data;
    } catch (error) {
      console.error('Error getting stream info:', error);
      return { success: false };
    }
  },
  
  /**
   * Update stream audio settings
   */
  updateStreamAudio: async (streamId: string, audioSettings: {
    primaryMicrophoneGain?: number;
    secondaryMicrophoneGain?: number;
    primaryMicrophoneMuted?: boolean;
    secondaryMicrophoneMuted?: boolean;
  }) => {
    try {
      const response = await api.post(`/ffmpeg/stream/${streamId}/audio`, audioSettings);
      return response.data;
    } catch (error) {
      console.error('Error updating stream audio settings:', error);
      return { success: false };
    }
  }
};

/**
 * Stream API endpoints
 */
export const streamApi = {
  /**
   * Create a new stream configuration
   */
  createStream: async (streamData: {
    name: string;
    platform: string;
    quality: string;
    isPrivate: boolean;
    description: string;
  }) => {
    try {
      const response = await api.post('/stream', streamData);
      return response.data;
    } catch (error) {
      console.error('Error creating stream:', error);
      return { success: false };
    }
  },
  
  /**
   * Get all streams
   */
  getStreams: async () => {
    try {
      const response = await api.get('/stream');
      return response.data;
    } catch (error) {
      console.error('Error getting streams:', error);
      return { success: false, streams: [] };
    }
  },
  
  /**
   * Get a specific stream
   */
  getStream: async (streamId: string) => {
    try {
      const response = await api.get(`/stream/${streamId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting stream:', error);
      return { success: false };
    }
  },
  
  /**
   * Update a stream
   */
  updateStream: async (streamId: string, updates: any) => {
    try {
      const response = await api.put(`/stream/${streamId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating stream:', error);
      return { success: false };
    }
  },
  
  /**
   * Delete a stream
   */
  deleteStream: async (streamId: string) => {
    try {
      const response = await api.delete(`/stream/${streamId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting stream:', error);
      return { success: false };
    }
  },
  
  /**
   * Add a scene to a stream
   */
  addScene: async (streamId: string, sceneData: {
    name: string;
    layout: any;
    sources?: any[];
  }) => {
    try {
      const response = await api.post(`/stream/${streamId}/scenes`, sceneData);
      return response.data;
    } catch (error) {
      console.error('Error adding scene:', error);
      return { success: false };
    }
  },
  
  /**
   * Update stream status
   */
  updateStreamStatus: async (streamId: string, statusData: {
    status?: string;
    viewerCount?: number;
    duration?: number;
  }) => {
    try {
      const response = await api.post(`/stream/${streamId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating stream status:', error);
      return { success: false };
    }
  }
};

// Create a type-safe API client with error handling
export class ApiClient {
  private client: AxiosInstance;
  
  constructor(baseURL: string = API_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const tokens = localStorage.getItem('youtube_tokens');
        if (tokens) {
          config.headers.Authorization = `Bearer ${tokens}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Enhanced error handling
        const enhancedError: any = new Error(
          error.response?.data?.message || error.message
        );
        
        enhancedError.status = error.response?.status;
        enhancedError.data = error.response?.data;
        enhancedError.config = error.config;
        
        // Add error code based on status or error type
        if (error.response) {
          switch (error.response.status) {
            case 401:
              enhancedError.code = ErrorCode.UNAUTHORIZED;
              break;
            case 403:
              enhancedError.code = ErrorCode.AUTH_ERROR;
              break;
            default:
              enhancedError.code = ErrorCode.API_ERROR;
          }
        } else if (error.request) {
          enhancedError.code = ErrorCode.NETWORK_ERROR;
        } else if (error.message && error.message.includes('timeout')) {
          enhancedError.code = ErrorCode.TIMEOUT_ERROR;
        } else {
          enhancedError.code = ErrorCode.UNKNOWN_ERROR;
        }
        
        return Promise.reject(enhancedError);
      }
    );
  }
  
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export a singleton instance of the API client
export const apiClient = new ApiClient();

export default api;