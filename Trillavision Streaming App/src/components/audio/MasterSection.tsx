import React from 'react';
import { AudioProcessor, AudioProcessorType } from '../../types';
import { Volume2, Sliders, AudioWaveform as Waveform } from 'lucide-react';
import { VUMeter } from './VUMeter';

interface MasterSectionProps {
  gain: number;
  onGainChange: (gain: number) => void;
  processors: AudioProcessor[];
  onProcessorSelect: (processorId: string) => void;
}

export const MasterSection: React.FC<MasterSectionProps> = ({
  gain,
  onGainChange,
  processors,
  onProcessorSelect
}) => {
  // Get processor status class
  const getProcessorStatusClass = (processorId: string) => {
    const processor = processors.find(p => p.id === processorId);
    return processor?.enabled ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600';
  };

  return (
    <div className="w-40 flex flex-col items-center border-l border-gray-800 pl-4">
      {/* Master label */}
      <div className="w-full text-center py-2">
        <div className="flex justify-center mb-1">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
            <Volume2 size={20} />
          </div>
        </div>
        <div className="text-sm font-medium">Master</div>
      </div>

      {/* VU Meter */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-4">
        <VUMeter
          level={gain / 100}
          peakLevel={gain / 100}
          width={20}
          height={200}
          className="bg-gray-900 rounded-lg shadow-lg"
        />
      </div>

      {/* Fader */}
      <div className="w-full px-4 py-4">
        <div className="h-40 w-6 bg-gray-900 rounded-full relative mb-2 shadow-inner">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 to-red-600 rounded-full transition-all duration-150"
            style={{ height: `${gain}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={gain}
            onChange={(e) => onGainChange(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="text-xs font-mono text-center">{gain}</div>
      </div>

      {/* Processors */}
      <div className="w-full px-4 mb-2">
        <div className="text-xs text-gray-500 mb-1 text-center">Processors</div>
        <div className="grid grid-cols-2 gap-1">
          {processors.map(processor => (
            <button
              key={processor.id}
              className={`p-2 rounded flex items-center justify-center ${getProcessorStatusClass(processor.id)}`}
              onClick={() => onProcessorSelect(processor.id)}
              title={`${processor.type.charAt(0).toUpperCase() + processor.type.slice(1)} ${processor.enabled ? '(Enabled)' : '(Disabled)'}`}
            >
              {processor.type === AudioProcessorType.LIMITER ? <Waveform size={16} /> : <Sliders size={16} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterSection;