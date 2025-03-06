import React, { useState } from 'react';
import { Preset } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, X, Check, Trash2 } from 'lucide-react';

interface PresetManagerProps {
  presets: Preset[];
  onSelect: (preset: Preset) => void;
  onSave: (name: string, type: 'compressor' | 'limiter' | 'equalizer' | 'gate' | 'deesser' | 'channel' | 'master') => void;
  onClose: () => void;
  selectedProcessor?: string;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  onSelect,
  onSave,
  onClose,
  selectedProcessor
}) => {
  const [mode, setMode] = useState<'browse' | 'save'>('browse');
  const [presetName, setPresetName] = useState('');
  const [presetType, setPresetType] = useState<'compressor' | 'limiter' | 'equalizer' | 'gate' | 'deesser' | 'channel' | 'master'>(
    selectedProcessor as any || 'compressor'
  );

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    onSave(presetName, presetType);
    setPresetName('');
    setMode('browse');
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Presets</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:text-white hover:bg-gray-800"
        >
          <X size={20} />
        </Button>
      </div>

      {mode === 'browse' ? (
        <>
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Save size={16} />}
                onClick={() => setMode('save')}
                className="text-white border-gray-700 hover:bg-gray-800"
                fullWidth
              >
                Save New Preset
              </Button>

              <select
                className="block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                value={selectedProcessor || 'all'}
                onChange={(e) => setPresetType(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="compressor">Compressor</option>
                <option value="limiter">Limiter</option>
                <option value="equalizer">Equalizer</option>
                <option value="gate">Gate</option>
                <option value="deesser">De-esser</option>
                <option value="channel">Channel</option>
                <option value="master">Master</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {presets.map(preset => (
              <div
                key={preset.id}
                className="p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer"
                onClick={() => onSelect(preset)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{preset.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{preset.type}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Check size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(preset);
                    }}
                    className="text-white hover:text-white hover:bg-gray-600"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <Input
            label="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Enter preset name"
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            labelClassName="text-white"
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Preset Type
            </label>
            <select
              className="block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              value={presetType}
              onChange={(e) => setPresetType(e.target.value as any)}
            >
              <option value="compressor">Compressor</option>
              <option value="limiter">Limiter</option>
              <option value="equalizer">Equalizer</option>
              <option value="gate">Gate</option>
              <option value="deesser">De-esser</option>
              <option value="channel">Channel</option>
              <option value="master">Master</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setMode('browse')}
              className="text-white border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="bg-primary hover:bg-primary-light text-white"
            >
              Save Preset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetManager;