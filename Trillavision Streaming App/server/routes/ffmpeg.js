import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure temp directory exists
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * Get available input devices
 */
router.get('/devices', (req, res) => {
  // This is a mock implementation since ffmpeg.getAvailableFormats requires
  // a callback that doesn't work well with Express routes
  // In a real implementation, you would use node-ffi or a native module
  
  const mockDevices = {
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
  
  res.json(mockDevices);
});

/**
 * Start streaming to RTMP server
 */
router.post('/stream', (req, res) => {
  const {
    inputSource,
    rtmpUrl,
    streamKey,
    videoSettings,
    audioSettings
  } = req.body;
  
  // Full RTMP URL with stream key
  const fullRtmpUrl = `${rtmpUrl}/${streamKey}`;
  
  try {
    // Create a unique ID for this stream process
    const streamId = Date.now().toString();
    
    // Configure FFmpeg command based on audio settings
    let command = ffmpeg();
    
    // Add video input
    command.input(inputSource)
      .inputFormat('dshow'); // DirectShow for Windows, use 'avfoundation' for macOS
    
    // Handle multiple audio inputs for podcasting mode
    if (audioSettings?.mixMultipleInputs) {
      // In a real implementation, we would add multiple audio inputs
      // and configure the audio mixer
      
      // Example of how to add multiple audio inputs in FFmpeg:
      // command.input('audio=Microphone 1')
      //   .input('audio=Microphone 2')
      //   .complexFilter([
      //     // Mix both audio inputs with different volumes
      //     `[1:a]volume=${audioSettings.primaryMicrophoneGain || 1}[a1]`,
      //     `[2:a]volume=${audioSettings.secondaryMicrophoneGain || 1}[a2]`,
      //     '[a1][a2]amix=inputs=2:duration=longest[aout]'
      //   ], 'aout');
      
      console.log('Configuring dual microphone setup for podcasting');
      
      // For this mock implementation, we'll just log that we're using multiple inputs
      command.outputOptions([
        '-c:v libx264',
        `-b:v ${videoSettings?.bitrate || '2500k'}`,
        `-maxrate ${videoSettings?.maxBitrate || '2500k'}`,
        `-bufsize ${videoSettings?.bufferSize || '5000k'}`,
        `-r ${videoSettings?.fps || 30}`,
        `-s ${videoSettings?.resolution || '1280x720'}`,
        '-preset veryfast',
        '-c:a aac',
        `-b:a ${audioSettings?.bitrate || '128k'}`,
        '-ar 44100',
        '-f flv'
      ]);
    } else {
      // Standard single audio input configuration
      command.outputOptions([
        '-c:v libx264',
        `-b:v ${videoSettings?.bitrate || '2500k'}`,
        `-maxrate ${videoSettings?.maxBitrate || '2500k'}`,
        `-bufsize ${videoSettings?.bufferSize || '5000k'}`,
        `-r ${videoSettings?.fps || 30}`,
        `-s ${videoSettings?.resolution || '1280x720'}`,
        '-preset veryfast',
        '-c:a aac',
        `-b:a ${audioSettings?.bitrate || '128k'}`,
        '-ar 44100',
        '-f flv'
      ]);
    }
    
    // Set output
    command.output(fullRtmpUrl);
    
    // Start the stream
    command.run();
    
    // Store the command reference for later termination
    global.activeStreams = global.activeStreams || {};
    global.activeStreams[streamId] = command;
    
    // Store audio settings for later updates
    global.streamAudioSettings = global.streamAudioSettings || {};
    global.streamAudioSettings[streamId] = {
      mixMultipleInputs: audioSettings?.mixMultipleInputs || false,
      primaryMicrophoneId: audioSettings?.primaryMicrophoneId,
      secondaryMicrophoneId: audioSettings?.secondaryMicrophoneId,
      primaryMicrophoneGain: audioSettings?.primaryMicrophoneGain || 1.0,
      secondaryMicrophoneGain: audioSettings?.secondaryMicrophoneGain || 1.0,
      primaryMicrophoneMuted: false,
      secondaryMicrophoneMuted: false
    };
    
    res.json({
      success: true,
      streamId,
      message: 'Stream started successfully',
      audioSettings: global.streamAudioSettings[streamId]
    });
  } catch (error) {
    console.error('Error starting stream:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Stop an active stream
 */
router.post('/stream/:streamId/stop', (req, res) => {
  const { streamId } = req.params;
  
  try {
    // Check if the stream exists
    if (!global.activeStreams || !global.activeStreams[streamId]) {
      return res.status(404).json({
        success: false,
        error: 'Stream not found'
      });
    }
    
    // Kill the FFmpeg process
    global.activeStreams[streamId].kill('SIGKILL');
    
    // Remove from active streams
    delete global.activeStreams[streamId];
    
    // Clean up audio settings
    if (global.streamAudioSettings && global.streamAudioSettings[streamId]) {
      delete global.streamAudioSettings[streamId];
    }
    
    res.json({
      success: true,
      message: 'Stream stopped successfully'
    });
  } catch (error) {
    console.error('Error stopping stream:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get stream information
 */
router.get('/stream/:streamId/info', (req, res) => {
  const { streamId } = req.params;
  
  try {
    // Check if the stream exists
    if (!global.activeStreams || !global.activeStreams[streamId]) {
      return res.status(404).json({
        success: false,
        error: 'Stream not found'
      });
    }
    
    // Get audio settings if available
    const audioSettings = global.streamAudioSettings && global.streamAudioSettings[streamId] 
      ? global.streamAudioSettings[streamId] 
      : null;
    
    // In a real implementation, you would get actual stream information
    // This is a mock response
    res.json({
      success: true,
      streamId,
      status: 'active',
      duration: Math.floor((Date.now() - parseInt(streamId)) / 1000),
      bitrate: '2500k',
      fps: 30,
      resolution: '1280x720',
      audioSettings
    });
  } catch (error) {
    console.error('Error getting stream info:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Update stream audio settings
 */
router.post('/stream/:streamId/audio', (req, res) => {
  const { streamId } = req.params;
  const {
    primaryMicrophoneGain,
    secondaryMicrophoneGain,
    primaryMicrophoneMuted,
    secondaryMicrophoneMuted
  } = req.body;
  
  try {
    // Check if the stream exists
    if (!global.activeStreams || !global.activeStreams[streamId]) {
      return res.status(404).json({
        success: false,
        error: 'Stream not found'
      });
    }
    
    // Check if audio settings exist for this stream
    if (!global.streamAudioSettings || !global.streamAudioSettings[streamId]) {
      return res.status(404).json({
        success: false,
        error: 'Audio settings not found for this stream'
      });
    }
    
    // Update audio settings
    const settings = global.streamAudioSettings[streamId];
    
    if (primaryMicrophoneGain !== undefined) {
      settings.primaryMicrophoneGain = primaryMicrophoneGain;
    }
    
    if (secondaryMicrophoneGain !== undefined) {
      settings.secondaryMicrophoneGain = secondaryMicrophoneGain;
    }
    
    if (primaryMicrophoneMuted !== undefined) {
      settings.primaryMicrophoneMuted = primaryMicrophoneMuted;
    }
    
    if (secondaryMicrophoneMuted !== undefined) {
      settings.secondaryMicrophoneMuted = secondaryMicrophoneMuted;
    }
    
    // In a real implementation, we would dynamically update the FFmpeg command
    // to adjust audio levels or mute/unmute inputs
    // This would typically involve using FFmpeg's filter_complex to adjust volumes
    
    res.json({
      success: true,
      message: 'Audio settings updated successfully',
      audioSettings: settings
    });
  } catch (error) {
    console.error('Error updating audio settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;