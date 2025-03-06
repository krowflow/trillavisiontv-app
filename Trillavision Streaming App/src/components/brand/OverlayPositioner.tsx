import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateOverlay } from '../../store/slices/brandSlice';
import { Overlay } from '../../types';
import { Button } from '../ui/Button';
import { Move, Maximize2, Lock, Unlock, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { logger, LogCategory } from '../../utils/logging';

interface OverlayPositionerProps {
  overlay: Overlay;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const OverlayPositioner: React.FC<OverlayPositionerProps> = ({
  overlay,
  containerRef
}) => {
  const dispatch = useDispatch();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [showPrecisionControls, setShowPrecisionControls] = useState(false);

  // Initialize position and size
  useEffect(() => {
    if (containerRef.current && overlayRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const overlayEl = overlayRef.current;

      // Center overlay if no position is set
      if (!overlay.position.x && !overlay.position.y) {
        const x = (container.width - overlayEl.offsetWidth) / 2;
        const y = (container.height - overlayEl.offsetHeight) / 2;

        dispatch(updateOverlay({
          ...overlay,
          position: {
            ...overlay.position,
            x,
            y
          }
        }));
      }
    }
  }, [overlay, containerRef, dispatch]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;

    setIsDragging(true);
    setStartPos({
      x: e.clientX - overlay.position.x,
      y: e.clientY - overlay.position.y
    });

    logger.debug(LogCategory.UI, 'Started dragging overlay', {
      overlayId: overlay.id,
      startPos: { x: e.clientX, y: e.clientY }
    });
  };

  // Handle mouse down for resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    e.stopPropagation();

    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({
      width: overlay.position.width,
      height: overlay.position.height
    });

    logger.debug(LogCategory.UI, 'Started resizing overlay', {
      overlayId: overlay.id,
      startSize: { width: overlay.position.width, height: overlay.position.height }
    });
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();

      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - startPos.x, container.width - overlay.position.width));
        const newY = Math.max(0, Math.min(e.clientY - startPos.y, container.height - overlay.position.height));

        dispatch(updateOverlay({
          ...overlay,
          position: {
            ...overlay.position,
            x: newX,
            y: newY
          }
        }));
      } else if (isResizing) {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        const newWidth = Math.max(50, Math.min(startSize.width + deltaX, container.width - overlay.position.x));
        const newHeight = Math.max(50, Math.min(startSize.height + deltaY, container.height - overlay.position.y));

        dispatch(updateOverlay({
          ...overlay,
          position: {
            ...overlay.position,
            width: newWidth,
            height: newHeight
          }
        }));
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        logger.debug(LogCategory.UI, `Finished ${isDragging ? 'dragging' : 'resizing'} overlay`, {
          overlayId: overlay.id,
          position: overlay.position
        });
      }

      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startPos, startSize, overlay, containerRef, dispatch]);

  // Precision movement handlers
  const movePrecise = (direction: 'up' | 'down' | 'left' | 'right', amount: number = 1) => {
    if (isLocked) return;
    
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    
    let { x, y } = overlay.position;
    
    switch (direction) {
      case 'up':
        y = Math.max(0, y - amount);
        break;
      case 'down':
        y = Math.min(container.height - overlay.position.height, y + amount);
        break;
      case 'left':
        x = Math.max(0, x - amount);
        break;
      case 'right':
        x = Math.min(container.width - overlay.position.width, x + amount);
        break;
    }
    
    dispatch(updateOverlay({
      ...overlay,
      position: {
        ...overlay.position,
        x,
        y
      }
    }));
  };

  // Precision resize handlers
  const resizePrecise = (dimension: 'width' | 'height', amount: number = 1) => {
    if (isLocked) return;
    
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    
    let { width, height } = overlay.position;
    
    if (dimension === 'width') {
      width = Math.max(50, Math.min(width + amount, container.width - overlay.position.x));
    } else {
      height = Math.max(50, Math.min(height + amount, container.height - overlay.position.y));
    }
    
    dispatch(updateOverlay({
      ...overlay,
      position: {
        ...overlay.position,
        width,
        height
      }
    }));
  };

  return (
    <div
      ref={overlayRef}
      className={`absolute ${isLocked ? '' : 'cursor-move'}`}
      style={{
        left: overlay.position.x,
        top: overlay.position.y,
        width: overlay.position.width,
        height: overlay.position.height,
        border: '2px solid',
        borderColor: isLocked ? 'transparent' : '#580F96',
        borderRadius: '4px',
        backgroundColor: 'rgba(88, 15, 150, 0.1)'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Overlay content */}
      <div className="w-full h-full overflow-hidden">
        {overlay.content}
      </div>

      {/* Controls */}
      {!isLocked && (
        <>
          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          >
            <Maximize2 size={16} className="text-white" />
          </div>

          {/* Position indicator */}
          <div className="absolute top-0 left-0 bg-primary text-white text-xs px-1 py-0.5 rounded-br flex items-center">
            <Move size={12} className="mr-1" />
            <span>{Math.round(overlay.position.x)}, {Math.round(overlay.position.y)}</span>
          </div>
          
          {/* Precision controls toggle */}
          <div className="absolute top-0 right-8 bg-primary text-white text-xs px-1 py-0.5 rounded-bl">
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-white"
              onClick={() => setShowPrecisionControls(!showPrecisionControls)}
              title="Precision Controls"
            >
              <Move size={12} />
            </Button>
          </div>
          
          {/* Precision controls panel */}
          {showPrecisionControls && (
            <div className="absolute top-6 right-0 bg-white border border-gray-200 rounded shadow-md p-2 z-10">
              <div className="text-xs font-medium mb-1 text-gray-700">Position</div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                  onClick={() => movePrecise('left', 10)}
                  title="Move Left 10px"
                >
                  <ArrowLeft size={12} />
                </Button>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={() => movePrecise('up', 10)}
                    title="Move Up 10px"
                  >
                    <ArrowUp size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={() => movePrecise('down', 10)}
                    title="Move Down 10px"
                  >
                    <ArrowDown size={12} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                  onClick={() => movePrecise('right', 10)}
                  title="Move Right 10px"
                >
                  <ArrowRight size={12} />
                </Button>
              </div>
              
              <div className="text-xs font-medium mb-1 text-gray-700">Size</div>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={() => resizePrecise('width', -10)}
                    title="Decrease Width"
                  >
                    <ArrowLeft size={12} />
                  </Button>
                  <span className="text-xs mx-1">W</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={() => resizePrecise('width', 10)}
                    title="Increase Width"
                  >
                    <ArrowRight size={12} />
                  </Button>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={() => resizePrecise('height', -10)}
                    title="Decrease Height"
                  >
                    <ArrowUp size={12} />
                  </Button>
                  <span className="text-xs mx-1">H</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={() => resizePrecise('height', 10)}
                    title="Increase Height"
                  >
                    <ArrowDown size={12} />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Size: {Math.round(overlay.position.width)} × {Math.round(overlay.position.height)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Lock/Unlock button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-6 w-6 p-0"
        onClick={() => setIsLocked(!isLocked)}
      >
        {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
      </Button>
    </div>
  );
};

export default OverlayPositioner;