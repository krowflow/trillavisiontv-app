import React, { useState, useRef, useEffect } from 'react';
import { CompressorSettings } from '../../../types';
import { Toggle } from '../../ui/Toggle';
import { Settings, AudioWaveform as Waveform } from 'lucide-react';

interface CompressorProcessorProps {
  settings: CompressorSettings;
  onChange: (settings: Partial<CompressorSettings>) => void;
  enabled: boolean;
  onToggle: () => void;
}

export const CompressorProcessor: React.FC<CompressorProcessorProps> = ({
  settings,
  onChange,
  enabled,
  onToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [mode, setMode] = useState<'balanced' | 'sharp' | 'smooth'>('balanced');

  // Draw the compression curve
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

    // Draw grid
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
        ctx.textBaseline = 'middle';
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
        const labelPadding = 25;
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'right';
        ctx.fillText(`${db}dB`, labelPadding - 5, y);
      });
    }

    // Draw 1:1 line
    ctx.beginPath();
    ctx.strokeStyle = '#444444';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw compression curve
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const inputDb = (x / canvas.width * 60) - 60;
      let outputDb = inputDb;

      if (inputDb > settings.threshold) {
        outputDb = settings.threshold + (inputDb - settings.threshold) / settings.ratio;
      }

      // Apply knee smoothing
      if (Math.abs(inputDb - settings.threshold) < settings.knee / 2) {
        const kneeStart = settings.threshold - settings.knee / 2;
        const kneeEnd = settings.threshold + settings.knee / 2;
        const t = (inputDb - kneeStart) / (kneeEnd - kneeStart);
        const smoothing = mode === 'smooth' ? 0.8 : mode === 'sharp' ? 0.2 : 0.5;
        outputDb = inputDb + (outputDb - inputDb) * Math.pow(t, smoothing);
      }

      // Apply makeup gain
      outputDb += settings.makeupGain;

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
    <div className="p-4 bg-gray-900 rounded-lg w-[700px] border-4 border-primary shadow-[0_0_15px_rgba(88,15,150,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Compressor</h3>
          <p className="text-sm text-gray-400">Professional dynamic processor</p>
        </div>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      <div className="mb-4 bg-black rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-[200px] rounded"
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
                mode === 'sharp' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-primary hover:bg-opacity-20'
              }`}
              onClick={() => setMode('sharp')}
            >
              Sharp
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

      <div className="grid grid-cols-3 gap-3">
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

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Knee: <span className="text-primary-light">{settings.knee} dB</span>
          </label>
          <input
            type="range"
            min="0"
            max="40"
            step="0.1"
            value={settings.knee}
            onChange={(e) => onChange({ knee: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Makeup: <span className="text-primary-light">{settings.makeupGain} dB</span>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={settings.makeupGain}
            onChange={(e) => onChange({ makeupGain: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-3">
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -24,
              ratio: 4,
              attack: 10,
              release: 100,
              knee: 10,
              makeupGain: 6
            })}
          >
            Vocal
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -30,
              ratio: 10,
              attack: 5,
              release: 50,
              knee: 5,
              makeupGain: 8
            })}
          >
            Shure SM7B
          </button>
          <button
            className="px-3 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30"
            onClick={() => onChange({
              threshold: -18,
              ratio: 2,
              attack: 20,
              release: 150,
              knee: 15,
              makeupGain: 3
            })}
          >
            Gentle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompressorProcessor;