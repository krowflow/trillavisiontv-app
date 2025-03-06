import React, { useState, useRef, useEffect } from 'react';
import { LimiterSettings } from '../../../types';
import { Toggle } from '../../ui/Toggle';
import { Settings, Volume2, VolumeX } from 'lucide-react';

interface LimiterProcessorProps {
  settings: LimiterSettings;
  onChange: (settings: Partial<LimiterSettings>) => void;
  enabled: boolean;
  onToggle: () => void;
}

export const LimiterProcessor: React.FC<LimiterProcessorProps> = ({
  settings,
  onChange,
  enabled,
  onToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [mode, setMode] = useState<'fast' | 'balanced' | 'smooth'>('balanced');

  // Draw the limiter visualization
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

    // Draw limiter curve
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const inputDb = (x / canvas.width * 60) - 60;
      let outputDb = inputDb;

      if (inputDb > settings.threshold) {
        // Apply limiting based on mode
        const excess = inputDb - settings.threshold;
        switch (mode) {
          case 'fast':
            outputDb = settings.threshold + excess * 0.1;
            break;
          case 'smooth':
            outputDb = settings.threshold + excess * Math.exp(-excess * 0.1);
            break;
          default: // balanced
            outputDb = settings.threshold + excess * 0.05;
        }
      }

      const y = (outputDb + 60) * (canvas.height / 60);
      if (x === 0) {
        ctx.moveTo(x, canvas.height - y);
      } else {
        ctx.lineTo(x, canvas.height - y);
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
          <h3 className="text-lg font-semibold text-white">Limiter</h3>
          <p className="text-sm text-gray-400">Professional peak limiting</p>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Threshold: <span className="text-primary-light">{settings.threshold.toFixed(1)} dB</span>
          </label>
          <input
            type="range"
            min="-20"
            max="0"
            step="0.1"
            value={settings.threshold}
            onChange={(e) => onChange({ threshold: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Release: <span className="text-primary-light">{settings.release.toFixed(0)} ms</span>
          </label>
          <input
            type="range"
            min="1"
            max="500"
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
              threshold: -3,
              release: 50
            })}
          >
            Broadcast
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -1,
              release: 20
            })}
          >
            Aggressive
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -6,
              release: 100
            })}
          >
            Gentle
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimiterProcessor;