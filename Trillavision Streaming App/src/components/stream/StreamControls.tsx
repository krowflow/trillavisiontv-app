import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { StreamStatus, StreamPlatform, StreamQuality } from '../../types';
import { startStream, stopStream, setStreamStatus, updateViewerCount, updateStreamSettings } from '../../store/slices/streamSlice';
import { useYouTubeAPI } from '../../hooks/useYouTubeAPI';
import { ffmpegApi } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { StreamEvents } from '../../hooks/useSocket';
import { usePodcastingMode } from '../../hooks/usePodcastingMode';
import { logger, LogCategory } from '../../utils/logging';
import { 
  Play, 
  Square, 
  AlertCircle, 
  ExternalLink, 
  Users, 
  Mic, 
  Volume2, 
  Youtube,
  CheckCircle,
  Clock,
  BarChart2,
  Settings
} from 'lucide-react';
import { CompactSelect } from '../ui/CompactSelect';
import { StatusIndicator } from '../ui/StatusIndicator';
import { CompactToggle } from '../ui/CompactToggle';

/**
 * Enhanced Stream controls component for starting/stopping streams
 * with improved layout and space utilization
 */
export const StreamControls: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, isConnectedToYouTube, settings, error, viewerCount } = useSelector((state: RootState) => state.stream);
  const [isLoading, setIsLoading] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [broadcastId, setBroadcastId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamDuration, setStreamDuration] = useState<string>("00:00:00");
  const [streamHealth, setStreamHealth] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [droppedFrames, setDroppedFrames] = useState<string>("0.0%");
  const [bitrate, setBitrate] = useState<string>("0 Mbps");
  const { createBroadcast, startBroadcast, endBroadcast, getBroadcastStatus } = useYouTubeAPI();
  const { emit, on } = useSocket();
  
  // Use the podcasting mode hook
  const { isPodcastingMode } = usePodcastingMode();
  
  // Set up status polling and duration timer
  useEffect(() => {
    let statusInterval: NodeJS.Timeout | null = null;
    let durationInterval: NodeJS.Timeout | null = null;
    let startTime: number | null = null;
    
    if (status === StreamStatus.LIVE && broadcastId) {
      // Set start time for duration calculation
      if (!startTime) {
        startTime = Date.now();
      }
      
      // Update duration every second
      durationInterval = setInterval(() => {
        if (startTime) {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          const hours = Math.floor(duration / 3600).toString().padStart(2, '0');
          const minutes = Math.floor((duration % 3600) / 60).toString().padStart(2, '0');
          const seconds = (duration % 60).toString().padStart(2, '0');
          setStreamDuration(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);
      
      // Poll for broadcast status and viewer count
      statusInterval = setInterval(async () => {
        try {
          const statusData = await getBroadcastStatus(broadcastId);
          
          if (statusData && statusData.statistics) {
            dispatch(updateViewerCount(parseInt(statusData.statistics.concurrentViewers || '0')));
          }
          
          // Simulate stream health metrics (would be real data in production)
          const randomHealth = Math.random();
          if (randomHealth > 0.8) {
            setStreamHealth('excellent');
          } else if (randomHealth > 0.4) {
            setStreamHealth('good');
          } else {
            setStreamHealth('poor');
          }
          
          setDroppedFrames(`${(Math.random() * 0.5).toFixed(1)}%`);
          setBitrate(`${(2 + Math.random() * 0.8).toFixed(1)} Mbps`);
          
        } catch (error) {
          console.error('Error polling broadcast status:', error);
        }
      }, 10000); // Poll every 10 seconds
    } else {
      // Reset duration when not streaming
      setStreamDuration("00:00:00");
      startTime = null;
    }
    
    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
      if (durationInterval) {
        clearInterval(durationInterval);
      }
    };
  }, [status, broadcastId, getBroadcastStatus, dispatch]);
  
  // Listen for socket events
  useEffect(() => {
    const unsubscribe = on(StreamEvents.STATUS_UPDATE, (data) => {
      if (data.status) {
        dispatch(setStreamStatus(data.status));
      }
    });
    
    return unsubscribe;
  }, [on, dispatch]);
  
  const handleStartStream = async () => {
    if (!isConnectedToYouTube) {
      navigate('/youtube-integration');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create YouTube broadcast
      const broadcast = await createBroadcast(
        settings.title,
        settings.description || '',
        settings.isPrivate
      );
      
      if (!broadcast) {
        throw new Error('Failed to create broadcast');
      }
      
      setBroadcastId(broadcast.id);
      setStreamUrl(broadcast.monitorStream);
      
      // Start FFmpeg stream with appropriate audio configuration
      const streamResponse = await ffmpegApi.startStream({
        inputSource: 'video=Integrated Camera', // This would be dynamic in a real app
        rtmpUrl: broadcast.ingestionUrl,
        streamKey: broadcast.streamKey,
        videoSettings: {
          bitrate: '2500k',
          fps: 30,
          resolution: '1280x720'
        },
        audioSettings: {
          bitrate: '128k',
          // In podcasting mode, we'd configure FFmpeg to mix multiple audio inputs
          mixMultipleInputs: isPodcastingMode
        }
      });
      
      if (!streamResponse.success) {
        throw new Error('Failed to start FFmpeg stream');
      }
      
      setStreamId(streamResponse.streamId);
      
      // Start YouTube broadcast
      const startResponse = await startBroadcast(broadcast.id);
      
      if (!startResponse) {
        throw new Error('Failed to start broadcast');
      }
      
      // Update stream status
      dispatch(startStream());
      
      // Notify other clients
      emit(StreamEvents.STATUS_UPDATE, { status: StreamStatus.LIVE });
      
      logger.info(LogCategory.STREAM, 'Stream started successfully', {
        broadcastId: broadcast.id,
        streamId: streamResponse.streamId
      });
      
    } catch (error) {
      console.error('Error starting stream:', error);
      dispatch(setStreamStatus(StreamStatus.ERROR));
      logger.error(LogCategory.STREAM, 'Failed to start stream', { error });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStopStream = async () => {
    setIsLoading(true);
    
    try {
      // Stop FFmpeg stream
      if (streamId) {
        await ffmpegApi.stopStream(streamId);
      }
      
      // End YouTube broadcast
      if (broadcastId) {
        await endBroadcast(broadcastId);
      }
      
      // Update stream status
      dispatch(stopStream());
      
      // Reset state
      setStreamId(null);
      setBroadcastId(null);
      setStreamUrl(null);
      
      // Notify other clients
      emit(StreamEvents.STATUS_UPDATE, { status: StreamStatus.OFFLINE });
      
      logger.info(LogCategory.STREAM, 'Stream stopped successfully', {
        broadcastId,
        streamId
      });
      
    } catch (error) {
      console.error('Error stopping stream:', error);
      logger.error(LogCategory.STREAM, 'Failed to stop stream', { error });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the appropriate content based on the current state
  const renderContent = () => {
    // Not connected state
    if (!isConnectedToYouTube) {
      return (
        <>
          {/* Connection warning */}
          <div className="flex items-center p-1.5 bg-yellow-50 rounded-md mb-2">
            <div className="text-yellow-500 mr-1.5">
              <AlertCircle size={14} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-yellow-700">You need to connect to YouTube before streaming.</p>
            </div>
            <button 
              className="ml-1.5 px-2 py-0.5 text-[10px] bg-white border border-yellow-300 rounded-md text-yellow-700 hover:bg-yellow-50"
              onClick={() => navigate('/youtube-integration')}
            >
              Connect
            </button>
          </div>

          {/* Go Live button (disabled) */}
          <button className="w-full h-8 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md mb-2 cursor-not-allowed">
            <Play size={14} className="mr-1.5" />
            <span className="text-[12px] font-medium">Go Live</span>
          </button>

          {/* Quick settings */}
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 mb-0.5">Platform</label>
              <CompactSelect
                options={[
                  { value: StreamPlatform.YOUTUBE, label: 'YouTube' }
                ]}
                value={StreamPlatform.YOUTUBE}
                onChange={() => {}}
                inputSize="xs"
                disabled
                ariaLabel="Platform selection"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 mb-0.5">Quality</label>
              <CompactSelect
                options={[
                  { value: StreamQuality.MEDIUM, label: '1080p' }
                ]}
                value={StreamQuality.MEDIUM}
                onChange={() => {}}
                inputSize="xs"
                disabled
                ariaLabel="Quality selection"
              />
            </div>
          </div>

          {/* Stream info */}
          <div className="p-1.5 bg-gray-50 rounded-md">
            <p className="text-[10px] text-gray-500 mb-1">Connect to YouTube to configure your stream</p>
            <div className="flex items-center">
              <button 
                className="px-2 py-0.5 text-[10px] bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/stream-settings')}
                disabled
              >
                Stream Settings
              </button>
            </div>
          </div>
        </>
      );
    }
    
    // Connected but not live state
    if (status === StreamStatus.OFFLINE) {
      return (
        <>
          {/* Platform connection status */}
          <div className="flex items-center p-1.5 bg-green-50 rounded-md mb-2">
            <div className="text-green-500 mr-1.5">
              <CheckCircle size={14} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-green-700">Connected to YouTube</p>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></div>
              <span className="text-[10px] text-green-700">Ready</span>
            </div>
          </div>

          {/* Go Live button (enabled) */}
          <button 
            className="w-full h-8 flex items-center justify-center bg-red-500 text-white rounded-md mb-2 hover:bg-red-600"
            onClick={handleStartStream}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1.5"></div>
            ) : (
              <Play size={14} className="mr-1.5" />
            )}
            <span className="text-[12px] font-medium">Go Live</span>
          </button>

          {/* Stream settings */}
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 mb-0.5">Platform</label>
              <CompactSelect
                options={[
                  { value: StreamPlatform.YOUTUBE, label: 'YouTube' },
                  { value: StreamPlatform.TWITCH, label: 'Twitch' },
                  { value: StreamPlatform.FACEBOOK, label: 'Facebook' }
                ]}
                value={settings.platform}
                onChange={(value) => dispatch(updateStreamSettings({ platform: value as StreamPlatform }))}
                inputSize="xs"
                ariaLabel="Platform selection"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 mb-0.5">Quality</label>
              <CompactSelect
                options={[
                  { value: StreamQuality.MEDIUM, label: '1080p' },
                  { value: StreamQuality.LOW, label: '720p' },
                  { value: StreamQuality.HIGH, label: '1080p60' }
                ]}
                value={settings.quality}
                onChange={(value) => dispatch(updateStreamSettings({ quality: value as StreamQuality }))}
                inputSize="xs"
                ariaLabel="Quality selection"
              />
            </div>
          </div>

          {/* Stream info */}
          <div className="p-1.5 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500">Title:</span>
              <span className="text-[10px] text-gray-700 truncate max-w-[180px]">{settings.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Visibility:</span>
              <span className="text-[10px] text-gray-700">{settings.isPrivate ? 'Private' : 'Public'}</span>
            </div>
            <div className="mt-1 pt-1 border-t border-gray-200">
              <button 
                className="px-2 py-0.5 text-[10px] bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/stream-settings')}
              >
                <Settings size={10} className="inline mr-1" />
                Edit Stream Settings
              </button>
            </div>
          </div>
        </>
      );
    }
    
    // Live streaming state
    if (status === StreamStatus.LIVE) {
      return (
        <>
          {/* Live status */}
          <div className="flex items-center p-1.5 bg-red-50 rounded-md mb-2">
            <div className="text-red-500 mr-1.5">
              <Youtube size={14} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-red-700">Live on YouTube</p>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1 animate-pulse"></div>
              <span className="text-[10px] text-red-700">LIVE</span>
            </div>
          </div>

          {/* End Stream button */}
          <button 
            className="w-full h-8 flex items-center justify-center bg-red-500 text-white rounded-md mb-2 hover:bg-red-600"
            onClick={handleStopStream}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1.5"></div>
            ) : (
              <Square size={14} className="mr-1.5" />
            )}
            <span className="text-[12px] font-medium">End Stream</span>
          </button>

          {/* Stream stats */}
          <div className="grid grid-cols-3 gap-1 mb-2">
            <div className="p-1 bg-gray-50 rounded-md text-center">
              <div className="text-[9px] text-gray-500">Viewers</div>
              <div className="text-[12px] font-medium">{viewerCount}</div>
            </div>
            <div className="p-1 bg-gray-50 rounded-md text-center">
              <div className="text-[9px] text-gray-500">Duration</div>
              <div className="text-[12px] font-medium">{streamDuration}</div>
            </div>
            <div className="p-1 bg-gray-50 rounded-md text-center">
              <div className="text-[9px] text-gray-500">Bitrate</div>
              <div className="text-[12px] font-medium">{bitrate}</div>
            </div>
          </div>

          {/* Stream health */}
          <div className="p-1.5 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500">Stream Health:</span>
              <StatusIndicator 
                status={streamHealth === 'excellent' ? 'success' : streamHealth === 'good' ? 'info' : 'warning'}
                text={streamHealth}
                size="xs"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Dropped Frames:</span>
              <span className="text-[10px] text-gray-700">{droppedFrames}</span>
            </div>
            <div className="mt-1 pt-1 border-t border-gray-200 flex justify-between">
              {streamUrl && (
                <a
                  href={streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 text-[10px] bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <ExternalLink size={10} className="inline mr-1" />
                  View on YouTube
                </a>
              )}
              <button 
                className="px-2 py-0.5 text-[10px] bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/stream-settings')}
              >
                <Settings size={10} className="inline mr-1" />
                Stream Settings
              </button>
            </div>
          </div>
        </>
      );
    }
    
    // Connecting or error state
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {status === StreamStatus.CONNECTING ? (
          <>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
            <p className="text-sm text-gray-700">Connecting to stream...</p>
          </>
        ) : (
          <>
            <AlertCircle size={24} className="text-red-500 mb-2" />
            <p className="text-sm text-red-700">Stream error</p>
            <p className="text-xs text-gray-500 mt-1">{error || 'Unknown error occurred'}</p>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full max-h-[200px] overflow-hidden">
      <h2 className="text-base font-semibold mb-1.5">Stream Controls</h2>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderContent()}
        
        {/* Podcasting mode indicator - shown in any state */}
        {isPodcastingMode && (
          <div className="p-1.5 bg-blue-50 rounded-md mt-2">
            <div className="flex items-center">
              <div className="text-blue-500 mr-1.5">
                <Mic size={14} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-blue-700 font-medium">Podcasting Mode Active</p>
                <p className="text-[9px] text-blue-600">Dual microphone setup enabled</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamControls;