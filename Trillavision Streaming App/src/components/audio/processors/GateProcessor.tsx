import React, { useState, useRef, useEffect } from 'react';
import { GateSettings } from '../../../types';
import { Toggle } from '../../ui/Toggle';
import { Settings, Volume2, VolumeX } from 'lucide-react';

interface GateProcessorProps {
  settings: GateSettings;
  onChange: (settings: Partial<GateSettings>) => void;
  enabled: boolean;
  onToggle: () => void;
}

export const GateProcessor: React.FC<GateProcessorProps> = ({
  settings,
  onChange,
  enabled,
  onToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [mode, setMode] = useState<'fast' | 'balanced' | 'smooth'>('balanced');

  // Draw the gate visualization
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
      // Vertical grid lines (input levels)
      [-60, -48, -36, -24, -12, 0].forEach(db => {
        const x = (db + 60) * (canvas.width / 60);
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
        ctx.fillText(`${db}`, x, canvas.height - 5);
      });

      // Horizontal grid lines (output levels)
      [-60, -48, -36, -24, -12, 0].forEach(db => {
        const y = (db + 60) * (canvas.height / 60);
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

    // Draw gate curve
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let x = 0; x < canvas.width; x++) {
      const inputDb = (x / canvas.width * 60) - 60;
      let outputDb = -60;

      if (inputDb > settings.threshold) {
        // Apply attack/release curve based on mode
        const distance = inputDb - settings.threshold;
        let factor = 1;
        
        switch (mode) {
          case 'fast':
            factor = Math.pow(distance / 20, 0.5);
            break;
          case 'smooth':
            factor = Math.pow(distance / 20, 2);
            break;
          default: // balanced
            factor = distance / 20;
        }

        outputDb = inputDb * factor;
      }

      const y = (outputDb + 60) * (canvas.height / 60);
      ctx.lineTo(x, canvas.height - y);
    }

    // Create gradient for the curve
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#580F96');
    gradient.addColorStop(0.5, '#8E05C2');
    gradient.addColorStop(1, '#580F96');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw threshold line
    const thresholdX = (settings.threshold + 60) * (canvas.width / 60);
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(thresholdX, 0);
    ctx.lineTo(thresholdX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [settings, showGrid, mode]);

  return (
    <div className="p-4 bg-gray-900 rounded-lg w-[800px] border-4 border-primary shadow-[0_0_15px_rgba(88,15,150,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Noise Gate</h3>
          <p className="text-sm text-gray-400">Professional noise reduction</p>
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
                mode === 'fast' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-primary hover:bg-opacity-20'
              }`}
              onClick={() => setMode('fast')}
            >
              Fast
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${
                mode === 'balanced' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-primary hover:bg-opacity-20'
              }`}
              onClick={() => setMode('balanced')}
            >
              Balanced
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${
                mode === 'smooth' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-primary hover:bg-opacity-20'
              }`}
              onClick={() => setMode('smooth')}
            >
              Smooth
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
            Attack: <span className="text-primary-light">{settings.attack} ms</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={settings.attack}
            onChange={(e) => onChange({ attack: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Release: <span className="text-primary-light">{settings.release} ms</span>
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="1"
            value={settings.release}
            onChange={(e) => onChange({ release: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -50,
              attack: 10,
              release: 100
            })}
          >
            Podcast
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -40,
              attack: 5,
              release: 50
            })}
          >
            Aggressive
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -60,
              attack: 20,
              release: 200
            })}
          >
            Gentle
          </button>
        </div>
      </div>
    </div>
  );
};

export default GateProcessor;