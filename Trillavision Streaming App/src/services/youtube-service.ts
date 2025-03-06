import { youtubeApi } from './api';
import { logger, LogCategory } from '../utils/logging';

/**
 * YouTube service for managing YouTube API interactions
 */
export class YouTubeService {
  private static instance: YouTubeService;
  private tokens: any = null;
  
  private constructor() {
    // Load tokens from localStorage if available
    try {
      const storedTokens = localStorage.getItem('youtube_tokens');
      if (storedTokens) {
        this.tokens = JSON.parse(storedTokens);
      }
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error loading YouTube tokens from localStorage', { error });
    }
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }
  
  /**
   * Check if the user is authorized with YouTube
   */
  public isAuthorized(): boolean {
    return !!this.tokens;
  }
  
  /**
   * Set the tokens
   */
  public setTokens(tokens: any): void {
    this.tokens = tokens;
    
    // Save tokens to localStorage
    try {
      localStorage.setItem('youtube_tokens', JSON.stringify(tokens));
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error saving YouTube tokens to localStorage', { error });
    }
  }
  
  /**
   * Clear the tokens
   */
  public clearTokens(): void {
    this.tokens = null;
    
    // Remove tokens from localStorage
    try {
      localStorage.removeItem('youtube_tokens');
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error removing YouTube tokens from localStorage', { error });
    }
  }
  
  /**
   * Get the authorization URL
   */
  public async getAuthUrl(): Promise<string | null> {
    try {
      const response = await youtubeApi.getAuthUrl();
      return response.authUrl;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error getting YouTube auth URL', { error });
      return null;
    }
  }
  
  /**
   * Exchange authorization code for tokens
   */
  public async authorize(code: string): Promise<boolean> {
    try {
      const response = await youtubeApi.exchangeCodeForTokens(code);
      
      if (response.success && response.tokens) {
        this.setTokens(response.tokens);
        logger.info(LogCategory.YOUTUBE, 'YouTube authorization successful');
        return true;
      }
      
      logger.error(LogCategory.YOUTUBE, 'YouTube authorization failed', { response });
      return false;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error during YouTube authorization', { error });
      return false;
    }
  }
  
  /**
   * Create a new broadcast
   */
  public async createBroadcast(
    title: string,
    description: string,
    isPrivate: boolean,
    scheduledStartTime?: string
  ): Promise<{
    id: string;
    streamKey: string;
    ingestionUrl: string;
    monitorStream: string;
  } | null> {
    if (!this.isAuthorized()) {
      logger.error(LogCategory.YOUTUBE, 'Cannot create broadcast: Not authorized with YouTube');
      return null;
    }
    
    try {
      const response = await youtubeApi.createBroadcast({
        title,
        description,
        scheduledStartTime,
        privacyStatus: isPrivate ? 'private' : 'public',
        tokens: this.tokens
      });
      
      if (response.success) {
        const broadcastData = {
          id: response.broadcast.id,
          streamKey: response.stream.cdn.ingestionInfo.streamName,
          ingestionUrl: response.stream.cdn.ingestionInfo.ingestionAddress,
          monitorStream: `https://www.youtube.com/watch?v=${response.broadcast.id}`
        };
        
        logger.info(LogCategory.YOUTUBE, 'YouTube broadcast created', { 
          broadcastId: broadcastData.id,
          title
        });
        
        return broadcastData;
      }
      
      logger.error(LogCategory.YOUTUBE, 'Failed to create YouTube broadcast', { response });
      return null;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error creating YouTube broadcast', { error });
      return null;
    }
  }
  
  /**
   * Start a broadcast
   */
  public async startBroadcast(broadcastId: string): Promise<boolean> {
    if (!this.isAuthorized()) {
      logger.error(LogCategory.YOUTUBE, 'Cannot start broadcast: Not authorized with YouTube');
      return false;
    }
    
    try {
      const response = await youtubeApi.startBroadcast(broadcastId, this.tokens);
      
      if (response.success) {
        logger.info(LogCategory.YOUTUBE, 'YouTube broadcast started', { broadcastId });
        return true;
      }
      
      logger.error(LogCategory.YOUTUBE, 'Failed to start YouTube broadcast', { response });
      return false;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error starting YouTube broadcast', { error });
      return false;
    }
  }
  
  /**
   * End a broadcast
   */
  public async endBroadcast(broadcastId: string): Promise<boolean> {
    if (!this.isAuthorized()) {
      logger.error(LogCategory.YOUTUBE, 'Cannot end broadcast: Not authorized with YouTube');
      return false;
    }
    
    try {
      const response = await youtubeApi.endBroadcast(broadcastId, this.tokens);
      
      if (response.success) {
        logger.info(LogCategory.YOUTUBE, 'YouTube broadcast ended', { broadcastId });
        return true;
      }
      
      logger.error(LogCategory.YOUTUBE, 'Failed to end YouTube broadcast', { response });
      return false;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error ending YouTube broadcast', { error });
      return false;
    }
  }
  
  /**
   * Get broadcast status
   */
  public async getBroadcastStatus(broadcastId: string): Promise<any> {
    if (!this.isAuthorized()) {
      logger.error(LogCategory.YOUTUBE, 'Cannot get broadcast status: Not authorized with YouTube');
      return null;
    }
    
    try {
      const response = await youtubeApi.getBroadcastStatus(broadcastId, this.tokens);
      
      if (response.success) {
        return response;
      }
      
      logger.error(LogCategory.YOUTUBE, 'Failed to get YouTube broadcast status', { response });
      return null;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error getting YouTube broadcast status', { error });
      return null;
    }
  }
  
  /**
   * Get broadcast analytics
   */
  public async getBroadcastAnalytics(broadcastId: string): Promise<any> {
    if (!this.isAuthorized()) {
      logger.error(LogCategory.YOUTUBE, 'Cannot get broadcast analytics: Not authorized with YouTube');
      return null;
    }
    
    try {
      const response = await youtubeApi.getBroadcastAnalytics(broadcastId, this.tokens);
      
      if (response.success) {
        return response.data;
      }
      
      logger.error(LogCategory.YOUTUBE, 'Failed to get YouTube broadcast analytics', { response });
      return null;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error getting YouTube broadcast analytics', { error });
      return null;
    }
  }
  
  /**
   * List recent broadcasts
   */
  public async listBroadcasts(maxResults: number = 10): Promise<any[]> {
    if (!this.isAuthorized()) {
      logger.error(LogCategory.YOUTUBE, 'Cannot list broadcasts: Not authorized with YouTube');
      return [];
    }
    
    // This would be implemented with a real API call in a production app
    // For now, return mock data
    return [
      {
        id: 'broadcast-1',
        title: 'Introduction to Trillavision T.V.',
        description: 'Learn about the features of Trillavision T.V.',
        status: 'completed',
        scheduledStartTime: '2025-03-15T18:00:00Z',
        actualStartTime: '2025-03-15T18:02:15Z',
        actualEndTime: '2025-03-15T19:26:51Z',
        viewCount: 156,
        likeCount: 42
      },
      {
        id: 'broadcast-2',
        title: 'Podcast Episode #1 - Getting Started',
        description: 'First episode of our podcast series',
        status: 'completed',
        scheduledStartTime: '2025-03-10T20:00:00Z',
        actualStartTime: '2025-03-10T20:01:45Z',
        actualEndTime: '2025-03-10T20:49:57Z',
        viewCount: 89,
        likeCount: 23
      },
      {
        id: 'broadcast-3',
        title: 'Live Q&A Session',
        description: 'Answering your questions about streaming',
        status: 'completed',
        scheduledStartTime: '2025-03-05T19:00:00Z',
        actualStartTime: '2025-03-05T19:00:12Z',
        actualEndTime: '2025-03-05T19:32:57Z',
        viewCount: 64,
        likeCount: 18
      }
    ];
  }
}

// Export a singleton instance
export const youtubeService = YouTubeService.getInstance();

export default youtubeService;