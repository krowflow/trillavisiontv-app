import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addScene, removeScene, setCurrentScene, updateScene } from '../../store/slices/scenesSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Layers, 
  Video, 
  Image, 
  Mic, 
  Layout, 
  PlusCircle,
  MonitorPlay,
  Palette,
  Trash2,
  Grid,
  Columns,
  LayoutGrid,
  Maximize2,
  Move
} from 'lucide-react';
import { Scene, SourceType } from '../../types';
import { logger, LogCategory } from '../../utils/logging';

interface SidebarProps {
  onAddScene: () => void;
  onAddSource: () => void;
  onOpenBrandSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onAddScene,
  onAddSource,
  onOpenBrandSettings
}) => {
  const dispatch = useDispatch();
  const scenes = useSelector((state: RootState) => state.scenes.scenes);
  const currentSceneId = useSelector((state: RootState) => state.scenes.currentSceneId);
  
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [selectedLayout, setSelectedLayout] = useState<string>('single');
  const [isDragging, setIsDragging] = useState(false);

  // Available layouts with previews
  const layouts = [
    { 
      id: 'single', 
      name: 'Single', 
      icon: <Grid size={16} />,
      preview: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 'pip', 
      name: 'Picture-in-Picture', 
      icon: <Maximize2 size={16} />,
      preview: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 'split', 
      name: 'Split Screen', 
      icon: <Columns size={16} />,
      preview: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&h=200&fit=crop&auto=format'
    },
    { 
      id: 'grid', 
      name: 'Grid', 
      icon: <LayoutGrid size={16} />,
      preview: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=200&fit=crop&auto=format'
    }
  ];

  // Available source types with descriptions
  const sourceTypes = [
    { 
      type: SourceType.CAMERA, 
      name: 'Camera', 
      icon: <Video size={16} />,
      description: 'Add a webcam or capture device'
    },
    { 
      type: SourceType.SCREEN, 
      name: 'Screen Capture', 
      icon: <MonitorPlay size={16} />,
      description: 'Capture your screen or window'
    },
    { 
      type: SourceType.IMAGE, 
      name: 'Image', 
      icon: <Image size={16} />,
      description: 'Add static images or graphics'
    },
    { 
      type: SourceType.AUDIO, 
      name: 'Audio', 
      icon: <Mic size={16} />,
      description: 'Add audio input sources'
    }
  ];

  // Handle adding a new scene
  const handleAddScene = useCallback(() => {
    if (!newSceneName.trim()) return;

    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      name: newSceneName,
      layout: {
        id: selectedLayout,
        name: layouts.find(l => l.id === selectedLayout)?.name || 'Default',
        template: selectedLayout
      },
      sources: [],
      active: false
    };

    dispatch(addScene(newScene));
    setNewSceneName('');
    setIsAddingScene(false);
    logger.info(LogCategory.UI, 'New scene created', { sceneName: newSceneName, layout: selectedLayout });
  }, [dispatch, newSceneName, selectedLayout, layouts]);

  // Handle scene selection
  const handleSelectScene = useCallback((sceneId: string) => {
    dispatch(setCurrentScene(sceneId));
    logger.debug(LogCategory.UI, 'Scene selected', { sceneId });
  }, [dispatch]);

  // Handle scene deletion
  const handleDeleteScene = useCallback((sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this scene?')) {
      dispatch(removeScene(sceneId));
      logger.info(LogCategory.UI, 'Scene deleted', { sceneId });
    }
  }, [dispatch]);

  // Handle source type selection
  const handleSourceTypeSelect = useCallback((type: SourceType) => {
    onAddSource();
    logger.debug(LogCategory.UI, 'Source type selected', { type });
  }, [onAddSource]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New Scene
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsAddingScene(true);
      }
      
      // Number keys 1-9: Switch scenes
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (scenes[index]) {
          handleSelectScene(scenes[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [scenes, handleSelectScene]);

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      {/* Scenes section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Scenes</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingScene(true)}
            leftIcon={<PlusCircle size={14} />}
            className="text-gray-400 hover:text-white"
            title="Add Scene (Ctrl+N)"
          />
        </div>
        
        {isAddingScene && (
          <div className="mb-3 space-y-2">
            <Input
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              placeholder="Scene name"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              autoFocus
            />
            
            <div className="grid grid-cols-2 gap-2">
              {layouts.map(layout => (
                <button
                  key={layout.id}
                  className={`p-2 rounded border ${
                    selectedLayout === layout.id
                      ? 'border-primary bg-primary bg-opacity-20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedLayout(layout.id)}
                >
                  <div className="aspect-video bg-gray-800 rounded mb-1 overflow-hidden">
                    <img 
                      src={layout.preview} 
                      alt={layout.name}
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                  <div className="flex items-center justify-center text-xs">
                    {layout.icon}
                    <span className="ml-1">{layout.name}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleAddScene}
                disabled={!newSceneName.trim()}
                fullWidth
              >
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingScene(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className={`group flex items-center justify-between px-3 py-2 rounded cursor-pointer ${
                scene.id === currentSceneId
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => handleSelectScene(scene.id)}
            >
              <div className="flex items-center flex-1 min-w-0">
                <Move size={14} className="mr-2 opacity-50" />
                <Layers size={16} className="mr-2" />
                <span className="truncate">{scene.name}</span>
                <span className="ml-2 text-xs opacity-50">
                  ({scene.layout.name})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDeleteScene(scene.id, e)}
                className={`opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ${
                  scene.id === currentSceneId
                    ? 'text-white hover:text-red-300'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          
          {scenes.length === 0 && !isAddingScene && (
            <div className="text-sm text-gray-500 italic px-3 py-2">
              No scenes created
            </div>
          )}
        </div>
      </div>
      
      {/* Sources section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Sources</h2>
        </div>
        
        <div className="space-y-1">
          {sourceTypes.map((source) => (
            <button
              key={source.type}
              className="w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 group"
              onClick={() => handleSourceTypeSelect(source.type)}
              disabled={!currentSceneId}
            >
              <div className="flex items-center">
                {source.icon}
                <span className="ml-2">{source.name}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400">
                {source.description}
              </div>
            </button>
          ))}
        </div>
        
        {!currentSceneId && (
          <div className="mt-2 text-xs text-gray-500 bg-gray-800 p-2 rounded">
            Select a scene to add sources
          </div>
        )}
      </div>
      
      {/* Layouts section */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Layouts</h2>
        </div>
        
        <div className="space-y-1">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center ${
                selectedLayout === layout.id
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setSelectedLayout(layout.id)}
            >
              {layout.icon}
              <span className="ml-2">{layout.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Branding section */}
      <div className="p-4 mt-auto border-t border-gray-800">
        <Button
          variant="outline"
          fullWidth
          leftIcon={<Palette size={16} />}
          onClick={onOpenBrandSettings}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Brand Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;