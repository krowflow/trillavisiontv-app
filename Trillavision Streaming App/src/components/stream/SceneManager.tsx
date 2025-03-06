import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addScene, removeScene, setCurrentScene } from '../../store/slices/scenesSlice';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Layers, Trash2, Plus } from 'lucide-react';

/**
 * Scene manager component
 */
export const SceneManager: React.FC = () => {
  const dispatch = useDispatch();
  const scenes = useSelector((state: RootState) => state.scenes.scenes);
  const currentSceneId = useSelector((state: RootState) => state.scenes.currentSceneId);
  
  const [newSceneName, setNewSceneName] = useState('');
  
  const handleAddScene = () => {
    if (!newSceneName.trim()) return;
    
    const newScene = {
      id: `scene-${Date.now()}`,
      name: newSceneName,
      layout: {
        id: 'default',
        name: 'Default',
        template: 'single'
      },
      sources: [],
      active: false
    };
    
    dispatch(addScene(newScene));
    setNewSceneName('');
  };
  
  const handleRemoveScene = (sceneId: string) => {
    dispatch(removeScene(sceneId));
  };
  
  const handleSelectScene = (sceneId: string) => {
    dispatch(setCurrentScene(sceneId));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-base font-semibold">Scenes</h2>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Plus size={14} />}
          className="h-5 px-1.5 text-[11px] hover:bg-primary/10"
        >
          Add Scene
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-center text-gray-500 py-4">
          <Layers size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-[11px]">No scenes created yet</p>
          <p className="text-[10px] text-gray-400">Create your first scene to get started</p>
        </div>
      </div>
    </div>
  );
};