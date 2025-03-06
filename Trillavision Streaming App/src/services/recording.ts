import { v4 as uuidv4 } from 'uuid';
import { logger, LogCategory } from '../utils/logging';

export interface RecordingConfig {
  format: 'mp4' | 'mkv';
  quality: {
    videoBitrate: string;
    audioBitrate: string;
    fps: number;
    resolution: string;
  };
  outputPath?: string;
  filename?: string;
  separateAudioTracks: boolean;
}

export interface RecordingInfo {
  id: string;
  filename: string;
  path: string;
  format: string;
  startTime: number;
  duration: number;
  size: number;
  status: 'recording' | 'stopped' | 'error';
  error?: string;
}

class RecordingManager {
  private static instance: RecordingManager;
  private activeRecordings: Map<string, RecordingInfo>;
  private defaultConfig: Partial<RecordingConfig>;

  private constructor() {
    this.activeRecordings = new Map();
    this.defaultConfig = {
      format: 'mp4',
      quality: {
        videoBitrate: '5000k',
        audioBitrate: '320k',
        fps: 60,
        resolution: '1920x1080'
      },
      outputPath: '/recordings',
      separateAudioTracks: true
    };
  }

  static getInstance(): RecordingManager {
    if (!RecordingManager.instance) {
      RecordingManager.instance = new RecordingManager();
    }
    return RecordingManager.instance;
  }

  async startRecording(config: Partial<RecordingConfig> = {}): Promise<RecordingInfo> {
    const fullConfig = { ...this.defaultConfig, ...config } as RecordingConfig;
    
    try {
      // Generate recording ID and filename
      const recordingId = uuidv4();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = fullConfig.filename || `recording-${timestamp}.${fullConfig.format}`;
      const outputPath = fullConfig.outputPath ? `${fullConfig.outputPath}/${filename}` : `/recordings/${filename}`;

      // Create recording info
      const recordingInfo: RecordingInfo = {
        id: recordingId,
        filename,
        path: outputPath,
        format: fullConfig.format,
        startTime: Date.now(),
        duration: 0,
        size: 0,
        status: 'recording'
      };

      // Store recording info
      this.activeRecordings.set(recordingId, recordingInfo);

      logger.info(LogCategory.RECORDING, 'Recording started', {
        recordingId,
        filename,
        config: fullConfig
      });

      return recordingInfo;
    } catch (error) {
      logger.error(LogCategory.RECORDING, 'Failed to start recording', { error });
      throw error;
    }
  }

  async stopRecording(recordingId: string): Promise<RecordingInfo> {
    const recording = this.activeRecordings.get(recordingId);
    if (!recording) {
      throw new Error(`Recording ${recordingId} not found`);
    }

    try {
      // Update recording info
      recording.status = 'stopped';
      recording.duration = Date.now() - recording.startTime;
      
      // Simulate file size
      recording.size = Math.floor(recording.duration / 1000) * 5 * 1024 * 1024; // ~5MB per second

      // Update stored info
      this.activeRecordings.set(recordingId, recording);

      logger.info(LogCategory.RECORDING, 'Recording stopped', {
        recordingId,
        duration: recording.duration,
        size: recording.size
      });

      return recording;
    } catch (error) {
      logger.error(LogCategory.RECORDING, 'Failed to stop recording', {
        recordingId,
        error
      });
      throw error;
    }
  }

  async getRecordingInfo(recordingId: string): Promise<RecordingInfo | null> {
    return this.activeRecordings.get(recordingId) || null;
  }

  async listRecordings(): Promise<RecordingInfo[]> {
    return Array.from(this.activeRecordings.values());
  }

  async cleanupOldRecordings(maxAge: number): Promise<void> {
    const now = Date.now();
    
    for (const [id, recording] of this.activeRecordings.entries()) {
      if (recording.status === 'stopped' && (now - recording.startTime) > maxAge) {
        this.activeRecordings.delete(id);
        
        logger.info(LogCategory.RECORDING, 'Old recording deleted', {
          recordingId: id,
          path: recording.path
        });
      }
    }
  }

  async splitRecording(recordingId: string): Promise<RecordingInfo> {
    const recording = this.activeRecordings.get(recordingId);
    if (!recording || recording.status !== 'recording') {
      throw new Error(`Cannot split inactive recording ${recordingId}`);
    }

    try {
      // Stop current recording
      await this.stopRecording(recordingId);

      // Start new recording with same config
      const newRecording = await this.startRecording({
        format: recording.format as 'mp4' | 'mkv',
        outputPath: recording.path.substring(0, recording.path.lastIndexOf('/'))
      });

      logger.info(LogCategory.RECORDING, 'Recording split', {
        originalId: recordingId,
        newId: newRecording.id
      });

      return newRecording;
    } catch (error) {
      logger.error(LogCategory.RECORDING, 'Failed to split recording', {
        recordingId,
        error
      });
      throw error;
    }
  }
}

export const recordingManager = RecordingManager.getInstance();