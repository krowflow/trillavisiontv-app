import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';
import { LogViewer } from '../components/ui/LogViewer';
import { logger, LogLevel } from '../utils/logging';
import { Settings, Save, RotateCcw, AlertTriangle, Info, Bug, Database } from 'lucide-react';

/**
 * Application settings page
 */
const AppSettings: React.FC = () => {
  // General settings
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [confirmBeforeClosing, setConfirmBeforeClosing] = useState(true);
  
  // Performance settings
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [lowLatencyMode, setLowLatencyMode] = useState(false);
  const [maxBitrate, setMaxBitrate] = useState(6000);
  
  // Debug settings
  const [logLevel, setLogLevel] = useState<LogLevel>(LogLevel.INFO);
  const [consoleLogging, setConsoleLogging] = useState(true);
  const [showDevTools, setShowDevTools] = useState(false);
  
  // Storage settings
  const [cacheSize, setCacheSize] = useState(500); // MB
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [recordingPath, setRecordingPath] = useState('/recordings');
  
  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // General settings
        if (settings.darkMode !== undefined) setDarkMode(settings.darkMode);
        if (settings.autoSave !== undefined) setAutoSave(settings.autoSave);
        if (settings.confirmBeforeClosing !== undefined) setConfirmBeforeClosing(settings.confirmBeforeClosing);
        
        // Performance settings
        if (settings.hardwareAcceleration !== undefined) setHardwareAcceleration(settings.hardwareAcceleration);
        if (settings.lowLatencyMode !== undefined) setLowLatencyMode(settings.lowLatencyMode);
        if (settings.maxBitrate !== undefined) setMaxBitrate(settings.maxBitrate);
        
        // Debug settings
        if (settings.logLevel !== undefined) {
          setLogLevel(settings.logLevel);
          logger.setLogLevel(settings.logLevel);
        }
        if (settings.consoleLogging !== undefined) {
          setConsoleLogging(settings.consoleLogging);
          logger.enableConsoleLogging(settings.consoleLogging);
        }
        if (settings.showDevTools !== undefined) setShowDevTools(settings.showDevTools);
        
        // Storage settings
        if (settings.cacheSize !== undefined) setCacheSize(settings.cacheSize);
        if (settings.autoCleanup !== undefined) setAutoCleanup(settings.autoCleanup);
        if (settings.recordingPath !== undefined) setRecordingPath(settings.recordingPath);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);
  
  // Save settings to localStorage
  const saveSettings = () => {
    try {
      const settings = {
        // General settings
        darkMode,
        autoSave,
        confirmBeforeClosing,
        
        // Performance settings
        hardwareAcceleration,
        lowLatencyMode,
        maxBitrate,
        
        // Debug settings
        logLevel,
        consoleLogging,
        showDevTools,
        
        // Storage settings
        cacheSize,
        autoCleanup,
        recordingPath
      };
      
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply settings
      logger.setLogLevel(logLevel);
      logger.enableConsoleLogging(consoleLogging);
      
      // Log the action
      logger.info('general', 'Settings saved', { settings });
      
      // Show success message
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // General settings
      setDarkMode(false);
      setAutoSave(true);
      setConfirmBeforeClosing(true);
      
      // Performance settings
      setHardwareAcceleration(true);
      setLowLatencyMode(false);
      setMaxBitrate(6000);
      
      // Debug settings
      setLogLevel(LogLevel.INFO);
      setConsoleLogging(true);
      setShowDevTools(false);
      
      // Storage settings
      setCacheSize(500);
      setAutoCleanup(true);
      setRecordingPath('/recordings');
      
      // Apply settings
      logger.setLogLevel(LogLevel.INFO);
      logger.enableConsoleLogging(true);
      
      // Remove saved settings
      localStorage.removeItem('appSettings');
      
      // Log the action
      logger.info('general', 'Settings reset to defaults');
      
      // Show success message
      alert('Settings reset to defaults');
    }
  };
  
  // Handle log level change
  const handleLogLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value as LogLevel;
    setLogLevel(level);
    logger.setLogLevel(level);
  };
  
  // Handle console logging toggle
  const handleConsoleLoggingToggle = (checked: boolean) => {
    setConsoleLogging(checked);
    logger.enableConsoleLogging(checked);
  };
  
  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings size={16} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              <div className="space-y-4">
                <Toggle
                  label="Dark Mode"
                  checked={darkMode}
                  onChange={setDarkMode}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Behavior</h3>
              <div className="space-y-4">
                <Toggle
                  label="Auto-save changes"
                  checked={autoSave}
                  onChange={setAutoSave}
                />
                
                <Toggle
                  label="Confirm before closing"
                  checked={confirmBeforeClosing}
                  onChange={setConfirmBeforeClosing}
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <Settings size={16} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Hardware</h3>
              <div className="space-y-4">
                <Toggle
                  label="Hardware Acceleration"
                  checked={hardwareAcceleration}
                  onChange={setHardwareAcceleration}
                />
                
                <Toggle
                  label="Low Latency Mode"
                  checked={lowLatencyMode}
                  onChange={setLowLatencyMode}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Streaming</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Bitrate (kbps)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="15000"
                    step="500"
                    value={maxBitrate}
                    onChange={(e) => setMaxBitrate(parseInt(e.target.value))}
                    className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Changing performance settings may affect streaming quality and stability.
                  If you experience issues, try reverting to default settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'debug',
      label: 'Debug',
      icon: <Bug size={16} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Logging</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Log Level
                  </label>
                  <select
                    value={logLevel}
                    onChange={handleLogLevelChange}
                    className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  >
                    {Object.values(LogLevel).map(level => (
                      <option key={level} value={level}>{level.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                
                <Toggle
                  label="Console Logging"
                  checked={consoleLogging}
                  onChange={handleConsoleLoggingToggle}
                />
                
                <Toggle
                  label="Show Developer Tools"
                  checked={showDevTools}
                  onChange={setShowDevTools}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Diagnostics</h3>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    logger.info('general', 'Test log message');
                    alert('Test log message created. Check the logs.');
                  }}
                >
                  Create Test Log
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    try {
                      throw new Error('Test error');
                    } catch (error) {
                      logger.error('general', 'Test error', { error });
                      alert('Test error logged. Check the logs.');
                    }
                  }}
                >
                  Create Test Error
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Application Logs</h3>
            <LogViewer maxHeight="300px" />
          </div>
        </div>
      )
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: <Database size={16} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Cache</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Cache Size (MB)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="100"
                    value={cacheSize}
                    onChange={(e) => setCacheSize(parseInt(e.target.value))}
                    className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
                  />
                </div>
                
                <Toggle
                  label="Auto-cleanup on exit"
                  checked={autoCleanup}
                  onChange={setAutoCleanup}
                />
                
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear the cache?')) {
                      // In a real implementation, this would clear the cache
                      logger.info('general', 'Cache cleared');
                      alert('Cache cleared successfully');
                    }
                  }}
                >
                  Clear Cache Now
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Recordings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recording Path
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={recordingPath}
                      onChange={(e) => setRecordingPath(e.target.value)}
                      className="block w-full rounded-l-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
                    />
                    <button
                      className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                      onClick={() => {
                        // In a real implementation, this would open a file picker
                        alert('File picker would open here');
                      }}
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Recordings and cached files are stored locally on your computer.
                  Make sure you have enough disk space available.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          onAddScene={() => {}}
          onAddSource={() => {}}
          onOpenBrandSettings={() => {}}
        />
        
        <div className="flex-1 p-6 pb-20 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Application Settings</h1>
            
            <Card className="mb-6">
              <Tabs tabs={tabs} />
            </Card>
            
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                leftIcon={<RotateCcw size={16} />}
                onClick={resetSettings}
              >
                Reset to Defaults
              </Button>
              
              <Button
                variant="primary"
                leftIcon={<Save size={16} />}
                onClick={saveSettings}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AppSettings;