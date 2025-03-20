import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { StreamPreview } from '../components/stream/StreamPreview';
import { SceneManager } from '../components/stream/SceneManager';
import { SourceManager } from '../components/stream/SourceManager';
import { LayoutManager } from '../components/stream/LayoutManager';
import { BrandSettings } from '../components/brand/BrandSettings';
import { StreamSettings } from '../components/stream/StreamSettings';
import { StreamControls } from '../components/stream/StreamControls';
import { DeviceSelector } from '../components/stream/DeviceSelector';
import { StreamChat } from '../components/stream/StreamChat';
import { AudioMixer } from '../components/audio/AudioMixer';
import { StreamAnalytics } from '../components/stream/StreamAnalytics';
import { SceneTransition } from '../components/stream/SceneTransition';
import { OverlayTemplates } from '../components/brand/OverlayTemplates';
import { RecordingPanel } from '../components/stream/RecordingPanel';
import { Button } from '../components/ui/Button';
import { PanelCard } from '../components/ui/PanelCard';
import { PanelManager, usePanelManager, PanelId } from '../components/ui/PanelManager';
import { 
  Layers,
  Scissors,
  Play,
  MoveHorizontal,
  ZoomIn,
  ArrowRight,
  Sliders, 
  Palette, 
  Tv, 
  MessageSquare, 
  Columns, 
  LayoutGrid, 
  Music, 
  X, 
  Settings, 
  BarChart2, 
  Layout, 
  SwordIcon as Record,
  Plus 
} from 'lucide-react';
import { logger, LogCategory } from '../utils/logging';

// Panel content component to handle rendering the appropriate panel
const PanelContent: React.FC<{ panelId: PanelId; onClose: () => void }> = ({ panelId, onClose }) => {
  const [selectedDevices, setSelectedDevices] = React.useState({
    camera: '',
    microphone: '',
    screen: ''
  });

  const handleDeviceSelect = (deviceType: string, deviceId: string) => {
    setSelectedDevices(prev => ({
      ...prev,
      [deviceType]: deviceId
    }));
  };

  const handleAudioSettingsChange = (channelId: string, processorId: string, settings: Record<string, any>) => {
    logger.debug(LogCategory.UI, 'Audio settings changed', { channelId, processorId, settings });
  };

  // Get panel icon
  const getPanelIcon = () => {
    switch (panelId) {
      case 'streamControls': return <Play size={18} />;
      case 'deviceSettings': return <Settings size={18} />;
      case 'sceneManager': return <Tv size={18} />;
      case 'sourceManager': return <Sliders size={18} />;
      case 'layoutManager': return <Layout size={18} />;
      case 'brandSettings': return <Palette size={18} />;
      case 'streamSettings': return <Settings size={18} />;
      case 'chat': return <MessageSquare size={18} />;
      case 'audioMixer': return <Music size={18} />;
      case 'analytics': return <BarChart2 size={18} />;
      case 'sceneTransition': return <Layers size={18} />;
      case 'overlayTemplates': return <Layout size={18} />;
      case 'recording': return <Record size={18} />;
      default: return null;
    }
  };

  // Get panel title
  const getPanelTitle = () => {
    switch (panelId) {
      case 'streamControls': return 'Stream Controls';
      case 'deviceSettings': return 'Input Devices';
      case 'sceneManager': return 'Scenes';
      case 'sourceManager': return 'Sources';
      case 'layoutManager': return 'Layouts';
      case 'brandSettings': return 'Brand Settings';
      case 'streamSettings': return 'Stream Settings';
      case 'chat': return 'Stream Chat';
      case 'audioMixer': return 'Audio Mixer';
      case 'analytics': return 'Analytics';
      case 'sceneTransition': return 'Scene Transitions';
      case 'overlayTemplates': return 'Overlay Templates';
      case 'recording': return 'Recording';
      default: return 'Panel';
    }
  };

  // Render panel content
  const renderPanelContent = () => {
    switch (panelId) {
      case 'streamControls':
        return <StreamControls />;
      case 'deviceSettings':
        return <DeviceSelector onDeviceSelect={handleDeviceSelect} />;
      case 'sceneManager':
        return <SceneManager />;
      case 'sourceManager':
        return <SourceManager />;
      case 'layoutManager':
        return <LayoutManager />;
      case 'brandSettings':
        return <BrandSettings />;
      case 'streamSettings':
        return <StreamSettings />;
      case 'chat':
        return <StreamChat onClose={onClose} />;
      case 'audioMixer':
        return <AudioMixer 
          onSettingsChange={handleAudioSettingsChange}
          onClose={onClose}
        />;
      case 'analytics':
        return <StreamAnalytics onClose={onClose} />;
      case 'sceneTransition':
        return <SceneTransition onClose={onClose} />;
      case 'overlayTemplates':
        return <OverlayTemplates onClose={onClose} />;
      case 'recording':
        return <RecordingPanel />;
      default:
        return <div>Unknown panel</div>;
    }
  };

  // Define panels that have their own headers
  const panelsWithSelfHeaders = [
    'sceneTransition',
    'overlayTemplates',
    'recording',
    'chat',
    'streamControls',
    'deviceSettings',
    'analytics',
    'sceneManager',
    'sourceManager',
    'layoutManager'
    // Note: audioMixer should keep its current implementation as requested
  ];

  // Check if the current panel has its own header
  const hasSelfHeader = panelsWithSelfHeaders.includes(panelId);

  return (
    <PanelCard
      title={getPanelTitle()}
      icon={getPanelIcon()}
      onClose={onClose}
      isCollapsible={true}
      isMaximizable={true}
      hideHeader={hasSelfHeader}
    >
      {renderPanelContent()}
    </PanelCard>
  );
};

