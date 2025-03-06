import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Transition, TransitionType } from '../../types';
import { Layers, Play, Settings, Clock, Zap, Scissors, Loader } from 'lucide-react';
import { logger, LogCategory } from '../../utils/logging';

interface SceneTransitionProps {
  onTransitionSelect?: (transition: Transition) => void;
  onClose?: () => void;
}

/**
 * Scene transition component for managing transitions between scenes
 * Improved with tabbed interface and better space utilization
 */
export const SceneTransition: React.FC<SceneTransitionProps> = ({ 
  onTransitionSelect,
  onClose
}) => {
  // Tabs state
  const [activeTab, setActiveTab] = useState<'transitions' | 'settings' | 'create'>('transitions');

  // Transitions state
  const [transitions, setTransitions] = useState<Transition[]>([
    {
      id: 'transition-fade',
      name: 'Fade',
      type: TransitionType.FADE,
      duration: 1000,
      settings: {}
    },
    {
      id: 'transition-cut',
      name: 'Cut',
      type: TransitionType.CUT,
      duration: 0,
      settings: {}
    },
    {
      id: 'transition-slide',
      name: 'Slide',
      type: TransitionType.SLIDE,
      duration: 800,
      settings: {
        direction: 'left'
      }
    },
    {
      id: 'transition-zoom',
      name: 'Zoom',
      type: TransitionType.ZOOM,
      duration: 1200,
      settings: {
        scale: 1.5
      }
    },
    {
      id: 'transition-wipe',
      name: 'Wipe',
      type: TransitionType.WIPE,
      duration: 1000,
      settings: {
        direction: 'left'
      }
    }
  ]);
  
  const [selectedTransitionId, setSelectedTransitionId] = useState<string>(transitions[0].id);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [newTransitionName, setNewTransitionName] = useState('');
  const [newTransitionType, setNewTransitionType] = useState<TransitionType>(TransitionType.FADE);
  const [newTransitionDuration, setNewTransitionDuration] = useState(1000);
  
  // Get the selected transition
  const selectedTransition = transitions.find(t => t.id === selectedTransitionId) || transitions[0];
  
  // Handle transition selection
  const handleTransitionSelect = (transitionId: string) => {
    setSelectedTransitionId(transitionId);
    const transition = transitions.find(t => t.id === transitionId);
    
    if (transition && onTransitionSelect) {
      onTransitionSelect(transition);
      logger.debug(LogCategory.UI, 'Transition selected', { transitionId, transitionName: transition.name });
    }
  };
  
  // Handle transition preview
  const handlePreviewTransition = () => {
    setIsPreviewPlaying(true);
    logger.debug(LogCategory.UI, 'Transition preview started', { transitionId: selectedTransitionId });
    
    // Simulate transition completion
    setTimeout(() => {
      setIsPreviewPlaying(false);
      logger.debug(LogCategory.UI, 'Transition preview completed', { transitionId: selectedTransitionId });
    }, selectedTransition.duration);
  };
  
  // Handle adding a new transition
  const handleAddTransition = () => {
    if (!newTransitionName.trim()) return;
    
    const newTransition: Transition = {
      id: `transition-${Date.now()}`,
      name: newTransitionName,
      type: newTransitionType,
      duration: newTransitionDuration,
      settings: {}
    };
    
    // Add direction setting for slide and wipe transitions
    if (newTransitionType === TransitionType.SLIDE || newTransitionType === TransitionType.WIPE) {
      newTransition.settings.direction = 'left';
    }
    
    // Add scale setting for zoom transition
    if (newTransitionType === TransitionType.ZOOM) {
      newTransition.settings.scale = 1.5;
    }
    
    setTransitions([...transitions, newTransition]);
    setSelectedTransitionId(newTransition.id);
    setNewTransitionName('');
    setActiveTab('transitions'); // Switch to transitions tab after creating
    
    logger.info(LogCategory.UI, 'New transition created', { 
      transitionId: newTransition.id,
      transitionName: newTransition.name,
      transitionType: newTransition.type
    });
    
    if (onTransitionSelect) {
      onTransitionSelect(newTransition);
    }
  };
  
  // Handle updating transition settings
  const handleUpdateTransitionSettings = (settings: Record<string, any>) => {
    setTransitions(transitions.map(transition => {
      if (transition.id === selectedTransitionId) {
        return {
          ...transition,
          settings: {
            ...transition.settings,
            ...settings
          }
        };
      }
      return transition;
    }));
    
    logger.debug(LogCategory.UI, 'Transition settings updated', { 
      transitionId: selectedTransitionId,
      settings
    });
  };
  
  // Handle updating transition duration
  const handleUpdateTransitionDuration = (duration: number) => {
    setTransitions(transitions.map(transition => {
      if (transition.id === selectedTransitionId) {
        return {
          ...transition,
          duration
        };
      }
      return transition;
    }));
    
    logger.debug(LogCategory.UI, 'Transition duration updated', { 
      transitionId: selectedTransitionId,
      duration
    });
  };
  
  // Get transition icon based on type
  const getTransitionIcon = (type: TransitionType) => {
    switch (type) {
      case TransitionType.FADE:
        return <Layers size={16} />;
      case TransitionType.CUT:
        return <Scissors size={16} />;
      case TransitionType.SLIDE:
        return <Zap size={16} />;
      case TransitionType.ZOOM:
        return <Zap size={16} />;
      case TransitionType.WIPE:
        return <Zap size={16} />;
      default:
        return <Layers size={16} />;
    }
  };
  
  // Render transition settings based on type
  const renderTransitionSettings = () => {
    switch (selectedTransition.type) {
      case TransitionType.FADE:
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Easing
              </label>
              <select
                className="block w-full text-[11px] h-6 rounded-md border-gray-300"
                value={selectedTransition.settings.easing || 'ease-in-out'}
                onChange={(e) => handleUpdateTransitionSettings({ easing: e.target.value })}
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
              </select>
            </div>
          </div>
        );
      
      case TransitionType.SLIDE:
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Direction
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'left' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'left' })}
                >
                  Left
                </button>
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'right' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'right' })}
                >
                  Right
                </button>
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'up' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'up' })}
                >
                  Up
                </button>
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'down' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'down' })}
                >
                  Down
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Easing
              </label>
              <select
                className="block w-full text-[11px] h-6 rounded-md border-gray-300"
                value={selectedTransition.settings.easing || 'ease-in-out'}
                onChange={(e) => handleUpdateTransitionSettings({ easing: e.target.value })}
              >
                <option value="linear">Linear</option>
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
              </select>
            </div>
          </div>
        );
      
      case TransitionType.ZOOM:
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Scale
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="1.1"
                  max="3"
                  step="0.1"
                  value={selectedTransition.settings.scale || 1.5}
                  onChange={(e) => handleUpdateTransitionSettings({ scale: parseFloat(e.target.value) })}
                  className="flex-1 h-1"
                />
                <span className="text-[10px] w-8 text-right">{selectedTransition.settings.scale || 1.5}x</span>
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Direction
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'in' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'in' })}
                >
                  Zoom In
                </button>
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'out' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'out' })}
                >
                  Zoom Out
                </button>
              </div>
            </div>
          </div>
        );
      
      case TransitionType.WIPE:
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Direction
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'left' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'left' })}
                >
                  Left to Right
                </button>
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'right' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'right' })}
                >
                  Right to Left
                </button>
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'up' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'up' })}
                >
                  Bottom to Top
                </button>
                <button 
                  className={`p-1 text-[10px] border rounded-md ${selectedTransition.settings.direction === 'down' ? 'bg-primary-light text-white' : 'bg-white'}`}
                  onClick={() => handleUpdateTransitionSettings({ direction: 'down' })}
                >
                  Top to Bottom
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Softness
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={selectedTransition.settings.softness || 0}
                  onChange={(e) => handleUpdateTransitionSettings({ softness: parseInt(e.target.value) })}
                  className="flex-1 h-1"
                />
                <span className="text-[10px] w-8 text-right">{selectedTransition.settings.softness || 0}%</span>
              </div>
            </div>
          </div>
        );
      
      case TransitionType.CUT:
        return (
          <div className="p-2 bg-gray-50 rounded-md">
            <p className="text-[11px] text-gray-600">
              Cut transitions are immediate with no additional settings.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-[200px] overflow-hidden">
      <div className="flex-shrink-0">
        <CardHeader 
          title="Scene Transitions" 
          icon={<Layers size={18} className="text-primary" />}
          onClose={onClose}
        />
      </div>
      
      {/* Tabs */}
      <div className="flex mb-1 text-[11px] border-b border-gray-200 px-4">
        <button 
          className={`px-2 py-1 ${activeTab === 'transitions' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('transitions')}
        >
          Transitions
        </button>
        <button 
          className={`px-2 py-1 ${activeTab === 'settings' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button 
          className={`px-2 py-1 ${activeTab === 'create' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create New
        </button>
      </div>
      
      {/* Content Area */}
      <CardContent scrollable>
        {/* Transitions Tab */}
        {activeTab === 'transitions' && (
          <div className="space-y-2">
            {/* Available Transitions */}
            <div className="mb-2">
              <h3 className="text-[11px] font-medium text-gray-700 mb-1">Available Transitions</h3>
              <div className="grid grid-cols-3 gap-1">
                {transitions.map(transition => (
                  <button
                    key={transition.id}
                    className={`p-1 rounded-md flex flex-col items-center justify-center ${
                      transition.id === selectedTransitionId
                        ? 'bg-primary-light bg-opacity-10 border border-primary-light'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleTransitionSelect(transition.id)}
                  >
                    {getTransitionIcon(transition.type)}
                    <span className="text-[10px] mt-1">{transition.name}</span>
                    <span className="text-[9px] text-gray-500">{transition.duration}ms</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Duration Control */}
            <div className="flex items-center mb-2">
              <span className="text-[11px] w-16">Duration:</span>
              <input
                type="range"
                min="100"
                max="3000"
                step="100"
                value={selectedTransition.duration}
                onChange={(e) => handleUpdateTransitionDuration(parseInt(e.target.value))}
                className="flex-1 h-1"
              />
              <span className="text-[11px] w-12 text-right">{selectedTransition.duration}ms</span>
            </div>

            {/* Preview Button */}
            <button
              className="w-full h-8 flex items-center justify-center text-[11px] bg-primary-light bg-opacity-10 hover:bg-opacity-20 text-primary rounded-md"
              onClick={handlePreviewTransition}
              disabled={isPreviewPlaying}
            >
              <Play size={12} className="mr-1" />
              Preview Transition
            </button>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-2">
            {/* Transition name display */}
            <div className="mb-2">
              <h3 className="text-[11px] font-medium text-gray-700 mb-1">
                {selectedTransition.name} Settings
              </h3>
            </div>
            
            {/* Transition-specific settings */}
            {renderTransitionSettings()}
          </div>
        )}
        
        {/* Create New Tab */}
        {activeTab === 'create' && (
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newTransitionName}
                onChange={(e) => setNewTransitionName(e.target.value)}
                placeholder="Enter name"
                className="block w-full text-[11px] h-6 rounded-md border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="block w-full text-[11px] h-6 rounded-md border-gray-300"
                value={newTransitionType}
                onChange={(e) => setNewTransitionType(e.target.value as TransitionType)}
              >
                <option value={TransitionType.FADE}>Fade</option>
                <option value={TransitionType.CUT}>Cut</option>
                <option value={TransitionType.SLIDE}>Slide</option>
                <option value={TransitionType.ZOOM}>Zoom</option>
                <option value={TransitionType.WIPE}>Wipe</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-gray-700 mb-1">
                Duration (ms)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                step="100"
                value={newTransitionDuration}
                onChange={(e) => setNewTransitionDuration(parseInt(e.target.value))}
                className="block w-full text-[11px] h-6 rounded-md border-gray-300"
              />
            </div>
            
            <button
              className="w-full h-7 text-[11px] bg-primary text-white rounded-md hover:bg-primary-dark"
              onClick={handleAddTransition}
              disabled={!newTransitionName.trim()}
            >
              Create Transition
            </button>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default SceneTransition;