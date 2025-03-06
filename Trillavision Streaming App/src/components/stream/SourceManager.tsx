import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addSource, removeSource } from '../../store/slices/scenesSlice';
import { SourceType } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Video, Mic, Image, MonitorPlay, Trash2, Plus } from 'lucide-react';

/**
 * Source manager component
 */
export const SourceManager: React.FC = () => {
  const dispatch = useDispatch();
  const currentSceneId = useSelector((state: RootState) => state.scenes.currentSceneId);
  const currentScene = useSelector((state: RootState) => {
    const { scenes, currentSceneId } = state.scenes;
    return scenes.find(scene => scene.id === currentSceneId);
  });
  
  const [sourceType, setSourceType] = useState<SourceType>(SourceType.CAMERA);
  const [sourceName, setSourceName] = useState('');
  
  const sourceTypeOptions = [
    { value: SourceType.CAMERA, label: 'Camera' },
    { value: SourceType.SCREEN, label: 'Screen Capture' },
    { value: SourceType.IMAGE, label: 'Image' },
    { value: SourceType.VIDEO, label: 'Video' },
    { value: SourceType.AUDIO, label: 'Audio' },
    { value: SourceType.TEXT, label: 'Text' },
    { value: SourceType.BROWSER, label: 'Browser Source' }
  ];
  
  const handleAddSource = () => {
    if (!currentSceneId || !sourceName.trim()) return;
    
    const newSource = {
      id: `source-${Date.now()}`,
      name: sourceName,
      type: sourceType,
      settings: {},
      position: {
        x: 0,
        y: 0,
        width: 640,
        height: 360
      }
    };
    
    dispatch(addSource({ sceneId: currentSceneId, source: newSource }));
    setSourceName('');
  };
  
  const handleRemoveSource = (sourceId: string) => {
    if (!currentSceneId) return;
    dispatch(removeSource({ sceneId: currentSceneId, sourceId }));
  };
  
  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case SourceType.CAMERA:
        return <Video size={18} className="text-primary" />;
      case SourceType.SCREEN:
        return <MonitorPlay size={18} className="text-primary" />;
      case SourceType.IMAGE:
      case SourceType.VIDEO:
        return <Image size={18} className="text-primary" />;
      case SourceType.AUDIO:
        return <Mic size={18} className="text-primary" />;
      default:
        return <Video size={18} className="text-primary" />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-base font-semibold">Sources</h2>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Plus size={14} />}
          className="h-5 px-1.5 text-[11px] hover:bg-primary/10"
        >
          Add Source
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-center text-gray-500 py-4">
          <Video size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-[11px]">No sources added</p>
          <p className="text-[10px] text-gray-400">Add sources to your scene</p>
        </div>
      </div>
    </div>
  );
};