import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { Video, Mic, MonitorPlay, RefreshCw, Plus, Users, Volume2, VolumeX, Sliders } from 'lucide-react';
import { usePodcastingMode } from '../../hooks/usePodcastingMode';
import { Device } from '../../types';
import { deviceApi } from '../../services/api';
import { logger, LogCategory } from '../../utils/logging';

interface DeviceSelectorProps {
  onDeviceSelect: (deviceType: string, deviceId: string) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({ onDeviceSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState<{
    cameras: Device[];
    microphones: Device[];
    screens: Device[];
  }>({
    cameras: [],
    microphones: [],
    screens: []
  });
  
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [selectedScreen, setSelectedScreen] = useState<string>('');
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [newDeviceType, setNewDeviceType] = useState<'camera' | 'microphone' | 'screen'>('camera');
  const [newDeviceName, setNewDeviceName] = useState('');
  
  const { isPodcastingMode, togglePodcastingMode } = usePodcastingMode();
  const [secondaryMicrophone, setSecondaryMicrophone] = useState<string>('');
  const [microphoneSettings, setMicrophoneSettings] = useState<Record<string, {
    [key: string]: {
      gain: number;
      muted: boolean;
    }
  }>>(() => ({}));
  
  // Track if initial setup has been done
  const initialSetupDone = React.useRef(false);
  
  // Load available devices
  const loadDevices = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const deviceData = await deviceApi.getDevices();
      setDevices(deviceData);
      
      // Initialize microphone settings for new devices
      setMicrophoneSettings(prevSettings => {
        const newSettings = { ...prevSettings };
        deviceData.microphones.forEach(mic => {
          if (!newSettings[mic.id]) {
            newSettings[mic.id] = {
              gain: 75,
              muted: false
            };
          }
        });
        return newSettings;
      });
      
      logger.debug(LogCategory.UI, 'Devices loaded', { deviceCount: deviceData.microphones.length });
    } catch (error) {
      logger.error(LogCategory.UI, 'Error loading devices', { error });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  // Load devices on mount
  useEffect(() => {
    loadDevices();
  }, [loadDevices]);
  
  // Set default selections after devices are loaded
  useEffect(() => {
    if (
      initialSetupDone.current || 
      devices.cameras.length === 0 || 
      devices.microphones.length === 0 || 
      devices.screens.length === 0
    ) {
      return;
    }
    
    // Set default camera
    const defaultCamera = devices.cameras.find(cam => cam.id === 'sony-zv-e1') || devices.cameras[0];
    setSelectedCamera(defaultCamera.id);
    onDeviceSelect('camera', defaultCamera.id);
    
    // Set default primary microphone
    const primaryMic = devices.microphones.find(mic => mic.id === 'shure-sm7b-1') || devices.microphones[0];
    setSelectedMicrophone(primaryMic.id);
    
    // Set default secondary microphone
    const secondaryMic = devices.microphones.find(mic => mic.id === 'shure-sm7b-2') || 
                        (devices.microphones.length > 1 ? devices.microphones[1] : devices.microphones[0]);
    setSecondaryMicrophone(secondaryMic.id);
    
    // Set default screen
    setSelectedScreen(devices.screens[0].id);
    onDeviceSelect('screen', devices.screens[0].id);
    
    // Mark initial setup as done
    initialSetupDone.current = true;
    
    logger.debug(LogCategory.UI, 'Default devices set', {
      camera: defaultCamera.id,
      primaryMic: primaryMic.id,
      secondaryMic: secondaryMic.id
    });
  }, [devices, onDeviceSelect]);
  
  // Handle podcasting mode changes
  useEffect(() => {
    if (!selectedMicrophone || !secondaryMicrophone || !initialSetupDone.current) return;
    
    if (isPodcastingMode) {
      onDeviceSelect('primaryMicrophone', selectedMicrophone);
      onDeviceSelect('secondaryMicrophone', secondaryMicrophone);
    } else {
      onDeviceSelect('microphone', selectedMicrophone);
    }
  }, [isPodcastingMode, selectedMicrophone, secondaryMicrophone, onDeviceSelect]);
  
  const handleCameraChange = useCallback((value: string) => {
    setSelectedCamera(value);
    onDeviceSelect('camera', value);
  }, [onDeviceSelect]);
  
  const handleMicrophoneChange = useCallback((value: string) => {
    setSelectedMicrophone(value);
    
    if (isPodcastingMode) {
      onDeviceSelect('primaryMicrophone', value);
    } else {
      onDeviceSelect('microphone', value);
    }
  }, [isPodcastingMode, onDeviceSelect]);
  
  const handleSecondaryMicrophoneChange = useCallback((value: string) => {
    setSecondaryMicrophone(value);
    
    if (isPodcastingMode) {
      onDeviceSelect('secondaryMicrophone', value);
    }
  }, [isPodcastingMode, onDeviceSelect]);
  
  const handleScreenChange = useCallback((value: string) => {
    setSelectedScreen(value);
    onDeviceSelect('screen', value);
  }, [onDeviceSelect]);
  
  const handleRefresh = useCallback(() => {
    loadDevices();
  }, [loadDevices]);
  
  const handleAddDevice = useCallback(() => {
    if (!newDeviceName.trim()) return;
    
    const newDevice: Device = {
      id: `custom-${Date.now()}`,
      name: newDeviceName
    };
    
    setDevices(prev => {
      if (newDeviceType === 'camera') {
        return { ...prev, cameras: [...prev.cameras, newDevice] };
      } else if (newDeviceType === 'microphone') {
        return { ...prev, microphones: [...prev.microphones, newDevice] };
      } else {
        return { ...prev, screens: [...prev.screens, newDevice] };
      }
    });
    
    // Initialize settings for new microphone
    if (newDeviceType === 'microphone') {
      setMicrophoneSettings(prev => ({
        ...prev,
        [newDevice.id]: {
          gain: 75,
          muted: false
        }
      }));
    }
    
    setNewDeviceName('');
    setShowAddDeviceForm(false);
    
    logger.info(LogCategory.UI, 'New device added', {
      deviceId: newDevice.id,
      deviceType: newDeviceType,
      deviceName: newDevice.name
    });
  }, [newDeviceName, newDeviceType]);
  
  // Get device details for the selected microphone
  const getSelectedMicrophoneDetails = useCallback((micId: string) => {
    const mic = devices.microphones.find(m => m.id === micId);
    if (!mic) return null;
    return mic;
  }, [devices.microphones]);
  
  const selectedMic = getSelectedMicrophoneDetails(selectedMicrophone);
  const secondaryMic = getSelectedMicrophoneDetails(secondaryMicrophone);
  
  // Handle microphone gain change
  const handleGainChange = useCallback((micId: string, value: number) => {
    setMicrophoneSettings(prev => ({
      ...prev,
      [micId]: {
        ...prev[micId],
        gain: value
      }
    }));
  }, []);
  
  // Handle microphone mute toggle
  const handleMuteToggle = useCallback((micId: string) => {
    setMicrophoneSettings(prev => ({
      ...prev,
      [micId]: {
        ...prev[micId],
        muted: !prev[micId]?.muted
      }
    }));
  }, []);

  return (
    <div className="flex flex-col h-full max-h-[200px] overflow-hidden">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-base font-semibold">Input Devices</h2>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setShowAddDeviceForm(!showAddDeviceForm)}
            className="h-5 px-1.5 text-[11px]"
          >
            Add
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={handleRefresh}
            isLoading={isLoading}
            className="h-5 px-1.5 text-[11px]"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {showAddDeviceForm && (
        <div className="mb-1 p-1 bg-gray-50 rounded">
          <h3 className="text-[11px] font-medium mb-0.5">Add New Device</h3>
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <Select
                options={[
                  { value: 'camera', label: 'Camera' },
                  { value: 'microphone', label: 'Microphone' },
                  { value: 'screen', label: 'Screen' }
                ]}
                value={newDeviceType}
                onChange={(value) => setNewDeviceType(value as any)}
                fullWidth
                className="h-6 text-[11px]"
              />
            </div>
            <div>
              <input
                type="text"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                className="w-full h-6 px-1.5 rounded border border-gray-300 text-[11px]"
                placeholder="Device name"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-1.5 flex-1">
        {/* Device Selection */}
        <div className="grid gap-1.5">
          <div>
            <label className="flex items-center text-[11px] mb-0.5">
              <Video size={14} className="mr-1" />
              Camera
            </label>
            <Select
              options={devices.cameras.map(camera => ({
                value: camera.id,
                label: camera.name
              }))}
              value={selectedCamera}
              onChange={handleCameraChange}
              fullWidth
              className="h-6 text-[11px]"
            />
          </div>
          
          <div>
            <label className="flex items-center text-[11px] mb-0.5">
              <Mic size={14} className="mr-1" />
              {isPodcastingMode ? 'Primary Mic' : 'Microphone'}
            </label>
            <Select
              options={devices.microphones.map(mic => ({
                value: mic.id,
                label: mic.name
              }))}
              value={selectedMicrophone}
              onChange={handleMicrophoneChange}
              fullWidth
              className="h-6 text-[11px]"
            />
          </div>
          
          {isPodcastingMode && (
            <div>
              <label className="flex items-center text-[11px] mb-0.5">
                <Mic size={14} className="mr-1" />
                Secondary Mic
              </label>
              <Select
                options={devices.microphones
                  .filter(mic => mic.id !== selectedMicrophone)
                  .map(mic => ({
                    value: mic.id,
                    label: mic.name
                  }))}
                value={secondaryMicrophone}
                onChange={handleSecondaryMicrophoneChange}
                fullWidth
                className="h-6 text-[11px]"
              />
            </div>
          )}
          
          <div>
            <label className="flex items-center text-[11px] mb-0.5">
              <MonitorPlay size={14} className="mr-1" />
              Screen
            </label>
            <Select
              options={devices.screens.map(screen => ({
                value: screen.id,
                label: screen.name
              }))}
              value={selectedScreen}
              onChange={handleScreenChange}
              fullWidth
              className="h-6 text-[11px]"
            />
          </div>
        </div>
        
        {/* Podcasting Mode Toggle */}
        <div className="p-1 bg-primary bg-opacity-5 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users size={14} className="text-primary mr-1" />
              <span className="text-[11px]">Podcasting Mode</span>
            </div>
            <Toggle
              checked={isPodcastingMode}
              onChange={togglePodcastingMode}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelector;