import React, { useState, useEffect, useRef } from 'react';
import { VSTPlugin, VSTParameter } from '../../types';
import { vstService } from '../../services/vst-service';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { Settings, Power, Sliders, Play, Square, Save, Folder } from 'lucide-react';

interface VSTProcessorProps {
  pluginId: string;
  onChange: (settings: Record<string, any>) => void;
  enabled: boolean;
  onToggle: () => void;
}

export const VSTProcessor: React.FC<VSTProcessorProps> = ({
  pluginId,
  onChange,
  enabled,
  onToggle
}) => {
  const [plugin, setPlugin] = useState<VSTPlugin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationPoints, setAutomationPoints] = useState<Map<number, number[]>>(new Map());
  const automationRef = useRef<number | null>(null);

  useEffect(() => {
    const loadPlugin = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await vstService.initialize();
        const loadedPlugin = await vstService.loadPlugin(pluginId);
        setPlugin(loadedPlugin);
      } catch (error) {
        setError('Failed to load VST plugin');
        console.error('Error loading VST plugin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlugin();

    return () => {
      if (automationRef.current) {
        cancelAnimationFrame(automationRef.current);
      }
    };
  }, [pluginId]);

  const handleParameterChange = (parameter: VSTParameter, value: number) => {
    if (!plugin) return;

    vstService.updateParameter(plugin.id, parameter.id, value);
    onChange({ parameters: plugin.parameters });
  };

  const startAutomation = (parameterId: number) => {
    if (!plugin || isAutomating) return;

    setIsAutomating(true);
    const points = automationPoints.get(parameterId) || [];
    const parameter = plugin.parameters.find(p => p.id === parameterId);
    
    if (!parameter) return;

    let frame = 0;
    const animate = () => {
      if (points.length < 2) {
        setIsAutomating(false);
        return;
      }

      const time = frame % points.length;
      const value = points[time];
      
      handleParameterChange(parameter, value);
      frame++;

      automationRef.current = requestAnimationFrame(animate);
    };

    automationRef.current = requestAnimationFrame(animate);
  };

  const stopAutomation = () => {
    if (automationRef.current) {
      cancelAnimationFrame(automationRef.current);
    }
    setIsAutomating(false);
  };

  const addAutomationPoint = (parameterId: number, value: number) => {
    setAutomationPoints(prev => {
      const points = prev.get(parameterId) || [];
      return new Map(prev).set(parameterId, [...points, value]);
    });
  };

  const clearAutomationPoints = (parameterId: number) => {
    setAutomationPoints(prev => {
      const newPoints = new Map(prev);
      newPoints.delete(parameterId);
      return newPoints;
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin mb-2">
          <Settings size={24} className="text-primary" />
        </div>
        <p className="text-sm text-gray-600">Loading VST plugin...</p>
      </div>
    );
  }

  if (error || !plugin) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error || 'Plugin not found'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 rounded-lg w-[800px] border-4 border-primary shadow-[0_0_15px_rgba(88,15,150,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{plugin.name}</h3>
          <p className="text-sm text-gray-400">{plugin.manufacturer} • {plugin.version}</p>
        </div>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      <div className="space-y-6">
        {plugin.parameters.map(param => (
          <div key={param.id} className="bg-black bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">
                {param.name}
              </label>
              <div className="flex items-center space-x-2">
                {param.isAutomatable && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={isAutomating ? <Square size={14} /> : <Play size={14} />}
                      onClick={() => isAutomating ? stopAutomation() : startAutomation(param.id)}
                      className="text-white hover:text-white hover:bg-primary hover:bg-opacity-20"
                    >
                      {isAutomating ? 'Stop' : 'Automate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Save size={14} />}
                      onClick={() => addAutomationPoint(param.id, param.value)}
                      className="text-white hover:text-white hover:bg-primary hover:bg-opacity-20"
                      disabled={isAutomating}
                    >
                      Add Point
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={param.minValue}
                max={param.maxValue}
                step={(param.maxValue - param.minValue) / 100}
                value={param.value}
                onChange={(e) => handleParameterChange(param, parseFloat(e.target.value))}
                className="flex-1"
                disabled={isAutomating}
              />
              <span className="text-sm text-gray-400 w-16 text-right">
                {param.value.toFixed(1)}{param.label}
              </span>
            </div>

            {automationPoints.has(param.id) && (
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {automationPoints.get(param.id)?.length || 0} automation points
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearAutomationPoints(param.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20"
                >
                  Clear Points
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Plugin Type: <span className="text-white">{plugin.type.toUpperCase()}</span>
          </div>
          <div className="text-gray-400">
            Category: <span className="text-white">{plugin.category}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Folder size={14} />}
            onClick={() => {
              // In a real implementation, this would open the plugin's directory
              console.log('Opening plugin directory:', plugin.path);
            }}
            className="text-white hover:text-white hover:bg-primary hover:bg-opacity-20"
          >
            Show in Folder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VSTProcessor;