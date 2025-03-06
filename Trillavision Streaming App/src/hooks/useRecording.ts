import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { recordingManager, RecordingConfig, RecordingInfo } from '../services/recording';
import { logger, LogCategory } from '../utils/logging';

export const useRecording = () => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<RecordingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  const startRecording = useCallback(async (config?: Partial<RecordingConfig>) => {
    try {
      setError(null);
      const recording = await recordingManager.startRecording(config);
      setCurrentRecording(recording);
      setIsRecording(true);
      
      // Set up interval to update recording duration and size
      const interval = setInterval(() => {
        if (recording) {
          setCurrentRecording(prev => {
            if (!prev) return prev;
            
            const duration = Date.now() - prev.startTime;
            // Simulate file size growth - roughly 5MB per second for high quality
            const size = Math.floor(duration / 1000) * 5 * 1024 * 1024;
            
            return {
              ...prev,
              duration,
              size
            };
          });
        }
      }, 1000);
      
      setRecordingInterval(interval);
      
      logger.info(LogCategory.RECORDING, 'Recording started', { 
        recordingId: recording.id,
        config 
      });
      
      return recording;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setError(errorMessage);
      logger.error(LogCategory.RECORDING, 'Failed to start recording', { error });
      return null;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!currentRecording) return;
    
    try {
      setError(null);
      
      // Clear the update interval
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      
      const recording = await recordingManager.stopRecording(currentRecording.id);
      setCurrentRecording(recording);
      setIsRecording(false);
      
      logger.info(LogCategory.RECORDING, 'Recording stopped', { 
        recordingId: recording.id,
        duration: recording.duration,
        size: recording.size
      });
      
      return recording;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop recording';
      setError(errorMessage);
      logger.error(LogCategory.RECORDING, 'Failed to stop recording', { error });
      return null;
    }
  }, [currentRecording, recordingInterval]);

  const splitRecording = useCallback(async () => {
    if (!currentRecording || !isRecording) {
      logger.warn(LogCategory.RECORDING, 'Cannot split recording - no active recording');
      return null;
    }
    
    try {
      setError(null);
      
      // Clear the update interval
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      
      // Stop current recording and start a new one
      const newRecording = await recordingManager.splitRecording(currentRecording.id);
      setCurrentRecording(newRecording);
      
      // Set up new interval for the new recording
      const interval = setInterval(() => {
        if (newRecording) {
          setCurrentRecording(prev => {
            if (!prev) return prev;
            
            const duration = Date.now() - prev.startTime;
            const size = Math.floor(duration / 1000) * 5 * 1024 * 1024;
            
            return {
              ...prev,
              duration,
              size
            };
          });
        }
      }, 1000);
      
      setRecordingInterval(interval);
      
      logger.info(LogCategory.RECORDING, 'Recording split', {
        oldId: currentRecording.id,
        newId: newRecording.id
      });
      
      return newRecording;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to split recording';
      setError(errorMessage);
      logger.error(LogCategory.RECORDING, 'Failed to split recording', { error });
      return null;
    }
  }, [currentRecording, isRecording, recordingInterval]);

  // Clean up recording state when component unmounts
  useEffect(() => {
    return () => {
      if (isRecording && currentRecording) {
        logger.info(LogCategory.RECORDING, 'Cleaning up recording on unmount', {
          recordingId: currentRecording.id
        });
        stopRecording();
      }
    };
  }, [isRecording, currentRecording, stopRecording]);

  return {
    isRecording,
    currentRecording,
    error,
    startRecording,
    stopRecording,
    splitRecording
  };
};

export default useRecording;