import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Music, Save, Mic, Volume2, VolumeX, Settings, Sliders, AudioWaveform as Waveform, X, Plus } from 'lucide-react';
import { AudioChannel, AudioProcessor, AudioProcessorType, Preset } from '../../types';
import { ChannelStrip } from './ChannelStrip';
import { CompressorProcessor } from './processors/CompressorProcessor';
import { LimiterProcessor } from './processors/LimiterProcessor';
import { EqualizerProcessor } from './processors/EqualizerProcessor';
import { GateProcessor } from './processors/GateProcessor';
import { DeEsserProcessor } from './processors/DeEsserProcessor';
import { VSTProcessor } from './VSTProcessor';
import { VSTBrowser } from './VSTBrowser';
import { MasterSection } from './MasterSection';
import { PresetManager } from './PresetManager';
import { usePodcastingMode } from '../../hooks/usePodcastingMode';
import { logger, LogCategory } from '../../utils/logging';

interface AudioMixerProps {
  onSettingsChange?: (channelId: string, processorId: string, settings: Record<string, any>) => void;
  onClose?: () => void;
}

export const AudioMixer: React.FC<AudioMixerProps> = ({ onSettingsChange, onClose }) => {
  const { isPodcastingMode } = usePodcastingMode();
  const [activeTab, setActiveTab] = useState('mixer');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedProcessorId, setSelectedProcessorId] = useState<string | null>(null);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [showVSTBrowser, setShowVSTBrowser] = useState(false);

  // Initialize channels state
  const [channels, setChannels] = useState<AudioChannel[]>([
    {
      id: 'host-mic',
      name: 'Host Mic',
      deviceId: 'shure-sm7b-1',
      gain: 75,
      pan: 0,
      muted: false,
      solo: false,
      processors: [
        {
          id: 'host-gate',
          type: AudioProcessorType.GATE,
          enabled: true,
          settings: {
            threshold: -50,
            attack: 10,
            release: 100
          }
        },
        {
          id: 'host-compressor',
          type: AudioProcessorType.COMPRESSOR,
          enabled: true,
          settings: {
            threshold: -24,
            ratio: 4,
            attack: 10,
            release: 100,
            knee: 10,
            makeupGain: 6
          }
        },
        {
          id: 'host-eq',
          type: AudioProcessorType.EQUALIZER,
          enabled: true,
          settings: {
            bands: [
              { id: 'host-eq-1', frequency: 100, gain: 3, Q: 1, type: 'lowshelf' },
              { id: 'host-eq-2', frequency: 400, gain: -2, Q: 1, type: 'peaking' },
              { id: 'host-eq-3', frequency: 1200, gain: 2, Q: 1, type: 'peaking' },
              { id: 'host-eq-4', frequency: 3000, gain: 4, Q: 1, type: 'peaking' },
              { id: 'host-eq-5', frequency: 8000, gain: 2, Q: 1, type: 'highshelf' }
            ]
          }
        },
        {
          id: 'host-deesser',
          type: AudioProcessorType.DEESSER,
          enabled: true,
          settings: {
            frequency: 6000,
            threshold: -20,
            ratio: 4
          }
        }
      ]
    },
    {
      id: 'guest-mic',
      name: 'Guest Mic',
      deviceId: 'shure-sm7b-2',
      gain: 75,
      pan: 0,
      muted: false,
      solo: false,
      processors: [
        {
          id: 'guest-gate',
          type: AudioProcessorType.GATE,
          enabled: true,
          settings: {
            threshold: -50,
            attack: 10,
            release: 100
          }
        },
        {
          id: 'guest-compressor',
          type: AudioProcessorType.COMPRESSOR,
          enabled: true,
          settings: {
            threshold: -24,
            ratio: 4,
            attack: 10,
            release: 100,
            knee: 10,
            makeupGain: 6
          }
        },
        {
          id: 'guest-eq',
          type: AudioProcessorType.EQUALIZER,
          enabled: true,
          settings: {
            bands: [
              { id: 'guest-eq-1', frequency: 100, gain: 3, Q: 1, type: 'lowshelf' },
              { id: 'guest-eq-2', frequency: 400, gain: -2, Q: 1, type: 'peaking' },
              { id: 'guest-eq-3', frequency: 1200, gain: 2, Q: 1, type: 'peaking' },
              { id: 'guest-eq-4', frequency: 3000, gain: 4, Q: 1, type: 'peaking' },
              { id: 'guest-eq-5', frequency: 8000, gain: 2, Q: 1, type: 'highshelf' }
            ]
          }
        },
        {
          id: 'guest-deesser',
          type: AudioProcessorType.DEESSER,
          enabled: true,
          settings: {
            frequency: 6000,
            threshold: -20,
            ratio: 4
          }
        }
      ]
    }
  ]);

  // Initialize master section state
  const [masterSettings, setMasterSettings] = useState({
    gain: 85,
    processors: [
      {
        id: 'master-limiter',
        type: AudioProcessorType.LIMITER,
        enabled: true,
        settings: {
          threshold: -3,
          release: 50
        }
      }
    ]
  });

  // Initialize presets
  const [presets, setPresets] = useState<Preset[]>([
    {
      id: 'preset-vocal-compressor',
      name: 'Vocal Compressor',
      type: 'compressor',
      settings: {
        threshold: -24,
        ratio: 4,
        attack: 10,
        release: 100,
        knee: 10,
        makeupGain: 6
      }
    },
    {
      id: 'preset-podcast-eq',
      name: 'Podcast EQ',
      type: 'equalizer',
      settings: {
        bands: [
          { id: 'preset-eq-1', frequency: 100, gain: 3, Q: 1, type: 'lowshelf' },
          { id: 'preset-eq-2', frequency: 400, gain: -2, Q: 1, type: 'peaking' },
          { id: 'preset-eq-3', frequency: 1200, gain: 2, Q: 1, type: 'peaking' },
          { id: 'preset-eq-4', frequency: 3000, gain: 4, Q: 1, type: 'peaking' },
          { id: 'preset-eq-5', frequency: 8000, gain: 2, Q: 1, type: 'highshelf' }
        ]
      }
    }
  ]);

  // Handle channel gain change
  const handleChannelGainChange = (channelId: string, gain: number) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId ? { ...channel, gain } : channel
    ));
    
    if (onSettingsChange) {
      onSettingsChange(channelId, 'gain', { gain });
    }
  };

  // Handle channel mute toggle
  const handleChannelMuteToggle = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId ? { ...channel, muted: !channel.muted } : channel
    ));
    
    if (onSettingsChange) {
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
        onSettingsChange(channelId, 'mute', { muted: !channel.muted });
      }
    }
  };

  // Handle processor settings change
  const handleProcessorSettingsChange = (channelId: string, processorId: string, settings: Record<string, any>) => {
    setChannels(prev => prev.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          processors: channel.processors.map(processor => 
            processor.id === processorId ? { ...processor, settings: { ...processor.settings, ...settings } } : processor
          )
        };
      }
      return channel;
    }));
    
    if (onSettingsChange) {
      onSettingsChange(channelId, processorId, settings);
    }
  };

  // Handle processor enable/disable
  const handleProcessorToggle = (channelId: string, processorId: string) => {
    setChannels(prev => prev.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          processors: channel.processors.map(processor => 
            processor.id === processorId ? { ...processor, enabled: !processor.enabled } : processor
          )
        };
      }
      return channel;
    }));
    
    if (onSettingsChange) {
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
        const processor = channel.processors.find(p => p.id === processorId);
        if (processor) {
          onSettingsChange(channelId, processorId, { enabled: !processor.enabled });
        }
      }
    }
  };

  // Handle master gain change
  const handleMasterGainChange = (gain: number) => {
    setMasterSettings(prev => ({ ...prev, gain }));
    
    if (onSettingsChange) {
      onSettingsChange('master', 'gain', { gain });
    }
  };

  // Handle master processor settings change
  const handleMasterProcessorSettingsChange = (processorId: string, settings: Record<string, any>) => {
    setMasterSettings(prev => ({
      ...prev,
      processors: prev.processors.map(processor => 
        processor.id === processorId ? { ...processor, settings: { ...processor.settings, ...settings } } : processor
      )
    }));
    
    if (onSettingsChange) {
      onSettingsChange('master', processorId, settings);
    }
  };

  // Handle master processor enable/disable
  const handleMasterProcessorToggle = (processorId: string) => {
    setMasterSettings(prev => ({
      ...prev,
      processors: prev.processors.map(processor => 
        processor.id === processorId ? { ...processor, enabled: !processor.enabled } : processor
      )
    }));
    
    if (onSettingsChange) {
      const processor = masterSettings.processors.find(p => p.id === processorId);
      if (processor) {
        onSettingsChange('master', processorId, { enabled: !processor.enabled });
      }
    }
  };

  // Handle preset selection
  const handlePresetSelect = (preset: Preset) => {
    if (preset.type === 'channel' && selectedChannelId) {
      setChannels(prev => prev.map(channel => 
        channel.id === selectedChannelId ? { 
          ...channel, 
          gain: preset.settings.gain,
          pan: preset.settings.pan,
          processors: preset.settings.processors
        } : channel
      ));
    } else if (preset.type === 'compressor' && selectedChannelId && selectedProcessorId) {
      setChannels(prev => prev.map(channel => {
        if (channel.id === selectedChannelId) {
          return {
            ...channel,
            processors: channel.processors.map(processor => 
              processor.id === selectedProcessorId && processor.type === AudioProcessorType.COMPRESSOR
                ? { ...processor, settings: preset.settings }
                : processor
            )
          };
        }
        return channel;
      }));
    } else if (preset.type === 'equalizer' && selectedChannelId && selectedProcessorId) {
      setChannels(prev => prev.map(channel => {
        if (channel.id === selectedChannelId) {
          return {
            ...channel,
            processors: channel.processors.map(processor => 
              processor.id === selectedProcessorId && processor.type === AudioProcessorType.EQUALIZER
                ? { ...processor, settings: preset.settings }
                : processor
            )
          };
        }
        return channel;
      }));
    } else if (preset.type === 'limiter' && selectedProcessorId) {
      setMasterSettings(prev => ({
        ...prev,
        processors: prev.processors.map(processor => 
          processor.id === selectedProcessorId && processor.type === AudioProcessorType.LIMITER
            ? { ...processor, settings: preset.settings }
            : processor
        )
      }));
    }
    
    setShowPresetManager(false);
  };

  // Handle preset save
  const handlePresetSave = (name: string, type: 'compressor' | 'limiter' | 'equalizer' | 'gate' | 'deesser' | 'channel' | 'master') => {
    if (type === 'channel' && selectedChannelId) {
      const channel = channels.find(c => c.id === selectedChannelId);
      if (channel) {
        const newPreset: Preset = {
          id: `preset-${Date.now()}`,
          name,
          type,
          settings: {
            gain: channel.gain,
            pan: channel.pan,
            processors: channel.processors
          }
        };
        setPresets(prev => [...prev, newPreset]);
      }
    } else if (type === 'compressor' && selectedChannelId && selectedProcessorId) {
      const channel = channels.find(c => c.id === selectedChannelId);
      if (channel) {
        const processor = channel.processors.find(p => p.id === selectedProcessorId && p.type === AudioProcessorType.COMPRESSOR);
        if (processor) {
          const newPreset: Preset = {
            id: `preset-${Date.now()}`,
            name,
            type,
            settings: processor.settings
          };
          setPresets(prev => [...prev, newPreset]);
        }
      }
    } else if (type === 'equalizer' && selectedChannelId && selectedProcessorId) {
      const channel = channels.find(c => c.id === selectedChannelId);
      if (channel) {
        const processor = channel.processors.find(p => p.id === selectedProcessorId && p.type === AudioProcessorType.EQUALIZER);
        if (processor) {
          const newPreset: Preset = {
            id: `preset-${Date.now()}`,
            name,
            type,
            settings: processor.settings
          };
          setPresets(prev => [...prev, newPreset]);
        }
      }
    } else if (type === 'limiter' && selectedProcessorId) {
      const processor = masterSettings.processors.find(p => p.id === selectedProcessorId && p.type === AudioProcessorType.LIMITER);
      if (processor) {
        const newPreset: Preset = {
          id: `preset-${Date.now()}`,
          name,
          type,
          settings: processor.settings
        };
        setPresets(prev => [...prev, newPreset]);
      }
    }
    
    setShowPresetManager(false);
  };

  // Get the selected processor
  const getSelectedProcessor = () => {
    if (selectedChannelId && selectedProcessorId) {
      const channel = channels.find(c => c.id === selectedChannelId);
      if (channel) {
        return channel.processors.find(p => p.id === selectedProcessorId);
      }
    } else if (selectedProcessorId) {
      return masterSettings.processors.find(p => p.id === selectedProcessorId);
    }
    return null;
  };

  // Handle VST plugin selection
  const handleVSTSelect = (plugin: any) => {
    if (!selectedChannelId) return;

    const newProcessor: AudioProcessor = {
      id: `vst-${Date.now()}`,
      type: AudioProcessorType.VST,
      enabled: true,
      settings: {},
      vstPlugin: plugin
    };

    setChannels(prev => prev.map(channel => 
      channel.id === selectedChannelId
        ? {
            ...channel,
            processors: [...channel.processors, newProcessor]
          }
        : channel
    ));

    setSelectedProcessorId(newProcessor.id);
    setShowVSTBrowser(false);

    logger.info(LogCategory.AUDIO, 'VST plugin added', {
      channelId: selectedChannelId,
      pluginId: plugin.id,
      pluginName: plugin.name
    });
  };

  // Render processor editor based on selected processor
  const renderProcessorEditor = () => {
    const processor = getSelectedProcessor();
    if (!processor) return null;

    switch (processor.type) {
      case AudioProcessorType.COMPRESSOR:
        return (
          <CompressorProcessor
            settings={processor.settings}
            onChange={(settings) => {
              if (selectedChannelId) {
                handleProcessorSettingsChange(selectedChannelId, processor.id, settings);
              }
            }}
            enabled={processor.enabled}
            onToggle={() => {
              if (selectedChannelId) {
                handleProcessorToggle(selectedChannelId, processor.id);
              }
            }}
          />
        );
      case AudioProcessorType.LIMITER:
        return (
          <LimiterProcessor
            settings={processor.settings}
            onChange={(settings) => {
              if (selectedChannelId) {
                handleProcessorSettingsChange(selectedChannelId, processor.id, settings);
              } else {
                handleMasterProcessorSettingsChange(processor.id, settings);
              }
            }}
            enabled={processor.enabled}
            onToggle={() => {
              if (selectedChannelId) {
                handleProcessorToggle(selectedChannelId, processor.id);
              } else {
                handleMasterProcessorToggle(processor.id);
              }
            }}
          />
        );
      case AudioProcessorType.EQUALIZER:
        return (
          <EqualizerProcessor
            settings={processor.settings}
            onChange={(settings) => {
              if (selectedChannelId) {
                handleProcessorSettingsChange(selectedChannelId, processor.id, settings);
              }
            }}
            enabled={processor.enabled}
            onToggle={() => {
              if (selectedChannelId) {
                handleProcessorToggle(selectedChannelId, processor.id);
              }
            }}
          />
        );
      case AudioProcessorType.GATE:
        return (
          <GateProcessor
            settings={processor.settings}
            onChange={(settings) => {
              if (selectedChannelId) {
                handleProcessorSettingsChange(selectedChannelId, processor.id, settings);
              }
            }}
            enabled={processor.enabled}
            onToggle={() => {
              if (selectedChannelId) {
                handleProcessorToggle(selectedChannelId, processor.id);
              }
            }}
          />
        );
      case AudioProcessorType.DEESSER:
        return (
          <DeEsserProcessor
            settings={processor.settings}
            onChange={(settings) => {
              if (selectedChannelId) {
                handleProcessorSettingsChange(selectedChannelId, processor.id, settings);
              }
            }}
            enabled={processor.enabled}
            onToggle={() => {
              if (selectedChannelId) {
                handleProcessorToggle(selectedChannelId, processor.id);
              }
            }}
          />
        );
      case AudioProcessorType.VST:
        return (
          <VSTProcessor
            pluginId={processor.vstPlugin?.id || ''}
            onChange={(settings) => {
              if (selectedChannelId) {
                handleProcessorSettingsChange(selectedChannelId, processor.id, settings);
              }
            }}
            enabled={processor.enabled}
            onToggle={() => {
              if (selectedChannelId) {
                handleProcessorToggle(selectedChannelId, processor.id);
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  // Filter channels based on podcasting mode
  const visibleChannels = isPodcastingMode 
    ? channels 
    : channels.filter(channel => channel.id === 'host-mic');

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg shadow-xl w-[1200px] h-[800px] flex flex-col border-4 border-primary">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <Music size={20} className="text-primary mr-2" />
            <h2 className="font-semibold text-white">Audio Mixer</h2>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full text-white hover:text-white hover:bg-gray-800"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Channel strips and master section */}
          <div className="w-1/3 border-r border-gray-800 p-4 overflow-y-auto">
            <div className="flex space-x-4">
              {visibleChannels.map(channel => (
                <ChannelStrip
                  key={channel.id}
                  channel={channel}
                  onGainChange={(gain) => handleChannelGainChange(channel.id, gain)}
                  onMuteToggle={() => handleChannelMuteToggle(channel.id)}
                  onProcessorSelect={(processorId) => {
                    setSelectedChannelId(channel.id);
                    setSelectedProcessorId(processorId);
                  }}
                  isSelected={selectedChannelId === channel.id}
                />
              ))}
              
              <MasterSection
                gain={masterSettings.gain}
                onGainChange={handleMasterGainChange}
                processors={masterSettings.processors}
                onProcessorSelect={(processorId) => {
                  setSelectedChannelId(null);
                  setSelectedProcessorId(processorId);
                }}
              />
            </div>
          </div>

          {/* Right panel - Processor editor */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {selectedProcessorId ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {getSelectedProcessor()?.type.charAt(0).toUpperCase() + getSelectedProcessor()?.type.slice(1)}
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Save size={16} />}
                        onClick={() => setShowPresetManager(true)}
                        className="text-white border-gray-700 hover:bg-gray-800"
                      >
                        Save Preset
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {renderProcessorEditor()}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Select a processor to edit its settings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add VST Plugin Button */}
        <div className="px-4 py-3 border-t border-gray-800">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => setShowVSTBrowser(true)}
            className="text-white border-gray-700 hover:bg-gray-800"
          >
            Add VST Plugin
          </Button>
        </div>
      </div>

      {/* Preset Manager Modal */}
      {showPresetManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md border-4 border-primary">
            <PresetManager
              presets={presets}
              onSelect={handlePresetSelect}
              onSave={handlePresetSave}
              onClose={() => setShowPresetManager(false)}
              selectedProcessor={getSelectedProcessor()?.type}
            />
          </div>
        </div>
      )}

      {/* VST Browser Modal */}
      {showVSTBrowser && (
        <VSTBrowser
          onSelect={handleVSTSelect}
          onClose={() => setShowVSTBrowser(false)}
        />
      )}
    </div>
  );
};

export default AudioMixer;