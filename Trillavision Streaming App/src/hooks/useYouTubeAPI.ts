import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setYouTubeConnection, setStreamError } from '../store/slices/streamSlice';
import { youtubeService } from '../services/youtube-service';
import { logger, LogCategory } from '../utils/logging';

/**
 * Custom hook for YouTube API integration
 * @returns YouTube API methods and connection status
 */
export const useYouTubeAPI = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const dispatch = useDispatch();

  /**
   * Initialize YouTube API
   */
  useEffect(() => {
    // Check if we're authorized with YouTube
    const authorized = youtubeService.isAuthorized();
    setIsAuthorized(authorized);
    dispatch(setYouTubeConnection(authorized));
    
    setIsLoaded(true);
    
    logger.debug(LogCategory.YOUTUBE, 'YouTube API hook initialized', { authorized });
  }, [dispatch]);

  /**
   * Get authorization URL
   */
  const getAuthUrl = useCallback(async () => {
    try {
      const authUrl = await youtubeService.getAuthUrl();
      return authUrl;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error getting auth URL', { error });
      dispatch(setStreamError('Failed to get YouTube authorization URL'));
      return null;
    }
  }, [dispatch]);

  /**
   * Authorize with YouTube
   */
  const authorize = useCallback(async (code: string) => {
    if (!isLoaded) {
      dispatch(setStreamError('YouTube API not loaded'));
      return false;
    }

    try {
      const success = await youtubeService.authorize(code);
      
      if (success) {
        setIsAuthorized(true);
        dispatch(setYouTubeConnection(true));
        return true;
      } else {
        throw new Error('Failed to get tokens');
      }
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'YouTube authorization error', { error });
      dispatch(setStreamError('Failed to authorize with YouTube'));
      return false;
    }
  }, [isLoaded, dispatch]);

  /**
   * Create a new YouTube broadcast
   */
  const createBroadcast = useCallback(async (
    title: string, 
    description: string, 
    isPrivate: boolean,
    scheduledStartTime?: string
  ) => {
    if (!isAuthorized) {
      dispatch(setStreamError('Not authorized with YouTube'));
      return null;
    }

    try {
      const broadcastData = await youtubeService.createBroadcast(
        title, 
        description, 
        isPrivate,
        scheduledStartTime
      );
      
      if (!broadcastData) {
        throw new Error('Failed to create broadcast');
      }
      
      return broadcastData;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Failed to create broadcast', { error });
      dispatch(setStreamError('Failed to create YouTube broadcast'));
      return null;
    }
  }, [isAuthorized, dispatch]);

  /**
   * Start a YouTube broadcast
   */
  const startBroadcast = useCallback(async (broadcastId: string) => {
    if (!isAuthorized) {
      dispatch(setStreamError('Not authorized with YouTube'));
      return false;
    }

    try {
      return await youtubeService.startBroadcast(broadcastId);
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Failed to start broadcast', { error });
      dispatch(setStreamError('Failed to start YouTube broadcast'));
      return false;
    }
  }, [isAuthorized, dispatch]);

  /**
   * End a YouTube broadcast
   */
  const endBroadcast = useCallback(async (broadcastId: string) => {
    if (!isAuthorized) {
      return false;
    }

    try {
      return await youtubeService.endBroadcast(broadcastId);
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Failed to end broadcast', { error });
      dispatch(setStreamError('Failed to end YouTube broadcast'));
      return false;
    }
  }, [isAuthorized, dispatch]);

  /**
   * Get broadcast status
   */
  const getBroadcastStatus = useCallback(async (broadcastId: string) => {
    if (!isAuthorized) {
      return null;
    }

    try {
      return await youtubeService.getBroadcastStatus(broadcastId);
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Failed to get broadcast status', { error });
      return null;
    }
  }, [isAuthorized]);

  /**
   * List recent broadcasts
   */
  const listBroadcasts = useCallback(async (maxResults: number = 10) => {
    if (!isAuthorized) {
      return [];
    }

    try {
      return await youtubeService.listBroadcasts(maxResults);
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Failed to list broadcasts', { error });
      return [];
    }
  }, [isAuthorized]);

  return {
    isLoaded,
    isAuthorized,
    getAuthUrl,
    authorize,
    createBroadcast,
    startBroadcast,
    endBroadcast,
    getBroadcastStatus,
    listBroadcasts
  };
};