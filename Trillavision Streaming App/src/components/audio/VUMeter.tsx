import React, { useEffect, useRef } from 'react';

interface VUMeterProps {
  level: number; // 0-1
  peakLevel?: number; // 0-1
  width?: number;
  height?: number;
  className?: string;
}

export const VUMeter: React.FC<VUMeterProps> = ({
  level,
  peakLevel,
  width = 30,
  height = 200,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastLevelRef = useRef(0);
  const lastPeakRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, height);

      // Draw level markings and dB numbers
      const dbMarks = [0, -3, -6, -12, -18, -24, -30, -36, -42, -48, -60];
      dbMarks.forEach(db => {
        const y = height * (1 - (db + 60) / 60);
        
        // Draw marker line
        ctx.fillStyle = db === 0 ? '#ff4444' : '#333333';
        ctx.fillRect(0, y, width, 1);
      });

      // Smoothly interpolate level
      const targetLevel = level;
      const currentLevel = lastLevelRef.current;
      const smoothLevel = currentLevel + (targetLevel - currentLevel) * 0.3;
      lastLevelRef.current = smoothLevel;

      // Calculate meter height
      const meterHeight = height * smoothLevel;

      // Create gradient for meter
      const gradient = ctx.createLinearGradient(0, height, 0, height - meterHeight);
      gradient.addColorStop(0, '#580F96'); // Primary color for lower levels
      gradient.addColorStop(0.6, '#8E05C2'); // Brighter purple for mid levels
      gradient.addColorStop(0.8, '#f59e0b'); // Yellow for high levels
      gradient.addColorStop(1, '#ef4444'); // Red for peaks

      // Draw meter
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - meterHeight, width, meterHeight);

      // Draw peak indicator
      if (peakLevel !== undefined) {
        // Smoothly interpolate peak
        const targetPeak = peakLevel;
        const currentPeak = lastPeakRef.current;
        const smoothPeak = currentPeak + (targetPeak - currentPeak) * 0.1;
        lastPeakRef.current = smoothPeak;

        const peakY = height - (height * smoothPeak);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, peakY - 1, width, 2);
      }

      // Add segment lines
      const segments = 20;
      const segmentHeight = height / segments;
      for (let i = 0; i < segments; i++) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, i * segmentHeight, width, 1);
      }

      // Add glow effect for high levels
      if (smoothLevel > 0.8) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(0, height - meterHeight, width, meterHeight);
      }

      // Request next frame
      frameRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    frameRef.current = requestAnimationFrame(draw);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [level, peakLevel, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`rounded ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      />
      
      {/* dB scale overlay */}
      <div className="absolute left-full top-0 bottom-0 pl-1 flex flex-col justify-between text-[10px] text-gray-400 pointer-events-none">
        {[0, -12, -24, -36, -48, -60].map(db => (
          <div key={db} style={{ transform: 'translateY(50%)' }}>
            {db}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VUMeter;