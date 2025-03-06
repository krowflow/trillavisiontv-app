import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { OverlayPositioner } from './OverlayPositioner';
import { Button } from '../ui/Button';
import { Grid, Maximize, Minimize, Layers } from 'lucide-react';

export const OverlayPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlays = useSelector((state: RootState) => state.brand.overlays);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden"
      >
        {/* Preview background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-primary-light opacity-20" />
        
        {/* Grid overlay for positioning */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-12 grid-rows-6">
              {Array.from({ length: 12 * 6 }).map((_, i) => (
                <div key={i} className="border border-white border-opacity-10"></div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1/2 h-1/2 border-2 border-dashed border-white border-opacity-20"></div>
            </div>
          </div>
        )}

        {/* Overlays */}
        {overlays.filter(overlay => overlay.visible).map(overlay => (
          <OverlayPositioner
            key={overlay.id}
            overlay={overlay}
            containerRef={containerRef}
          />
        ))}
      </div>
      
      {/* Controls */}
      <div className="absolute top-2 right-2 flex space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 h-8 w-8 p-0 rounded-full"
          onClick={toggleGrid}
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <Grid size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 h-8 w-8 p-0 rounded-full"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </Button>
      </div>
      
      {/* Overlay count */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center">
        <Layers size={12} className="mr-1" />
        <span>{overlays.filter(overlay => overlay.visible).length} overlays</span>
      </div>
    </div>
  );
};

export default OverlayPreview;