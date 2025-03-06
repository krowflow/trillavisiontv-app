import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  audioData?: number[]; // For testing/demo purposes
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  width = 300,
  height = 100,
  color = '#580F96',
  backgroundColor = '#f9fafb',
  className = '',
  audioData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Generate random audio data for demo purposes
  const generateRandomData = () => {
    const data = [];
    for (let i = 0; i < 100; i++) {
      // Generate a sine wave with some noise
      const value = Math.sin(i / 10) * 0.5 + (Math.random() * 0.3 - 0.15);
      data.push(value);
    }
    return data;
  };

  // Draw the waveform
  const drawWaveform = (data: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    const sliceWidth = canvas.width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const y = (data[i] + 1) / 2 * canvas.height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  };

  // Animate the waveform
  useEffect(() => {
    if (audioData) {
      // If audio data is provided, just draw it
      drawWaveform(audioData);
      return;
    }

    // Otherwise, animate with random data
    const animate = () => {
      const data = generateRandomData();
      drawWaveform(data);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`border border-gray-200 rounded ${className}`}
    />
  );
};

export default AudioVisualizer;