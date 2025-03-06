import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateStreamSettings } from '../../store/slices/streamSlice';
import { StreamPlatform, StreamQuality } from '../../types';
import { PanelCard } from '../ui/PanelCard';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Tabs } from '../ui/Tabs';
import { Youtube, Settings, Shield } from 'lucide-react';

/**
 * Stream settings component with improved layout and scrolling
 */
export const StreamSettings: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();
  const streamSettings = useSelector((state: RootState) => state.stream.settings);
  
  const handleUpdateSettings = (key: string, value: any) => {
    dispatch(updateStreamSettings({ [key]: value }));
  };
  
  const platformOptions = [
    { value: StreamPlatform.YOUTUBE, label: 'YouTube' },
    { value: StreamPlatform.TWITCH, label: 'Twitch' },
    { value: StreamPlatform.FACEBOOK, label: 'Facebook' },
    { value: StreamPlatform.CUSTOM, label: 'Custom RTMP' }
  ];
  
  const qualityOptions = [
    { value: StreamQuality.LOW, label: '720p 30fps' },
    { value: StreamQuality.MEDIUM, label: '1080p 30fps' },
    { value: StreamQuality.HIGH, label: '1080p 60fps' },
    { value: StreamQuality.ULTRA, label: '4K' }
  ];
  
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' }
  ];
  
  const tabs = [
    {
      id: 'platform',
      label: 'Platform',
      icon: <Youtube size={16} />,
      content: (
        <div className="space-y-4 p-4">
          <Select
            label="Streaming Platform"
            options={platformOptions}
            value={streamSettings.platform}
            onChange={(value) => handleUpdateSettings('platform', value)}
            fullWidth
          />
          
          <Input
            label="Stream Key"
            value={streamSettings.key}
            onChange={(e) => handleUpdateSettings('key', e.target.value)}
            type="password"
            fullWidth
          />
          
          <Input
            label="Stream Title"
            value={streamSettings.title}
            onChange={(e) => handleUpdateSettings('title', e.target.value)}
            fullWidth
          />
          
          <Input
            label="Description"
            value={streamSettings.description}
            onChange={(e) => handleUpdateSettings('description', e.target.value)}
            fullWidth
          />
          
          <Toggle
            label="Private Stream"
            checked={streamSettings.isPrivate}
            onChange={(checked) => handleUpdateSettings('isPrivate', checked)}
          />
        </div>
      )
    },
    {
      id: 'quality',
      label: 'Quality',
      icon: <Settings size={16} />,
      content: (
        <div className="space-y-4 p-4">
          <Select
            label="Stream Quality"
            options={qualityOptions}
            value={streamSettings.quality}
            onChange={(value) => handleUpdateSettings('quality', value)}
            fullWidth
          />
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Recommended Settings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Video Bitrate:</span>
                <span className="font-mono">
                  {streamSettings.quality === StreamQuality.LOW ? '2500-4000 kbps' :
                   streamSettings.quality === StreamQuality.MEDIUM ? '4500-6000 kbps' :
                   streamSettings.quality === StreamQuality.HIGH ? '6000-9000 kbps' :
                   '15000-40000 kbps'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Audio Bitrate:</span>
                <span className="font-mono">160 kbps</span>
              </div>
              <div className="flex justify-between">
                <span>Encoder:</span>
                <span className="font-mono">x264 / NVENC / QuickSync</span>
              </div>
              <div className="flex justify-between">
                <span>Keyframe Interval:</span>
                <span className="font-mono">2 seconds</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: <Shield size={16} />,
      content: (
        <div className="space-y-4 p-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Advanced Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              These settings are for advanced users. Changing these values may affect stream performance and stability.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buffer Size (KB)
                </label>
                <input
                  type="number"
                  className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  defaultValue={2048}
                />
              </div>
              
              <div className="custom-select">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Process Priority
                </label>
                <Select
                  options={priorityOptions}
                  defaultValue="normal"
                  fullWidth
                />
              </div>
              
              <Toggle
                label="Enable Hardware Acceleration"
                checked={true}
              />
              
              <Toggle
                label="Dynamic Bitrate Adjustment"
                checked={true}
              />
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <PanelCard 
      title="Stream Settings" 
      icon={<Settings size={18} />}
      onClose={onClose}
      isCollapsible={true}
      isMaximizable={true}
    >
      <Tabs 
        tabs={tabs} 
        className="h-full"
        scrollable={true}
      />
    </PanelCard>
  );
};