// Dashboard component with PanelManager
const Dashboard: React.FC = () => {
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'side-by-side' | 'preview-only' | 'program-only'>('side-by-side');

  // Initial panels to show - now with 4 panels by default
  const initialPanels: Partial<Record<PanelId, boolean>> = {
    streamControls: true,
    sceneManager: true,
    sourceManager: true,
    layoutManager: true
  };

  React.useEffect(() => {
    logger.info(LogCategory.UI, 'Dashboard mounted');
    return () => logger.info(LogCategory.UI, 'Dashboard unmounted');
  }, []);

  React.useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel);
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Panel tabs component
  const PanelTabs: React.FC = () => {
    const { activePanels, togglePanel } = usePanelManager();

    return (
      <div className="flex-none bg-[#2A0944] border-y border-[#580F96] py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            ref={tabsContainerRef}
            className="flex justify-center space-x-2"
          >
            <Button
              variant={activePanels.streamControls ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Play size={16} />}
              onClick={() => togglePanel('streamControls')}
            >
              Stream Controls
            </Button>
            <Button
              variant={activePanels.deviceSettings ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Settings size={16} />}
              onClick={() => togglePanel('deviceSettings')}
            >
              Input Devices
            </Button>
            <Button
              variant={activePanels.sceneManager ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Tv size={16} />}
              onClick={() => togglePanel('sceneManager')}
            >
              Scenes
            </Button>
            <Button
              variant={activePanels.sourceManager ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Sliders size={16} />}
              onClick={() => togglePanel('sourceManager')}
            >
              Sources
            </Button>
            <Button
              variant={activePanels.layoutManager ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Layout size={16} />}
              onClick={() => togglePanel('layoutManager')}
            >
              Layouts
            </Button>
            <Button
              variant={activePanels.brandSettings ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Palette size={16} />}
              onClick={() => togglePanel('brandSettings')}
            >
              Brand
            </Button>
            <Button
              variant={activePanels.streamSettings ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Settings size={16} />}
              onClick={() => togglePanel('streamSettings')}
            >
              Stream Settings
            </Button>
            <Button
              variant={activePanels.chat ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<MessageSquare size={16} />}
              onClick={() => togglePanel('chat')}
            >
              Chat
            </Button>
            <Button
              variant={activePanels.audioMixer ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Music size={16} />}
              onClick={() => togglePanel('audioMixer')}
            >
              Audio Mixer
            </Button>
            <Button
              variant={activePanels.analytics ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<BarChart2 size={16} />}
              onClick={() => togglePanel('analytics')}
            >
              Analytics
            </Button>
            <Button
              variant={activePanels.sceneTransition ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Layers size={16} />}
              onClick={() => togglePanel('sceneTransition')}
            >
              Transitions
            </Button>
            <Button
              variant={activePanels.overlayTemplates ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Layout size={16} />}
              onClick={() => togglePanel('overlayTemplates')}
            >
              Overlay Templates
            </Button>
            <Button
              variant={activePanels.recording ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Record size={16} />}
              onClick={() => togglePanel('recording')}
            >
              Recording
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Panels grid component
  const PanelsGrid: React.FC = () => {
    const { activePanels, closePanel, getActivePanelCount } = usePanelManager();
    const activePanelCount = getActivePanelCount();

    return (
      <div className="flex-1 p-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[300px]">
          {Object.entries(activePanels)
            .filter(([_, isActive]) => isActive)
            .map(([panelId, _]) => (
              <div key={panelId} className="h-full">
                <PanelContent 
                  panelId={panelId as PanelId} 
                  onClose={() => closePanel(panelId as PanelId)} 
                />
              </div>
            ))}

          {/* Empty State */}
          {activePanelCount === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg p-8">
              <Tv size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No panels open</h3>
              <p className="text-gray-400 text-center mb-4">
                Select a panel from the tabs above to get started
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Tv size={16} />}
                  onClick={() => closePanel('sceneManager')}
                >
                  Open Scenes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Sliders size={16} />}
                  onClick={() => closePanel('sourceManager')}
                >
                  Open Sources
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <PanelManager maxPanels={4} replacementStrategy="fifo" initialPanels={initialPanels}>
      <div className="flex h-screen">
        <Sidebar
          onAddScene={() => {/* Use usePanelManager hook in the Sidebar component */}}
          onAddSource={() => {/* Use usePanelManager hook in the Sidebar component */}}
          onOpenBrandSettings={() => {/* Use usePanelManager hook in the Sidebar component */}}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <div className="flex-1 bg-[#1a1625] overflow-hidden">
            {/* View Mode Selector */}
            <div className="bg-[#2A0944] border-b border-[#580F96] text-white p-2 flex justify-center space-x-2">
              <Button
                variant={viewMode === 'side-by-side' ? 'primary' : 'ghost'}
                size="sm"
                leftIcon={<Columns size={16} />}
                onClick={() => setViewMode('side-by-side')}
                className="text-white hover:text-white"
              >
                Side by Side
              </Button>
              <Button
                variant={viewMode === 'preview-only' ? 'primary' : 'ghost'}
                size="sm"
                leftIcon={<Tv size={16} />}
                onClick={() => setViewMode('preview-only')}
                className="text-white hover:text-white"
              >
                Preview Only
              </Button>
              <Button
                variant={viewMode === 'program-only' ? 'primary' : 'ghost'}
                size="sm"
                leftIcon={<LayoutGrid size={16} />}
                onClick={() => setViewMode('program-only')}
                className="text-white hover:text-white"
              >
                Program Only
              </Button>
            </div>

            <div className="h-full flex flex-col">
              {/* Preview/Program Windows Container */}
              <div className="flex-none p-4 bg-[#1a1625]">
                <div className={`relative ${viewMode === 'side-by-side' ? 'flex items-center justify-center gap-4' : ''} h-[35vh] min-h-[250px] max-h-[350px] max-w-[1600px] mx-auto`}>
                {(viewMode === 'side-by-side' || viewMode === 'preview-only') && (
                  <div className="h-full bg-gray-900 rounded-lg overflow-hidden aspect-video" style={{ 
                    width: viewMode === 'side-by-side' ? 'calc(45% - 40px)' : '100%',
                    maxWidth: viewMode === 'side-by-side' ? '720px' : '1280px'
                  }}>
                    <StreamPreview isProgramView={false} />
                  </div>
                )}
                
                {/* Transition Panel */}
                {viewMode === 'side-by-side' && (
                  <div className="flex flex-col items-center justify-center w-[120px]">
                    <div className="bg-[#2A0944] rounded-lg p-3 shadow-lg border border-[#8E05C2] space-y-3">
                      {/* Transition Type Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-12 rounded-lg bg-[#580F96] bg-opacity-20 hover:bg-opacity-30 flex flex-col items-center justify-center group"
                          title="Fade Transition"
                        >
                          <Layers size={16} className="text-white mb-1" />
                          <span className="text-[10px] text-white">Fade</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-12 rounded-lg bg-[#580F96] bg-opacity-20 hover:bg-opacity-30 flex flex-col items-center justify-center group"
                          title="Cut Transition"
                        >
                          <Scissors size={16} className="text-white mb-1" />
                          <span className="text-[10px] text-white">Cut</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-12 rounded-lg bg-[#580F96] bg-opacity-20 hover:bg-opacity-30 flex flex-col items-center justify-center group"
                          title="Slide Transition"
                        >
                          <MoveHorizontal size={16} className="text-white mb-1" />
                          <span className="text-[10px] text-white">Slide</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-12 rounded-lg bg-[#580F96] bg-opacity-20 hover:bg-opacity-30 flex flex-col items-center justify-center group"
                          title="Zoom Transition"
                        >
                          <ZoomIn size={16} className="text-white mb-1" />
                          <span className="text-[10px] text-white">Zoom</span>
                        </Button>
                      </div>
                      
                      {/* Quick Transition Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-12 rounded-lg bg-[#580F96] bg-opacity-20 hover:bg-opacity-30 flex flex-col items-center justify-center group"
                        title="Quick Transition"
                      >
                        <ArrowRight size={20} className="text-white mb-1" />
                        <span className="text-[10px] text-white">Transition</span>
                      </Button>
                      
                      {/* Duration Slider */}
                      <div className="space-y-1">
                        <input
                          type="range"
                          min="100"
                          max="2000"
                          step="100"
                          defaultValue="300"
                          className="w-full h-1 bg-[#580F96] rounded-lg appearance-none cursor-pointer accent-[#8E05C2]"
                          aria-label="Transition duration"
                        />
                        <div className="text-[10px] text-white text-center">
                          300ms
                        </div>
                      </div>
                    </div>
                    <div className="h-[2px] w-full bg-gradient-to-r from-[#2A0944] via-[#8E05C2] to-[#2A0944] mt-2"></div>
                  </div>
                )}
                
                {(viewMode === 'side-by-side' || viewMode === 'program-only') && (
                  <div className="h-full bg-gray-900 rounded-lg overflow-hidden aspect-video" style={{ 
                    width: viewMode === 'side-by-side' ? 'calc(45% - 40px)' : '100%',
                    maxWidth: viewMode === 'side-by-side' ? '720px' : '1280px'
                  }}>
                    <StreamPreview isProgramView={true} />
                  </div>
                )}
                </div>
              </div>

              {/* Tabs Navigation */}
              <PanelTabs />

              {/* Panels Grid */}
              <PanelsGrid />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </PanelManager>
  );
};

export default Dashboard;