import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { StreamStatus } from '../../types';
import { startStream, stopStream } from '../../store/slices/streamSlice';
import { Button } from '../ui/Button';
import { Play, Square, Youtube, Settings } from 'lucide-react';

export const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const { status, isConnectedToYouTube } = useSelector((state: RootState) => state.stream);
  
  const handleStartStream = () => {
    dispatch(startStream());
  };
  
  const handleStopStream = () => {
    dispatch(stopStream());
  };
  
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800 py-3 px-4 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status === StreamStatus.OFFLINE ? (
            <Button
              variant="primary"
              leftIcon={<Play size={16} />}
              onClick={handleStartStream}
              disabled={!isConnectedToYouTube}
            >
              Go Live
            </Button>
          ) : (
            <Button
              variant="danger"
              leftIcon={<Square size={16} />}
              onClick={handleStopStream}
            >
              End Stream
            </Button>
          )}
          
          <Button
            variant="outline"
            leftIcon={<Youtube size={16} />}
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            {isConnectedToYouTube ? 'Connected to YouTube' : 'Connect to YouTube'}
          </Button>
        </div>
        
        <div>
          <Button
            variant="ghost"
            leftIcon={<Settings size={16} />}
            className="text-white hover:text-white hover:bg-gray-800"
          >
            Stream Settings
          </Button>
        </div>
      </div>
    </footer>
  );
};