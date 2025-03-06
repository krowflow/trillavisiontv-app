import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { StreamStatus } from '../../types';
import { startStream, stopStream, setStreamStatus, updateViewerCount } from '../../store/slices/streamSlice';
import { useYouTubeAPI } from '../../hooks/useYouTubeAPI';
import { ffmpegApi } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { StreamEvents } from '../../hooks/useSocket';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Play, Square, AlertCircle, ExternalLink, ArrowRightToLine, Users, Mic, Volume2, Youtube } from 'lucide-react';
import { usePodcastingMode } from '../../hooks/usePodcastingMode';
import { logger, LogCategory } from '../../utils/logging';
import { useNavigate } from 'react-router-dom';

/**
 * Stream controls component for starting/stopping streams
 */
export const StreamControls: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, isConnectedToYouTube, settings, error } = useSelector((state: RootState) => state.stream);
  const [isLoading, setIsLoading] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [broadcastId, setBroadcastId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const { createBroadcast, startBroadcast, endBroadcast, getBroadcastStatus } = useYouTubeAPI();
  const { emit, on } = useSocket();
  
  // Use the podcasting mode hook
  const { isPodcastingMode } = usePodcastingMode();
  
  // Set up status polling
  useEffect(() => {
    let statusInterval: NodeJS.Timeout | null = null;
    
    if (status === StreamStatus.LIVE && broadcastId) {
      // Poll for broadcast status and viewer count
      statusInterval = setInterval(async () => {
        try {
          const statusData = await getBroadcastStatus(broadcastId);
          
          if (statusData && statusData.statistics) {
            dispatch(updateViewerCount(parseInt(statusData.statistics.concurrentViewers || '0')));
          }
        } catch (error) {
          console.error('Error polling broadcast status:', error);
        }
       }, 10000); // Poll every 10 seconds
    }
    
    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
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
  
  return (
    <div className="flex flex-col h-full max-h-[200px] overflow-hidden">
      <h2 className="text-base font-semibold mb-2">Stream Controls</h2>
      
      {error && (
        <div className="mb-1.5 p-1 bg-red-50 text-red-700 rounded flex items-center text-[11px]">
          <AlertCircle size={16} className="mr-1 flex-shrink-0" />
          <span className="line-clamp-2">{error}</span>
        </div>
      )}
      
      <div className="flex flex-col space-y-1.5 flex-1">
        {!isConnectedToYouTube && (
          <div className="p-1 bg-yellow-50 text-yellow-700 rounded flex items-center text-[11px]">
            <AlertCircle size={16} className="mr-1 flex-shrink-0" />
            <span>You need to connect to YouTube before streaming.</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => navigate('/youtube-integration')}
              style={{ height: '20px', fontSize: '11px', padding: '0 8px' }}
            >
              Connect
            </Button>
          </div>
        )}
        
        {status === StreamStatus.OFFLINE ? (
          <Button
            variant="primary"
            leftIcon={<Play size={16} />}
            onClick={handleStartStream}
            isLoading={isLoading}
            disabled={!isConnectedToYouTube || isLoading}
            fullWidth
            className="h-7 text-sm"
          >
            Go Live
          </Button>
        ) : (
          <Button
            variant="danger"
            leftIcon={<Square size={16} />}
            onClick={handleStopStream}
            isLoading={isLoading}
            disabled={isLoading}
            fullWidth
            className="h-7 text-sm"
          >
            End Stream
          </Button>
        )}
        
        {streamUrl && (
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-primary hover:text-primary-light text-[11px] h-5"
          >
            <ExternalLink size={14} className="mr-1" />
            <span>View on YouTube</span>
          </a>
        )}
        
        {/* Podcasting mode indicator */}
        {isPodcastingMode && (
          <div className="p-1 bg-blue-50 rounded text-[11px]">
            <div className="flex items-center text-blue-700">
              <Users size={14} className="mr-1 flex-shrink-0" />
              <span className="font-medium">Podcasting Mode Active</span>
            </div>
            <p className="text-[11px] text-blue-600 mt-0.5 line-clamp-1">
              Dual microphone setup enabled for host and guest.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};