import React, { useState, useRef, useEffect } from 'react';
import { AudioChannel, AudioProcessorType } from '../../types';
import { Mic, Volume2, VolumeX, Sliders, AudioWaveform as Waveform, Activity, Equal as Equalizer, Filter, RotateCcw } from 'lucide-react';
import { VUMeter } from './VUMeter';

interface ChannelStripProps {
  channel: AudioChannel;
  onGainChange: (gain: number) => void;
  onMuteToggle: () => void;
  onProcessorSelect: (processorId: string) => void;
  isSelected: boolean;
}

export const ChannelStrip: React.FC<ChannelStripProps> = ({
  channel,
  onGainChange,
  onMuteToggle,
  onProcessorSelect,
  isSelected
}) => {
  const [level, setLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const levelRef = useRef<number>(0);
  const peakRef = useRef<number>(0);
  const frameRef = useRef<number>();
  const faderRef = useRef<HTMLDivElement>(null);
  const muteControlRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuteDragging, setIsMuteDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startGain, setStartGain] = useState(0);
  const [showResetControls, setShowResetControls] = useState(false);

  // Default gain value for reset
  const DEFAULT_GAIN = 75;

  // Reset meters
  const resetMeters = () => {
    levelRef.current = 0;
    peakRef.current = 0;
    setLevel(0);
    setPeakLevel(0);
  };

  // Reset fader to default position
  const resetFader = () => {
    onGainChange(DEFAULT_GAIN);
  };

  // Reset all controls
  const resetAll = () => {
    resetMeters();
    resetFader();
  };

  // Simulate audio levels
  useEffect(() => {
    const updateLevels = () => {
      // Simulate VU meter movement based on gain
      const targetLevel = channel.muted ? 0 : (channel.gain / 100) * 0.8;
      const currentLevel = levelRef.current;
      
      // Smooth level changes
      const newLevel = currentLevel + (targetLevel - currentLevel) * 0.1;
      levelRef.current = newLevel;
      setLevel(newLevel);

      // Update peak level
      if (newLevel > peakRef.current) {
        peakRef.current = newLevel;
        setPeakLevel(newLevel);
      } else {
        // Peak falloff
        peakRef.current = Math.max(newLevel, peakRef.current * 0.99);
        setPeakLevel(peakRef.current);
      }

      frameRef.current = requestAnimationFrame(updateLevels);
    };

    frameRef.current = requestAnimationFrame(updateLevels);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [channel.gain, channel.muted]);

  // Fader drag handlers
  const handleFaderMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartGain(channel.gain);
  };

  // Mute control drag handlers
  const handleMuteMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMuteDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaY = startY - e.clientY;
      const gainChange = (deltaY / 200) * 100; // 200px = full range
      const newGain = Math.max(0, Math.min(100, startGain + gainChange));
      onGainChange(newGain);
    } else if (isMuteDragging) {
      const deltaY = Math.abs(e.clientY - startY);
      if (deltaY > 10) { // Add some threshold before toggling
        onMuteToggle();
        setIsMuteDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsMuteDragging(false);
  };

  useEffect(() => {
    if (isDragging || isMuteDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMuteDragging, startY, startGain]);

  return (
    <div className={`w-40 flex flex-col ${isSelected ? 'bg-gray-900' : ''}`}>
      {/* Channel name */}
      <div className="w-full text-center py-2">
        <div className="flex justify-center mb-1">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <Mic size={20} />
          </div>
        </div>
        <div className="text-sm font-medium text-white truncate px-2">{channel.name}</div>
      </div>
      
      {/* VU Meter */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-4 relative">
        <div 
          className="absolute top-0 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseEnter={() => setShowResetControls(true)}
          onMouseLeave={() => setShowResetControls(false)}
        >
          <button
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
            onClick={resetMeters}
            title="Reset Meters"
          >
            <RotateCcw size={12} />
          </button>
        </div>
        
        <div className="flex items-center">
          <VUMeter
            level={level}
            peakLevel={peakLevel}
            width={30}
            height={200}
            className="bg-gray-900 rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      {/* Fader */}
      <div className="w-full px-4 py-4 relative">
        <div className="relative h-40">
          {/* Fader track */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gray-800 rounded-full">
            {/* Level markers */}
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className="absolute w-3 h-0.5 bg-gray-600 left-1/2 transform -translate-x-1/2"
                style={{ bottom: `${mark}%` }}
              />
            ))}
          </div>

          {/* Fader handle */}
          <div
            ref={faderRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 cursor-pointer"
            style={{ bottom: `${channel.gain}%` }}
            onMouseDown={handleFaderMouseDown}
            onDoubleClick={resetFader}
          >
            <div className="w-full h-full relative">
              {/* Fader cap */}
              <div className="absolute inset-0 bg-primary rounded-lg shadow-lg border-2 border-gray-700">
                {/* Fader grip lines */}
                <div className="absolute inset-0 flex flex-col justify-center items-center space-y-1">
                  <div className="w-4 h-0.5 bg-gray-300 rounded"></div>
                  <div className="w-4 h-0.5 bg-gray-300 rounded"></div>
                  <div className="w-4 h-0.5 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Gain value */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-white">
            {channel.gain.toFixed(1)}
          </div>

          {/* Reset button */}
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
            <button
              className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
              onClick={resetFader}
              title="Reset Fader"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Processors */}
      <div className="w-full px-4 mb-2">
        <div className="text-xs text-gray-400 mb-1 text-center">Processors</div>
        <div className="grid grid-cols-2 gap-1">
          {channel.processors.map(processor => (
            <button
              key={processor.id}
              className={`p-2 rounded flex items-center justify-center ${
                processor.enabled ? 'bg-primary text-white' : 'bg-gray-800 text-gray-500'
              }`}
              onClick={() => onProcessorSelect(processor.id)}
              title={`${processor.type.charAt(0).toUpperCase() + processor.type.slice(1)} ${processor.enabled ? '(Enabled)' : '(Disabled)'}`}
            >
              {processor.type === AudioProcessorType.COMPRESSOR && <Activity size={16} />}
              {processor.type === AudioProcessorType.EQUALIZER && <Equalizer size={16} />}
              {processor.type === AudioProcessorType.GATE && <Filter size={16} />}
              {processor.type === AudioProcessorType.LIMITER && <Waveform size={16} />}
              {processor.type === AudioProcessorType.DEESSER && <Sliders size={16} />}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mute button with control lever */}
      <div className="w-full px-4 py-2 border-t border-gray-800">
        <div className="relative">
          {/* Mute control lever */}
          <div 
            ref={muteControlRef}
            className={`absolute left-1/2 -top-6 transform -translate-x-1/2 w-8 h-12 cursor-pointer ${
              channel.muted ? 'translate-y-1' : ''
            } transition-transform duration-100`}
            onMouseDown={handleMuteMouseDown}
          >
            {/* Lever handle */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-gray-600 rounded-t"></div>
            {/* Lever base */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-600 rounded"></div>
          </div>

          {/* Mute button */}
          <button
            className={`w-full p-2 rounded flex items-center justify-center relative ${
              channel.muted ? 'bg-red-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            onClick={onMuteToggle}
          >
            {channel.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelStrip;