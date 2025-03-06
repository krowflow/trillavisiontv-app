import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateAnalytics } from '../store/slices/streamSlice';
import { youtubeAnalytics, AnalyticsData } from '../services/youtube-analytics';
import { logger, LogCategory } from '../utils/logging';
import { useSocket, StreamEvents } from './useSocket';

export const useAnalytics = (broadcastId: string | null) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (!broadcastId || !socket) return;

    const startAnalyticsPolling = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Start YouTube analytics polling
        await youtubeAnalytics.startPolling(broadcastId, (data: AnalyticsData) => {
          dispatch(updateAnalytics(data));
          setLastUpdate(Date.now());
          
          // Emit viewer count update to other clients
          socket.emit(StreamEvents.VIEWER_COUNT, data.viewerCount);
        });

        logger.info(LogCategory.ANALYTICS, 'Analytics polling started', { broadcastId });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start analytics polling';
        setError(errorMessage);
        logger.error(LogCategory.ANALYTICS, 'Analytics polling error', { error: err });
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for viewer count updates from other clients
    socket.on(StreamEvents.VIEWER_COUNT, (count: number) => {
      dispatch(updateAnalytics({ viewerCount: count } as AnalyticsData));
    });

    startAnalyticsPolling();

    return () => {
      youtubeAnalytics.stopPolling();
      socket.off(StreamEvents.VIEWER_COUNT);
      logger.info(LogCategory.ANALYTICS, 'Analytics polling stopped');
    };
  }, [broadcastId, dispatch, socket]);

  return {
    isLoading,
    error,
    lastUpdate,
    isPolling: youtubeAnalytics.isPolling()
  };
};