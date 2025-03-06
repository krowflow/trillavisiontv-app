import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateAnalytics } from '../store/slices/streamSlice';
import { youtubeService } from '../services/youtube-service';
import { logger, LogCategory } from '../utils/logging';
import { StreamAnalytics } from '../types';

export const useYouTubeAnalytics = (broadcastId: string | null) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!broadcastId) return;

    const startAnalyticsPolling = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Initial fetch
        await fetchAnalytics();
        
        // Set up polling
        const interval = setInterval(fetchAnalytics, 10000); // Poll every 10 seconds
        setPollingInterval(interval);
        
        logger.info(LogCategory.YOUTUBE, 'Analytics polling started', { broadcastId });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start analytics polling';
        setError(errorMessage);
        logger.error(LogCategory.YOUTUBE, 'Analytics polling error', { error: err });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const analyticsData = await youtubeService.getBroadcastAnalytics(broadcastId);
        
        if (analyticsData) {
          // Create mock data for demo purposes
          const mockData: StreamAnalytics = {
            viewerCount: Math.floor(Math.random() * 100) + 50,
            peakViewers: Math.floor(Math.random() * 150) + 100,
            averageViewers: Math.floor(Math.random() * 80) + 40,
            chatMessages: Math.floor(Math.random() * 200) + 50,
            engagementRate: Math.random() * 15 + 5,
            viewerRetention: Math.random() * 1800 + 600, // 10-30 minutes in seconds
            viewerHistory: Array.from({ length: 20 }, (_, i) => ({
              timestamp: new Date(Date.now() - (19 - i) * 60000).toISOString(),
              count: Math.floor(Math.random() * 100) + 20
            })),
            deviceBreakdown: {
              desktop: Math.random() * 60 + 20,
              mobile: Math.random() * 40 + 10,
              tablet: Math.random() * 20 + 5,
              other: Math.random() * 10
            },
            geographicData: [
              { country: 'United States', percentage: Math.random() * 40 + 20 },
              { country: 'United Kingdom', percentage: Math.random() * 20 + 10 },
              { country: 'Canada', percentage: Math.random() * 15 + 5 },
              { country: 'Germany', percentage: Math.random() * 10 + 5 },
              { country: 'Australia', percentage: Math.random() * 10 + 2 },
              { country: 'France', percentage: Math.random() * 8 + 2 },
              { country: 'Japan', percentage: Math.random() * 7 + 1 },
              { country: 'Brazil', percentage: Math.random() * 6 + 1 },
              { country: 'India', percentage: Math.random() * 5 + 1 },
              { country: 'Mexico', percentage: Math.random() * 4 + 1 }
            ]
          };
          
          dispatch(updateAnalytics(mockData));
          setLastUpdate(Date.now());
        }
      } catch (error) {
        logger.error(LogCategory.YOUTUBE, 'Error fetching analytics', { error });
      }
    };

    startAnalyticsPolling();

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      logger.info(LogCategory.YOUTUBE, 'Analytics polling stopped');
    };
  }, [broadcastId, dispatch]);

  return {
    isLoading,
    error,
    lastUpdate,
    isPolling: !!pollingInterval
  };
};