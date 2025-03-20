import React, { useState } from 'react';
import { useRecording } from '../../hooks/useRecording';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { SwordIcon as Record, Square, Scissors, Settings, Folder, AlertCircle } from 'lucide-react';
import { formatBytes, formatDuration } from '../../utils/format';
import { logger, LogCategory } from '../../utils/logging';

export const RecordingPanel: React.FC = () => {
  const {
    isRecording,
    currentRecording,
    error,
    startRecording,
    stopRecording,
    splitRecording
  } = useRecording();

  const [format, setFormat] = useState<'mp4' | 'mkv'>('mp4');
  const [videoBitrate, setVideoBitrate] = useState('5000k');
  const [audioBitrate, setAudioBitrate] = useState('320k');
  const [fps, setFps] = useState(60);
  const [resolution, setResolution] = useState('1920x1080');
  const [separateAudioTracks, setSeparateAudioTracks] = useState(true);

  const handleStartRecording = async () => {
    logger.info(LogCategory.RECORDING, 'Starting recording with settings', {
      format,
      videoBitrate,
      audioBitrate,
      fps,
      resolution,
      separateAudioTracks
    });
    
    await startRecording({
      format,
      quality: {
        videoBitrate,
        audioBitrate,
        fps,
        resolution
      },
      separateAudioTracks
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Record size={20} className="text-primary mr-2" />
          <h2 className="font-semibold">Recording</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
        )}
        
        {currentRecording ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current Recording</span>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Folder size={14} />}
                  className="text-gray-500"
                  title="Open recording folder"
                >
                  Open Folder
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Filename:</span>
                  <span className="font-medium">{currentRecording.filename}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium uppercase">{currentRecording.format}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {formatDuration(currentRecording.duration)}
                  </span>
                </div>
                
                {currentRecording.size > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{formatBytes(currentRecording.size)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    currentRecording.status === 'recording' ? 'text-green-500' : 
                    currentRecording.status === 'error' ? 'text-red-500' : 
                    'text-gray-500'
                  }`}>
                    {currentRecording.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {isRecording && (
                <Button
                  variant="outline"
                  leftIcon={<Scissors size={16} />}
                  onClick={splitRecording}
                  className="flex-1"
                >
                  Split Recording
                </Button>
              )}
              
              <Button
                variant={isRecording ? "danger" : "primary"}
                leftIcon={isRecording ? <Square size={16} /> : <Record size={16} />}
                onClick={isRecording ? stopRecording : handleStartRecording}
                className="flex-1"
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recording Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <Select
                  options={[
                    { value: 'mp4', label: 'MP4' },
                    { value: 'mkv', label: 'MKV' }
                  ]}
                  value={format}
                  onChange={(value) => setFormat(value as 'mp4' | 'mkv')}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <Select
                  options={[
                    { value: '1280x720', label: '720p' },
                    { value: '1920x1080', label: '1080p' },
                    { value: '2560x1440', label: '1440p' },
                    { value: '3840x2160', label: '4K' }
                  ]}
                  value={resolution}
                  onChange={setResolution}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Bitrate
                </label>
                <Select
                  options={[
                    { value: '2500k', label: '2.5 Mbps' },
                    { value: '5000k', label: '5 Mbps' },
                    { value: '8000k', label: '8 Mbps' },
                    { value: '12000k', label: '12 Mbps' }
                  ]}
                  value={videoBitrate}
                  onChange={setVideoBitrate}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audio Bitrate
                </label>
                <Select
                  options={[
                    { value: '128k', label: '128 kbps' },
                    { value: '192k', label: '192 kbps' },
                    { value: '256k', label: '256 kbps' },
                    { value: '320k', label: '320 kbps' }
                  ]}
                  value={audioBitrate}
                  onChange={setAudioBitrate}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frame Rate
                </label>
                <Select
                  options={[
                    { value: '30', label: '30 FPS' },
                    { value: '60', label: '60 FPS' }
                  ]}
                  value={fps.toString()}
                  onChange={(value) => setFps(parseInt(value))}
                  fullWidth
                />
              </div>
              
              <div className="flex items-center">
                <Toggle
                  label="Separate Audio Tracks"
                  checked={separateAudioTracks}
                  onChange={setSeparateAudioTracks}
                />
              </div>
            </div>
            
            <Button
              variant="primary"
              leftIcon={<Record size={16} />}
              onClick={handleStartRecording}
              fullWidth
            >
              Start Recording
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecordingPanel;