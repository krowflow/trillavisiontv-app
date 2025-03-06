import React, { useState, useRef, useEffect } from 'react';
import { DeEsserSettings } from '../../../types';
import { Toggle } from '../../ui/Toggle';
import { Settings, Volume2, VolumeX } from 'lucide-react';

interface DeEsserProcessorProps {
  settings: DeEsserSettings;
  onChange: (settings: Partial<DeEsserSettings>) => void;
  enabled: boolean;
  onToggle: () => void;
}

export const DeEsserProcessor: React.FC<DeEsserProcessorProps> = ({
  settings,
  onChange,
  enabled,
  onToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [mode, setMode] = useState<'wide' | 'focused' | 'precise'>('focused');

  // Draw the de-esser visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up high-quality rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw theme background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#2A0944'); // Primary dark
    bgGradient.addColorStop(1, '#580F96'); // Primary
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      // Frequency grid lines
      [1000, 2000, 4000, 8000, 16000].forEach(freq => {
        const x = Math.log2(freq / 1000) * (canvas.width / 4);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${freq >= 1000 ? `${freq/1000}k` : freq}`, x, canvas.height - 5);
      });

      // Gain grid lines
      [-20, -15, -10, -5, 0].forEach(db => {
        const y = (db + 20) * (canvas.height / 20);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(`${db}dB`, 25, y);
      });
    }

    // Draw frequency response curve
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const freq = Math.pow(2, x / (canvas.width / 4)) * 1000;
      let response = 0;

      // Calculate frequency response based on mode
      const centerFreq = settings.frequency;
      const bandwidth = mode === 'wide' ? 2 : mode === 'focused' ? 1 : 0.5;
      const distance = Math.abs(Math.log2(freq / centerFreq));
      
      if (distance < bandwidth) {
        const factor = Math.pow(Math.cos(distance / bandwidth * Math.PI / 2), 2);
        response = -settings.ratio * factor;
      }

      const y = (response + 20) * (canvas.height / 20);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Create gradient for the curve
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#580F96');
    gradient.addColorStop(0.5, '#8E05C2');
    gradient.addColorStop(1, '#580F96');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw frequency marker
    const markerX = Math.log2(settings.frequency / 1000) * (canvas.width / 4);
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(markerX, 0);
    ctx.lineTo(markerX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [settings, showGrid, mode]);

  return (
    <div className="p-4 bg-gray-900 rounded-lg w-[800px] border-4 border-primary shadow-[0_0_15px_rgba(88,15,150,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">De-esser</h3>
          <p className="text-sm text-gray-400">Professional sibilance control</p>
        </div>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      <div className="mb-4 bg-black rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={700}
          height={300}
          className="w-full h-[300px] rounded"
        />

        <div className="flex justify-between mt-2">
          <div className="flex items-center space-x-4">
            <Toggle
              label="Grid"
              checked={showGrid}
              onChange={setShowGrid}
              size="sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded text-sm ${
                mode === 'wide' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-primary hover:bg-opacity-20'
              }`}
              onClick={() => setMode('wide')}
            >
              Wide
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${
                mode === 'focused' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-primary hover:bg-opacity-20'
              }`}
              onClick={() => setMode('focused')}
            >
              Focused
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${
                mode === 'precise' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-primary hover:bg-opacity-20'
              }`}
              onClick={() => setMode('precise')}
            >
              Precise
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Frequency: <span className="text-primary-light">{settings.frequency} Hz</span>
          </label>
          <input
            type="range"
            min="2000"
            max="16000"
            step="100"
            value={settings.frequency}
            onChange={(e) => onChange({ frequency: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Threshold: <span className="text-primary-light">{settings.threshold} dB</span>
          </label>
          <input
            type="range"
            min="-60"
            max="0"
            step="0.1"
            value={settings.threshold}
            onChange={(e) => onChange({ threshold: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Ratio: <span className="text-primary-light">{settings.ratio}:1</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={settings.ratio}
            onChange={(e) => onChange({ ratio: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              frequency: 6000,
              threshold: -20,
              ratio: 4
            })}
          >
            Gentle
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              frequency: 7500,
              threshold: -15,
              ratio: 8
            })}
          >
            Medium
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              frequency: 8500,
              threshold: -12,
              ratio: 10
            })}
          >
            Aggressive
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeEsserProcessor;