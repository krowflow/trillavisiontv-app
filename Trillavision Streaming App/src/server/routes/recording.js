import express from 'express';
import { recordingManager } from '../../services/recording';
import { logger } from '../../utils/logging';

const router = express.Router();

// Start recording
router.post('/start', async (req, res) => {
  try {
    const config = req.body;
    const recording = await recordingManager.startRecording(config);
    res.json({ success: true, recording });
  } catch (error) {
    logger.error('Failed to start recording:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stop recording
router.post('/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    const recording = await recordingManager.stopRecording(id);
    res.json({ success: true, recording });
  } catch (error) {
    logger.error('Failed to stop recording:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Split recording
router.post('/:id/split', async (req, res) => {
  try {
    const { id } = req.params;
    const recording = await recordingManager.splitRecording(id);
    res.json({ success: true, recording });
  } catch (error) {
    logger.error('Failed to split recording:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recording info
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recording = await recordingManager.getRecordingInfo(id);
    if (!recording) {
      return res.status(404).json({ success: false, error: 'Recording not found' });
    }
    res.json({ success: true, recording });
  } catch (error) {
    logger.error('Failed to get recording info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// List all recordings
router.get('/', async (req, res) => {
  try {
    const recordings = await recordingManager.listRecordings();
    res.json({ success: true, recordings });
  } catch (error) {
    logger.error('Failed to list recordings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clean up old recordings
router.post('/cleanup', async (req, res) => {
  try {
    const { maxAge } = req.body;
    await recordingManager.cleanupOldRecordings(maxAge);
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to clean up recordings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;