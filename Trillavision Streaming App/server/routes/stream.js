import express from 'express';

const router = express.Router();

// In-memory storage for stream data
// In a production app, you would use a database
const streams = {};

/**
 * Create a new stream configuration
 */
router.post('/', (req, res) => {
  const { name, platform, quality, isPrivate, description } = req.body;
  
  const streamId = `stream-${Date.now()}`;
  
  streams[streamId] = {
    id: streamId,
    name,
    platform,
    quality,
    isPrivate,
    description,
    createdAt: new Date().toISOString(),
    status: 'created',
    viewerCount: 0,
    duration: 0,
    scenes: []
  };
  
  res.status(201).json({
    success: true,
    stream: streams[streamId]
  });
});

/**
 * Get all streams
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    streams: Object.values(streams)
  });
});

/**
 * Get a specific stream
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  if (!streams[id]) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found'
    });
  }
  
  res.json({
    success: true,
    stream: streams[id]
  });
});

/**
 * Update a stream
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  if (!streams[id]) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found'
    });
  }
  
  // Update stream properties
  streams[id] = {
    ...streams[id],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    stream: streams[id]
  });
});

/**
 * Delete a stream
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  if (!streams[id]) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found'
    });
  }
  
  delete streams[id];
  
  res.json({
    success: true,
    message: 'Stream deleted successfully'
  });
});

/**
 * Add a scene to a stream
 */
router.post('/:id/scenes', (req, res) => {
  const { id } = req.params;
  const { name, layout, sources } = req.body;
  
  if (!streams[id]) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found'
    });
  }
  
  const sceneId = `scene-${Date.now()}`;
  
  const newScene = {
    id: sceneId,
    name,
    layout,
    sources: sources || [],
    createdAt: new Date().toISOString()
  };
  
  streams[id].scenes.push(newScene);
  
  res.status(201).json({
    success: true,
    scene: newScene
  });
});

/**
 * Update stream status
 */
router.post('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, viewerCount, duration } = req.body;
  
  if (!streams[id]) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found'
    });
  }
  
  streams[id].status = status || streams[id].status;
  
  if (viewerCount !== undefined) {
    streams[id].viewerCount = viewerCount;
  }
  
  if (duration !== undefined) {
    streams[id].duration = duration;
  }
  
  res.json({
    success: true,
    stream: streams[id]
  });
});

export default router;