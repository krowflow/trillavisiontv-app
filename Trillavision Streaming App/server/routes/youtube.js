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

/**
 * Generate OAuth URL for YouTube authorization
 */
router.get('/auth-url', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ];
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });
  
  res.json({ authUrl });
});

/**
 * Handle OAuth callback and exchange code for tokens
 */
router.post('/auth-callback', async (req, res) => {
  const { code } = req.body;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    res.json({ success: true, tokens });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create a new broadcast
 */
router.post('/broadcasts', async (req, res) => {
  const { title, description, scheduledStartTime, privacyStatus, tokens } = req.body;
  
  try {
    // Set credentials from tokens
    oauth2Client.setCredentials(tokens);
    
    // Create broadcast
    const broadcast = await youtube.liveBroadcasts.insert({
      auth: oauth2Client,
      part: 'id,snippet,contentDetails,status',
      resource: {
        snippet: {
          title,
          description,
          scheduledStartTime: scheduledStartTime || new Date().toISOString()
        },
        contentDetails: {
          enableAutoStart: false,
          enableAutoStop: false
        },
        status: {
          privacyStatus: privacyStatus || 'private'
        }
      }
    });
    
    // Create stream
    const stream = await youtube.liveStreams.insert({
      auth: oauth2Client,
      part: 'id,snippet,cdn,contentDetails',
      resource: {
        snippet: {
          title: `${title} - Stream`
        },
        cdn: {
          frameRate: 'variable',
          ingestionType: 'rtmp',
          resolution: 'variable'
        },
        contentDetails: {
          isReusable: true
        }
      }
    });
    
    // Bind broadcast to stream
    await youtube.liveBroadcasts.bind({
      auth: oauth2Client,
      id: broadcast.data.id,
      part: 'id,snippet',
      streamId: stream.data.id
    });
    
    res.json({
      success: true,
      broadcast: broadcast.data,
      stream: stream.data
    });
  } catch (error) {
    console.error('Error creating broadcast:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get broadcast status
 */
router.get('/broadcasts/:id/status', async (req, res) => {
  const { id } = req.params;
  const { tokens } = req.query;
  
  try {
    // Set credentials from tokens
    oauth2Client.setCredentials(JSON.parse(tokens));
    
    const response = await youtube.liveBroadcasts.list({
      auth: oauth2Client,
      id,
      part: 'id,status,statistics'
    });
    
    if (response.data.items.length === 0) {
      return res.status(404).json({ success: false, error: 'Broadcast not found' });
    }
    
    res.json({
      success: true,
      status: response.data.items[0].status,
      statistics: response.data.items[0].statistics
    });
  } catch (error) {
    console.error('Error getting broadcast status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Start a broadcast
 */
router.post('/broadcasts/:id/start', async (req, res) => {
  const { id } = req.params;
  const { tokens } = req.body;
  
  try {
    // Set credentials from tokens
    oauth2Client.setCredentials(tokens);
    
    const response = await youtube.liveBroadcasts.transition({
      auth: oauth2Client,
      id,
      broadcastStatus: 'live',
      part: 'id,status'
    });
    
    res.json({
      success: true,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error starting broadcast:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * End a broadcast
 */
router.post('/broadcasts/:id/end', async (req, res) => {
  const { id } = req.params;
  const { tokens } = req.body;
  
  try {
    // Set credentials from tokens
    oauth2Client.setCredentials(tokens);
    
    const response = await youtube.liveBroadcasts.transition({
      auth: oauth2Client,
      id,
      broadcastStatus: 'complete',
      part: 'id,status'
    });
    
    res.json({
      success: true,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error ending broadcast:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;