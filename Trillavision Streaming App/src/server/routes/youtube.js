import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const youtube = google.youtube('v3');

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Analytics endpoints
router.get('/broadcasts/:id/analytics', async (req, res) => {
  const { id } = req.params;
  const { tokens } = req.query;
  
  try {
    oauth2Client.setCredentials(JSON.parse(tokens));
    
    // Get broadcast statistics
    const broadcastResponse = await youtube.liveBroadcasts.list({
      auth: oauth2Client,
      id,
      part: 'statistics'
    });

    // Get analytics data
    const analyticsResponse = await youtube.reports.query({
      auth: oauth2Client,
      ids: `channel==MINE`,
      metrics: 'viewerPercentage,averageViewDuration',
      dimensions: 'deviceType,country',
      filters: `broadcastId==${id}`
    });

    if (broadcastResponse.data.items.length === 0) {
      return res.status(404).json({ success: false, error: 'Broadcast not found' });
    }

    const statistics = broadcastResponse.data.items[0].statistics;
    const analytics = analyticsResponse.data;

    // Process and format analytics data
    const analyticsData = {
      concurrentViewers: parseInt(statistics.concurrentViewers || '0'),
      peakConcurrentViewers: parseInt(statistics.peakConcurrentViewers || '0'),
      averageConcurrentViewers: Math.round(parseInt(statistics.totalViewers || '0') / 2),
      chatMessageCount: parseInt(statistics.chatMessageCount || '0'),
      engagementRate: calculateEngagementRate(statistics),
      viewerRetention: calculateViewerRetention(analytics),
      deviceBreakdown: processDeviceData(analytics),
      geographicData: processGeographicData(analytics)
    };

    res.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error getting broadcast analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper functions for analytics processing
function calculateEngagementRate(statistics) {
  const viewers = parseInt(statistics.concurrentViewers || '0');
  const chatMessages = parseInt(statistics.chatMessageCount || '0');
  const likes = parseInt(statistics.likeCount || '0');
  
  if (viewers === 0) return 0;
  return Math.min(((chatMessages + likes) / viewers) * 100, 100);
}

function calculateViewerRetention(analytics) {
  const viewDuration = analytics.rows?.reduce((acc, row) => acc + parseFloat(row[1]), 0) || 0;
  return Math.min((viewDuration / 3600) * 100, 100);
}

function processDeviceData(analytics) {
  const devices = {
    desktop: 0,
    mobile: 0,
    tablet: 0,
    other: 0
  };

  analytics.rows?.forEach(row => {
    const [device, percentage] = row;
    switch (device.toLowerCase()) {
      case 'desktop':
        devices.desktop = parseFloat(percentage);
        break;
      case 'mobile':
        devices.mobile = parseFloat(percentage);
        break;
      case 'tablet':
        devices.tablet = parseFloat(percentage);
        break;
      default:
        devices.other += parseFloat(percentage);
    }
  });

  return devices;
}

function processGeographicData(analytics) {
  return (analytics.rows || [])
    .map(([country, percentage]) => ({
      country,
      percentage: parseFloat(percentage)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);
}

export default router;