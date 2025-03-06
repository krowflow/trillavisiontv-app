import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { StreamStatus, TransitionType } from '../../types';
import { Eye, Monitor, Radio, Volume2, VolumeX, ArrowRight, ArrowLeft } from 'lucide-react';
import { VUMeter } from '../audio/VUMeter';
import { audioEngine } from '../../services/audio-engine';
import { Button } from '../ui/Button';

interface StreamPreviewProps {
  isProgramView?: boolean;
}

export const StreamPreview: React.FC<StreamPreviewProps> = ({ isProgramView = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedTransition, setSelectedTransition] = useState<TransitionType>(TransitionType.FADE);
  const [transitionDuration, setTransitionDuration] = useState(300);

  const currentScene = useSelector((state: RootState) => {
    const { scenes, currentSceneId } = state.scenes;
    return scenes.find(scene => scene.id === currentSceneId);
  });

  const streamStatus = useSelector((state: RootState) => state.stream.status);
  const overlays = useSelector((state: RootState) => state.brand.overlays);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Draw preview content
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw scene content if available
      if (currentScene) {
        // Scene background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

        // Scene text
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          isProgramView ? 'Program View' : 'Preview',
          canvas.width / 2,
          canvas.height / 2 - 20
        );
        ctx.font = '18px Arial';
        ctx.fillText(
          `Scene: ${currentScene.name}`,
          canvas.width / 2,
          canvas.height / 2 + 20
        );
      }

      // Draw overlays
      overlays.forEach(overlay => {
        if (!overlay.visible) return;

        const { x, y, width, height } = overlay.position;
        
        ctx.save();
        ctx.translate(x, y);

        // Create overlay container
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, width, height);

        // Add overlay content
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(overlay.content, 10, 25);

        ctx.restore();
      });

      // Draw status indicator
      if (isProgramView && streamStatus === StreamStatus.LIVE) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(10, 10, 80, 30);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('● LIVE', 20, 30);
      }
    };

    // Initial draw
    draw();

    // Set up animation frame for continuous drawing
    let animationFrame: number;
    const animate = () => {
      draw();
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentScene, overlays, isProgramView, streamStatus]);

  // Reset meters when triggered
  useEffect(() => {
    if (resetTrigger > 0) {
      setAudioLevel(0);
      setPeakLevel(0);
    }
  }, [resetTrigger]);

  // Get audio levels from audio engine
  useEffect(() => {
    let animationFrame: number;

    const updateLevels = () => {
      // Only update levels if we have active audio inputs
      const channelId = isProgramView ? 'program' : 'preview';
      const meterData = audioEngine.getChannelMeter(channelId);

      if (meterData && !isMuted) {
        // Calculate RMS level from meter data
        let sum = 0;
        for (let i = 0; i < meterData.length; i++) {
          sum += meterData[i] * meterData[i];
        }
        const rms = Math.sqrt(sum / meterData.length);
        const dbLevel = 20 * Math.log10(rms);
        
        // Convert to 0-1 range
        const normalizedLevel = Math.max(0, Math.min(1, (dbLevel + 60) / 60));
        setAudioLevel(normalizedLevel);

        // Update peak
        if (normalizedLevel > peakLevel) {
          setPeakLevel(normalizedLevel);
        } else {
          setPeakLevel(prev => Math.max(normalizedLevel, prev * 0.95));
        }
      } else {
        // No audio input, set levels to 0
        setAudioLevel(0);
        setPeakLevel(0);
      }

      animationFrame = requestAnimationFrame(updateLevels);
    };

    animationFrame = requestAnimationFrame(updateLevels);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isMuted, isProgramView, peakLevel]);

  // Handle quick transition
  const handleQuickTransition = () => {
    // Transition logic would go here
    console.log('Quick transition:', selectedTransition, transitionDuration);
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-[#8E05C2] bg-gradient-to-b from-[#2A0944] to-[#580F96]">
      {/* Preview label */}
      <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md flex items-center text-sm">
        {isProgramView ? (
          <>
            <Monitor size={16} className="mr-1" />
            <span>Program</span>
          </>
        ) : (
          <>
            <Eye size={16} className="mr-1" />
            <span>Preview</span>
          </>
        )}
      </div>

      {/* Audio meters */}
      <div className="absolute top-2 right-2 z-20 bg-black bg-opacity-70 p-2 rounded-md flex items-center space-x-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:text-primary transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="flex items-center space-x-1">
          <VUMeter
            level={isMuted ? 0 : audioLevel}
            peakLevel={isMuted ? 0 : peakLevel}
            width={20}
            height={100}
          />
          <button
            onClick={() => setResetTrigger(prev => prev + 1)}
            className="text-white hover:text-primary transition-colors p-1 rounded hover:bg-white hover:bg-opacity-10"
            title="Reset Meters"
          >
            <Radio size={12} />
          </button>
        </div>
      </div>

      {/* Canvas for preview content */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Transition Panel */}
      {!isProgramView && (
        <div className="absolute top-1/2 right-0 transform translate-x-[calc(100%)] -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="bg-[#2A0944] rounded-lg p-3 shadow-lg border border-[#8E05C2] space-y-3 w-[80px]">
            {/* Quick Transition Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickTransition}
              className="w-full h-12 rounded-lg bg-[#580F96] bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center group"
              title="Quick Transition"
            >
              <ArrowRight size={20} className="text-white group-hover:scale-110 transition-transform" />
            </Button>
            
            {/* Transition Type Selector */}
            <select
              value={selectedTransition}
              onChange={(e) => setSelectedTransition(e.target.value as TransitionType)}
              className="block w-full text-xs bg-[#580F96] bg-opacity-20 border-0 rounded-lg text-white focus:ring-1 focus:ring-[#8E05C2] py-2 cursor-pointer"
            >
              <option value={TransitionType.FADE}>Fade</option>
              <option value={TransitionType.CUT}>Cut</option>
              <option value={TransitionType.SLIDE}>Slide</option>
              <option value={TransitionType.ZOOM}>Zoom</option>
              <option value={TransitionType.WIPE}>Wipe</option>
            </select>
            
            {/* Duration Slider */}
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={transitionDuration}
              onChange={(e) => setTransitionDuration(parseInt(e.target.value))}
              className="w-full h-1 bg-[#580F96] rounded-lg appearance-none cursor-pointer accent-[#8E05C2]"
            />
            
            {/* Duration Display */}
            <div className="text-xs text-white text-center font-mono">
              {transitionDuration}ms
            </div>
          </div>
          
          {/* Connecting Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#2A0944] via-[#8E05C2] to-[#2A0944] mt-2"></div>
        </div>
      )}
    </div>
  );
};

export default StreamPreview;