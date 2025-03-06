import React from 'react';
import { useRecording } from '../../hooks/useRecording';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SwordIcon as Record, Square, Scissors, AlertCircle } from 'lucide-react';
import { formatBytes } from '../../utils/format';

export const RecordingControls: React.FC = () => {
  const { 
    isRecording, 
    currentRecording, 
    error,
    startRecording, 
    stopRecording, 
    splitRecording 
  } = useRecording();

  const handleStartRecording = async () => {
    await startRecording({
      format: 'mp4',
      quality: {
        videoBitrate: '5000k',
        audioBitrate: '320k',
        fps: 60,
        resolution: '1920x1080'
      },
      separateAudioTracks: true
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recording</h3>
        
        <div className="flex items-center space-x-2">
          {isRecording && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Scissors size={16} />}
              onClick={splitRecording}
            >
              Split
            </Button>
          )}
          
          <Button
            variant={isRecording ? 'danger' : 'primary'}
            size="sm"
            leftIcon={isRecording ? <Square size={16} /> : <Record size={16} />}
            onClick={isRecording ? stopRecording : handleStartRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      {currentRecording && (
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
              {Math.floor((Date.now() - currentRecording.startTime) / 1000)}s
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
      )}
    </Card>
  );
};