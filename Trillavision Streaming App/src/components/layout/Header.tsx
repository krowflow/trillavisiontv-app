import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { StreamStatus } from '../../types';
import { Button } from '../ui/Button';
import { Tv, Settings, Users, Clock, Youtube } from 'lucide-react';

/**
 * Application header component
 */
export const Header: React.FC = () => {
  const { status, viewerCount, duration, isConnectedToYouTube } = useSelector((state: RootState) => state.stream);
  const navigate = useNavigate();
  
  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Get status indicator color
  const getStatusColor = () => {
    switch (status) {
      case StreamStatus.LIVE:
        return 'bg-red-500';
      case StreamStatus.CONNECTING:
        return 'bg-yellow-500';
      case StreamStatus.ERROR:
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Tv size={24} />
            <h1 className="text-xl font-bold">Trillavision T.V.</h1>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* YouTube connection status */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Youtube size={16} className={isConnectedToYouTube ? "text-red-400" : "text-gray-400"} />}
                onClick={() => navigate('/youtube-integration')}
                className="text-white hover:text-white hover:bg-primary-light"
              >
                {isConnectedToYouTube ? 'YouTube Connected' : 'Connect YouTube'}
              </Button>
            </div>
            
            {/* Stream status */}
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></div>
              <span className="text-sm font-medium">
                {status === StreamStatus.LIVE ? 'LIVE' : status}
              </span>
            </div>
            
            {/* Stream duration */}
            {status === StreamStatus.LIVE && (
              <div className="flex items-center text-sm">
                <Clock size={16} className="mr-1" />
                <span>{formatDuration(duration)}</span>
              </div>
            )}
            
            {/* Viewer count */}
            {status === StreamStatus.LIVE && (
              <div className="flex items-center text-sm">
                <Users size={16} className="mr-1" />
                <span>{viewerCount}</span>
              </div>
            )}
            
            {/* Settings dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Settings size={16} />}
              >
                Settings
              </Button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                <div className="py-1">
                  <Link 
                    to="/settings/stream" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                  >
                    Stream Settings
                  </Link>
                  <Link 
                    to="/settings/brand" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                  >
                    Brand Settings
                  </Link>
                  <Link 
                    to="/settings/app" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                  >
                    Application Settings
                  </Link>
                  <Link 
                    to="/youtube-integration" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                  >
                    YouTube Integration
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;