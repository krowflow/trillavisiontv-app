import React, { useState, useRef, useEffect } from 'react';
import { EqualizerSettings, EQBand } from '../../../types';
import { Toggle } from '../../ui/Toggle';
import { Plus, Trash2 } from 'lucide-react';

interface EqualizerProcessorProps {
  settings: EqualizerSettings;
  onChange: (settings: Partial<EqualizerSettings>) => void;
  enabled: boolean;
  onToggle: () => void;
}

export const EqualizerProcessor: React.FC<EqualizerProcessorProps> = ({
  settings,
  onChange,
  enabled,
  onToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBandId, setSelectedBandId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showFrequencyLabels, setShowFrequencyLabels] = useState(true);
  const [showBandLabels, setShowBandLabels] = useState(true);

  // Draw the EQ curve
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
      // Vertical grid lines (frequencies)
      const frequencies = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
      frequencies.forEach(freq => {
        const x = freqToX(freq, canvas.width);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        if (showFrequencyLabels) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Inter';
          ctx.textBaseline = 'middle';
          const labelWidth = ctx.measureText(formatFreq(freq)).width;
          const labelX = Math.min(
            Math.max(x, labelWidth / 2 + 5),
            canvas.width - labelWidth / 2 - 5
          );
          ctx.fillText(formatFreq(freq), labelX, canvas.height - 5);
        }
      });

      // Horizontal grid lines (gain)
      [-12, -9, -6, -3, 0, 3, 6, 9, 12].forEach(db => {
        const y = gainToY(db, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(`${db}dB`, 25, y + 4);
      });
    }

    // Draw EQ curve
    if (settings.bands.length > 0) {
      ctx.beginPath();
      ctx.moveTo(0, gainToY(calculateTotalGain(20), canvas.height));

      for (let x = 0; x < canvas.width; x++) {
        const freq = xToFreq(x, canvas.width);
        const gain = calculateTotalGain(freq);
        ctx.lineTo(x, gainToY(gain, canvas.height));
      }

      // Create gradient for the curve
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#580F96');
      gradient.addColorStop(1, '#2A0944');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw band points
    settings.bands.forEach(band => {
      const x = freqToX(band.frequency, canvas.width);
      const y = gainToY(band.gain, canvas.height);

      // Draw band point
      ctx.beginPath();
      ctx.arc(x, y, band.id === selectedBandId ? 8 : 6, 0, Math.PI * 2);
      ctx.fillStyle = band.id === selectedBandId ? '#8E05C2' : '#580F96';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw band label if enabled
      if (showBandLabels) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        
        const labelY = y - 15;
        if (labelY > 15) { // Only show if there's room
          ctx.fillText(`${formatFreq(band.frequency)}`, x, labelY);
          ctx.fillText(`${band.gain.toFixed(1)}dB`, x, y + 20);
        }
      }
    });
  }, [settings, selectedBandId, showGrid, showFrequencyLabels, showBandLabels]);

  // Utility functions
  const freqToX = (freq: number, width: number): number => {
    const minFreq = Math.log10(20);
    const maxFreq = Math.log10(20000);
    const x = (Math.log10(freq) - minFreq) / (maxFreq - minFreq);
    return x * width;
  };

  const xToFreq = (x: number, width: number): number => {
    const minFreq = Math.log10(20);
    const maxFreq = Math.log10(20000);
    const freq = Math.pow(10, minFreq + (x / width) * (maxFreq - minFreq));
    return freq;
  };

  const gainToY = (gain: number, height: number): number => {
    const minGain = -12;
    const maxGain = 12;
    const y = (1 - (gain - minGain) / (maxGain - minGain)) * height;
    return y;
  };

  const yToGain = (y: number, height: number): number => {
    const minGain = -12;
    const maxGain = 12;
    const gain = minGain + (1 - y / height) * (maxGain - minGain);
    return gain;
  };

  const formatFreq = (freq: number): string => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(0)}k`;
    }
    return freq.toString();
  };

  const calculateTotalGain = (freq: number): number => {
    return settings.bands.reduce((total, band) => {
      const response = calculateBandResponse(band, freq);
      return total + response;
    }, 0);
  };

  const calculateBandResponse = (band: EQBand, freq: number): number => {
    const f0 = band.frequency;
    const gain = band.gain;
    const Q = band.Q;

    const w0 = 2 * Math.PI * f0;
    const alpha = Math.sin(w0) / (2 * Q);

    switch (band.type) {
      case 'peaking':
        const factor = Math.pow(freq / f0, 2);
        return gain / (1 + Q * Math.abs(1 - factor));
      case 'lowshelf':
        return freq < f0 ? gain : gain * Math.exp(-Math.pow(Math.log(freq / f0), 2) * Q);
      case 'highshelf':
        return freq > f0 ? gain : gain * Math.exp(-Math.pow(Math.log(f0 / freq), 2) * Q);
      default:
        return 0;
    }
  };

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a band point
    for (const band of settings.bands) {
      const bandX = freqToX(band.frequency, canvas.width);
      const bandY = gainToY(band.gain, canvas.height);
      const distance = Math.sqrt(Math.pow(x - bandX, 2) + Math.pow(y - bandY, 2));

      if (distance <= 8) {
        setSelectedBandId(band.id);
        setIsDragging(true);
        return;
      }
    }

    // Create new band
    const newBand: EQBand = {
      id: `band-${Date.now()}`,
      frequency: xToFreq(x, canvas.width),
      gain: yToGain(y, canvas.height),
      Q: 1,
      type: 'peaking'
    };

    onChange({
      bands: [...settings.bands, newBand]
    });

    setSelectedBandId(newBand.id);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedBandId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onChange({
      bands: settings.bands.map(band =>
        band.id === selectedBandId
          ? {
              ...band,
              frequency: Math.max(20, Math.min(20000, xToFreq(x, canvas.width))),
              gain: Math.max(-12, Math.min(12, yToGain(y, canvas.height)))
            }
          : band
      )
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg w-[700px] border-4 border-primary shadow-[0_0_15px_rgba(88,15,150,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Equalizer</h3>
          <p className="text-sm text-gray-400">Professional 8-band parametric EQ</p>
        </div>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      <div className="mb-4 bg-black rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-[200px] rounded"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
        </div>
      </div>

      {selectedBandId && (
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Edit Band</h4>
            <button
              className="text-red-500 hover:text-red-400"
              onClick={() => {
                onChange({
                  bands: settings.bands.filter(band => band.id !== selectedBandId)
                });
                setSelectedBandId(null);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Frequency: <span className="text-primary-light">
                  {settings.bands.find(b => b.id === selectedBandId)?.frequency.toFixed(0)} Hz
                </span>
              </label>
              <input
                type="range"
                min={20}
                max={20000}
                step={1}
                value={settings.bands.find(b => b.id === selectedBandId)?.frequency}
                onChange={(e) => {
                  onChange({
                    bands: settings.bands.map(band =>
                      band.id === selectedBandId
                        ? { ...band, frequency: parseFloat(e.target.value) }
                        : band
                    )
                  });
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Gain: <span className="text-primary-light">
                  {settings.bands.find(b => b.id === selectedBandId)?.gain.toFixed(1)} dB
                </span>
              </label>
              <input
                type="range"
                min={-12}
                max={12}
                step={0.1}
                value={settings.bands.find(b => b.id === selectedBandId)?.gain}
                onChange={(e) => {
                  onChange({
                    bands: settings.bands.map(band =>
                      band.id === selectedBandId
                        ? { ...band, gain: parseFloat(e.target.value) }
                        : band
                    )
                  });
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Q: <span className="text-primary-light">
                  {settings.bands.find(b => b.id === selectedBandId)?.Q.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={settings.bands.find(b => b.id === selectedBandId)?.Q}
                onChange={(e) => {
                  onChange({
                    bands: settings.bands.map(band =>
                      band.id === selectedBandId
                        ? { ...band, Q: parseFloat(e.target.value) }
                        : band
                    )
                  });
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Type
              </label>
              <select
                value={settings.bands.find(b => b.id === selectedBandId)?.type}
                onChange={(e) => {
                  onChange({
                    bands: settings.bands.map(band =>
                      band.id === selectedBandId
                        ? { ...band, type: e.target.value as any }
                        : band
                    )
                  });
                }}
                className="w-full bg-gray-700 text-white border-gray-600 rounded focus:ring-primary focus:border-primary"
              >
                <option value="peaking">Peaking</option>
                <option value="lowshelf">Low Shelf</option>
                <option value="highshelf">High Shelf</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-primary bg-opacity-20 rounded text-white text-sm hover:bg-opacity-30 flex items-center"
            onClick={() => {
              const newBand: EQBand = {
                id: `band-${Date.now()}`,
                frequency: 1000,
                gain: 0,
                Q: 1,
                type: 'peaking'
              };
              onChange({
                bands: [...settings.bands, newBand]
              });
              setSelectedBandId(newBand.id);
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Band
          </button>
          <span className="text-gray-400 text-sm">
            {settings.bands.length} bands
          </span>
        </div>
      </div>
    </div>
  );
};

export default EqualizerProcessor;