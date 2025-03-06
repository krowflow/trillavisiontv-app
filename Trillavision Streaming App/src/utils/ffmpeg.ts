import { ffmpegApi } from '../services/api';

/**
 * FFmpeg utility functions
 * 
 * Note: This is a wrapper around the FFmpeg API service
 */

/**
 * Initialize FFmpeg
 * @returns Promise that resolves when FFmpeg is ready
 */
export const initFFmpeg = async (): Promise<boolean> => {
  console.log('Initializing FFmpeg...');
  
  try {
    // In a real implementation, this would check if FFmpeg is available
    // For this demo, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('FFmpeg initialized');
    return true;
  } catch (error) {
    console.error('Error initializing FFmpeg:', error);
    return false;
  }
};

/**
 * Get available input devices
 * @returns Promise that resolves with available devices
 */
export const getInputDevices = async () => {
  try {
    return await ffmpegApi.getDevices();
  } catch (error) {
    console.error('Error getting input devices:', error);
    return {
      cameras: [],
      microphones: [],
      screens: []
    };
  }
};

/**
 * Start streaming to RTMP server
 * @param inputSource - Input video source
 * @param rtmpUrl - RTMP server URL
 * @param streamKey - Stream key
 * @param videoSettings - Video settings
 * @param audioSettings - Audio settings
 * @returns Promise that resolves with stream ID
 */
export const startStreaming = async (
  inputSource: string,
  rtmpUrl: string,
  streamKey: string,
  videoSettings?: {
    bitrate?: string;
    maxBitrate?: string;
    bufferSize?: string;
    fps?: number;
    resolution?: string;
  },
  audioSettings?: {
    bitrate?: string;
  }
): Promise<string | null> => {
  try {
    const response = await ffmpegApi.startStream({
      inputSource,
      rtmpUrl,
      streamKey,
      videoSettings,
      audioSettings
    });
    
    if (response.success) {
      return response.streamId;
    }
    
    return null;
  } catch (error) {
    console.error('Error starting stream:', error);
    return null;
  }
};

/**
 * Stop streaming
 * @param streamId - Stream ID
 * @returns Promise that resolves when streaming stops
 */
export const stopStreaming = async (streamId: string): Promise<boolean> => {
  try {
    const response = await ffmpegApi.stopStream(streamId);
    return response.success;
  } catch (error) {
    console.error('Error stopping stream:', error);
    return false;
  }
};

/**
 * Get stream information
 * @param streamId - Stream ID
 * @returns Promise that resolves with stream information
 */
export const getStreamInfo = async (streamId: string) => {
  try {
    const response = await ffmpegApi.getStreamInfo(streamId);
    return response.success ? response : null;
  } catch (error) {
    console.error('Error getting stream info:', error);
    return null;
  }
};