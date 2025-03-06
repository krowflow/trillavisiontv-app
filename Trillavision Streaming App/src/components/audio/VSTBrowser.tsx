import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VSTPlugin } from '../../types';
import { vstService } from '../../services/vst-service';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Box, Search, FolderPlus, Settings, Grid, List, AlertTriangle, X } from 'lucide-react';
import { logger, LogCategory } from '../../utils/logging';
import { setVSTBrowserOpen, setVSTError, addVSTPlugin } from '../../store/slices/audioSlice';
import type { RootState } from '../../store';

interface VSTBrowserProps {
  onSelect: (plugin: VSTPlugin) => void;
  onClose: () => void;
}

export const VSTBrowser: React.FC<VSTBrowserProps> = ({ onSelect, onClose }) => {
  const dispatch = useDispatch();
  const vstError = useSelector((state: RootState) => state.audio.vstError);
  
  const [plugins, setPlugins] = useState<VSTPlugin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'effect' | 'instrument'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'vst2' | 'vst3'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [folderPath, setFolderPath] = useState('');
  const [scanOnStartup, setScanOnStartup] = useState(true);

  // Load plugins
  useEffect(() => {
    const loadPlugins = async () => {
      try {
        await vstService.initialize();
        const availablePlugins = vstService.getPlugins();
        setPlugins(availablePlugins);
        setIsLoading(false);
        dispatch(setVSTError(null));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load VST plugins';
        dispatch(setVSTError(errorMessage));
        setIsLoading(false);
        logger.error(LogCategory.AUDIO, 'Error loading VST plugins', { error });
      }
    };

    loadPlugins();
  }, [dispatch]);

  // Filter plugins
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesType = selectedType === 'all' || plugin.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Group plugins by manufacturer
  const groupedPlugins = filteredPlugins.reduce((acc, plugin) => {
    if (!acc[plugin.manufacturer]) {
      acc[plugin.manufacturer] = [];
    }
    acc[plugin.manufacturer].push(plugin);
    return acc;
  }, {} as Record<string, VSTPlugin[]>);

  // Handle plugin selection
  const handlePluginSelect = async (plugin: VSTPlugin) => {
    try {
      const loadedPlugin = await vstService.loadPlugin(plugin.id);
      if (loadedPlugin) {
        dispatch(addVSTPlugin(loadedPlugin));
        onSelect(loadedPlugin);
        logger.info(LogCategory.AUDIO, 'VST plugin selected', {
          pluginId: plugin.id,
          pluginName: plugin.name
        });
      }
    } catch (error) {
      logger.error(LogCategory.AUDIO, 'Error selecting VST plugin', { error });
    }
  };

  // Handle folder addition
  const handleAddFolder = () => {
    if (!folderPath.trim()) return;
    vstService.addScanPath(folderPath);
    setFolderPath('');
    setShowFolderModal(false);
    logger.info(LogCategory.AUDIO, 'VST scan path added', { path: folderPath });
  };

  // Handle settings save
  const handleSaveSettings = () => {
    // Save settings logic would go here
    setShowSettingsModal(false);
    logger.info(LogCategory.AUDIO, 'VST settings saved', { scanOnStartup });
  };

  // Handle close
  const handleClose = () => {
    dispatch(setVSTBrowserOpen(false));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[1200px] h-[800px] flex flex-col bg-gray-900 border-4 border-primary shadow-[0_0_15px_rgba(88,15,150,0.3)]">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <Box size={20} className="text-primary mr-2" />
            <h2 className="font-semibold text-white">VST Browser</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-4 border-b border-gray-800 space-y-4">
          {/* Search and Action Buttons */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search plugins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-10"
              />
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <Button
              variant="primary"
              leftIcon={<FolderPlus size={16} />}
              onClick={() => setShowFolderModal(true)}
              className="bg-primary hover:bg-primary-light text-white"
            >
              Add Folder
            </Button>
            <Button
              variant="primary"
              leftIcon={<Settings size={16} />}
              onClick={() => setShowSettingsModal(true)}
              className="bg-primary hover:bg-primary-light text-white"
            >
              Settings
            </Button>
          </div>

          {/* Filters and View Mode */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="bg-gray-800 border-2 border-gray-700 text-white rounded-lg pl-4 pr-10 py-2 focus:border-primary focus:ring-0 cursor-pointer hover:border-gray-600 transition-colors"
              >
                <option value="all">All Categories</option>
                <option value="effect">Effects</option>
                <option value="instrument">Instruments</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="bg-gray-800 border-2 border-gray-700 text-white rounded-lg pl-4 pr-10 py-2 focus:border-primary focus:ring-0 cursor-pointer hover:border-gray-600 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="vst2">VST2</option>
                <option value="vst3">VST3</option>
              </select>
            </div>

            <div className="flex bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`${viewMode === 'grid' ? 'text-white' : 'text-gray-400'} hover:text-white`}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`${viewMode === 'list' ? 'text-white' : 'text-gray-400'} hover:text-white`}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Plugin List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin">
                <Settings size={24} className="text-primary" />
              </div>
              <span className="ml-2 text-white">Loading plugins...</span>
            </div>
          ) : vstError ? (
            <div className="flex items-center justify-center h-full text-red-500">
              <AlertTriangle size={24} className="mr-2" />
              <span>{vstError}</span>
            </div>
          ) : filteredPlugins.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <Box size={48} className="mx-auto mb-4 opacity-20" />
              <p>No plugins found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-6">
              {Object.entries(groupedPlugins).map(([manufacturer, plugins]) => (
                <div key={manufacturer}>
                  <h3 className="text-white font-medium mb-2">{manufacturer}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {plugins.map(plugin => (
                      <div
                        key={plugin.id}
                        className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 cursor-pointer transition-colors border border-gray-700 hover:border-primary"
                        onClick={() => handlePluginSelect(plugin)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            plugin.type === 'vst3' ? 'bg-primary text-white' : 'bg-primary-dark text-white'
                          }`}>
                            {plugin.type.toUpperCase()}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            plugin.category === 'effect' ? 'bg-green-900 text-green-200' : 'bg-orange-900 text-orange-200'
                          }`}>
                            {plugin.category}
                          </span>
                        </div>
                        <h4 className="text-white font-medium text-xs truncate mb-0.5">{plugin.name}</h4>
                        <p className="text-gray-400 text-[10px]">{plugin.version}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedPlugins).map(([manufacturer, plugins]) => (
                <div key={manufacturer}>
                  <h3 className="text-white font-medium mb-2">{manufacturer}</h3>
                  <div className="space-y-1">
                    {plugins.map(plugin => (
                      <div
                        key={plugin.id}
                        className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 cursor-pointer transition-colors border border-gray-700 hover:border-primary"
                        onClick={() => handlePluginSelect(plugin)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium text-xs">{plugin.name}</h4>
                            <p className="text-gray-400 text-[10px] mt-0.5">{plugin.version}</p>
                          </div>
                          <div className="flex space-x-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              plugin.type === 'vst3' ? 'bg-primary text-white' : 'bg-primary-dark text-white'
                            }`}>
                              {plugin.type.toUpperCase()}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              plugin.category === 'effect' ? 'bg-green-900 text-green-200' : 'bg-orange-900 text-orange-200'
                            }`}>
                              {plugin.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Add Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-[500px] bg-gray-900 border-4 border-primary p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add VST Folder</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFolderModal(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0 rounded-full"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Enter folder path..."
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <div className="text-sm text-gray-400">
                Common VST folder locations:
                <ul className="mt-2 space-y-1">
                  <li>• C:\Program Files\Common Files\VST3</li>
                  <li>• C:\Program Files\Common Files\VST2</li>
                  <li>• C:\Program Files\Steinberg\VSTPlugins</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowFolderModal(false)}
                  className="text-white hover:text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="bg-primary hover:bg-primary-light text-white"
                  onClick={handleAddFolder}
                  disabled={!folderPath.trim()}
                >
                  Add Folder
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-[500px] bg-gray-900 border-4 border-primary p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">VST Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0 rounded-full"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Scan on Startup
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={scanOnStartup}
                    onChange={(e) => setScanOnStartup(e.target.checked)}
                    className="rounded border-gray-700 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-400">Automatically scan for new plugins</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Plugin Cache
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-gray-700 hover:bg-gray-800"
                >
                  Clear Plugin Cache
                </Button>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowSettingsModal(false)}
                  className="text-white hover:text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="bg-primary hover:bg-primary-light text-white"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VSTBrowser;