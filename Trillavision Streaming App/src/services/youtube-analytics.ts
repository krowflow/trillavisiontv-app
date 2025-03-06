import { youtubeApi } from './api';
import { logger, LogCategory } from '../utils/logging';

export interface AnalyticsData {
  viewerCount: number;
  peakViewers: number;
  averageViewers: number;
  chatMessages: number;
  engagementRate: number;
  viewerRetention: number;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
    other: number;
  };
  geographicData: {
    country: string;
    percentage: number;
  }[];
}

export class YouTubeAnalytics {
  private static instance: YouTubeAnalytics;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastUpdate: number = 0;
  private updateInterval: number = 10000; // 10 seconds
  private callback: ((data: AnalyticsData) => void) | null = null;

  private constructor() {}

  static getInstance(): YouTubeAnalytics {
    if (!YouTubeAnalytics.instance) {
      YouTubeAnalytics.instance = new YouTubeAnalytics();
    }
    return YouTubeAnalytics.instance;
  }

  async startPolling(broadcastId: string, callback: (data: AnalyticsData) => void): Promise<void> {
    if (this.pollingInterval) {
      this.stopPolling();
    }

    this.callback = callback;

    try {
      // Initial fetch
      await this.fetchAnalytics(broadcastId);

      // Start polling
      this.pollingInterval = setInterval(async () => {
        await this.fetchAnalytics(broadcastId);
      }, this.updateInterval);

      logger.info(LogCategory.YOUTUBE, 'Analytics polling started', { broadcastId });
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error starting analytics polling', { error });
      throw error;
    }
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      this.callback = null;
      logger.info(LogCategory.YOUTUBE, 'Analytics polling stopped');
    }
  }

  private async fetchAnalytics(broadcastId: string): Promise<AnalyticsData | null> {
    try {
      const tokens = localStorage.getItem('youtube_tokens');
      if (!tokens) {
        throw new Error('No YouTube tokens found');
      }

      const response = await youtubeApi.getBroadcastAnalytics(broadcastId, JSON.parse(tokens));
      
      if (!response.success) {
        throw new Error('Failed to fetch analytics');
      }

      const data: AnalyticsData = {
        viewerCount: response.data.concurrentViewers || 0,
        peakViewers: response.data.peakConcurrentViewers || 0,
        averageViewers: response.data.averageConcurrentViewers || 0,
        chatMessages: response.data.chatMessageCount || 0,
        engagementRate: response.data.engagementRate || 0,
        viewerRetention: response.data.viewerRetention || 0,
        deviceBreakdown: response.data.deviceBreakdown || {
          desktop: 0,
          mobile: 0,
          tablet: 0,
          other: 0
        },
        geographicData: response.data.geographicData || []
      };

      this.lastUpdate = Date.now();
      
      if (this.callback) {
        this.callback(data);
      }

      return data;
    } catch (error) {
      logger.error(LogCategory.YOUTUBE, 'Error fetching analytics', { error });
      return null;
    }
  }

  getLastUpdateTime(): number {
    return this.lastUpdate;
  }

  isPolling(): boolean {
    return this.pollingInterval !== null;
  }
}

export const youtubeAnalytics = YouTubeAnalytics.getInstance();