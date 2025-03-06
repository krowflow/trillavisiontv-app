import { youtubeApi } from '../services/api';

/**
 * YouTube API utility functions
 * 
 * Note: This is a wrapper around the YouTube API service
 */

/**
 * Get YouTube authorization URL
 * @returns Promise that resolves with auth URL
 */
export const getAuthUrl = async (): Promise<string | null> => {
  try {
    const response = await youtubeApi.getAuthUrl();
    return response.authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    return null;
  }
};

/**
 * Exchange authorization code for tokens
 * @param code - Authorization code
 * @returns Promise that resolves with tokens
 */
export const exchangeCodeForTokens = async (code: string) => {
  try {
    const response = await youtubeApi.exchangeCodeForTokens(code);
    
    if (response.success && response.tokens) {
      // Store tokens in localStorage
      localStorage.setItem('youtube_tokens', JSON.stringify(response.tokens));
      return response.tokens;
    }
    
    return null;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return null;
  }
};

/**
 * Create a YouTube broadcast
 * @param title - Broadcast title
 * @param description - Broadcast description
 * @param isPrivate - Whether the broadcast is private
 * @returns Promise that resolves with broadcast data
 */
export const createBroadcast = async (
  title: string,
  description: string,
  isPrivate: boolean
) => {
  try {
    const tokens = JSON.parse(localStorage.getItem('youtube_tokens') || '{}');
    
    const response = await youtubeApi.createBroadcast({
      title,
      description,
      privacyStatus: isPrivate ? 'private' : 'public',
      tokens
    });
    
    if (response.success) {
      return {
        id: response.broadcast.id,
        streamKey: response.stream.cdn.ingestionInfo.streamName,
        ingestionUrl: response.stream.cdn.ingestionInfo.ingestionAddress,
        monitorStream: `https://www.youtube.com/watch?v=${response.broadcast.id}`
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return null;
  }
};

/**
 * Start a YouTube broadcast
 * @param broadcastId - Broadcast ID
 * @returns Promise that resolves when broadcast is started
 */
export const startBroadcast = async (broadcastId: string): Promise<boolean> => {
  try {
    const tokens = JSON.parse(localStorage.getItem('youtube_tokens') || '{}');
    
    const response = await youtubeApi.startBroadcast(broadcastId, tokens);
    return response.success;
  } catch (error) {
    console.error('Error starting broadcast:', error);
    return false;
  }
};

/**
 * End a YouTube broadcast
 * @param broadcastId - Broadcast ID
 * @returns Promise that resolves when broadcast is ended
 */
export const endBroadcast = async (broadcastId: string): Promise<boolean> => {
  try {
    const tokens = JSON.parse(localStorage.getItem('youtube_tokens') || '{}');
    
    const response = await youtubeApi.endBroadcast(broadcastId, tokens);
    return response.success;
  } catch (error) {
    console.error('Error ending broadcast:', error);
    return false;
  }
};

/**
 * Get broadcast status
 * @param broadcastId - Broadcast ID
 * @returns Promise that resolves with broadcast status
 */
export const getBroadcastStatus = async (broadcastId: string) => {
  try {
    const tokens = JSON.parse(localStorage.getItem('youtube_tokens') || '{}');
    
    const response = await youtubeApi.getBroadcastStatus(broadcastId, tokens);
    return response.success ? response : null;
  } catch (error) {
    console.error('Error getting broadcast status:', error);
    return null;
  }
};