import React, { useState, useEffect, createContext, useContext } from 'react';
import { logger, LogCategory } from '../../utils/logging';

// Define the panel types
export type PanelId = 
  | 'streamControls'
  | 'deviceSettings'
  | 'sceneManager'
  | 'sourceManager'
  | 'layoutManager'
  | 'brandSettings'
  | 'streamSettings'
  | 'chat'
  | 'audioMixer'
  | 'analytics'
  | 'sceneTransition'
  | 'overlayTemplates'
  | 'recording';

// Define the panel context
interface PanelContextType {
  activePanels: Record<PanelId, boolean>;
  panelOpenTimes: Record<PanelId, number>;
  panelLastUsed: Record<PanelId, number>;
  openPanel: (panel: PanelId, exclusive?: boolean) => void;
  closePanel: (panel: PanelId) => void;
  togglePanel: (panel: PanelId) => void;
  focusPanel: (panel: PanelId) => void;
  isPanelActive: (panel: PanelId) => boolean;
  getActivePanelCount: () => number;
}

// Create the panel context
const PanelContext = createContext<PanelContextType | undefined>(undefined);

// Define the panel manager props
interface PanelManagerProps {
  children: React.ReactNode;
  maxPanels?: number;
  replacementStrategy?: 'fifo' | 'lru';
  initialPanels?: Partial<Record<PanelId, boolean>>;
}

/**
 * PanelManager component for managing panel state and behavior
 * Handles panel opening, closing, and replacement logic
 */
export const PanelManager: React.FC<PanelManagerProps> = ({
  children,
  maxPanels = 4,
  replacementStrategy = 'fifo',
  initialPanels = {}
}) => {
  // Initialize panel state
  const [activePanels, setActivePanels] = useState<Record<PanelId, boolean>>({
    streamControls: false,
    deviceSettings: false,
    sceneManager: false,
    sourceManager: false,
    layoutManager: false,
    brandSettings: false,
    streamSettings: false,
    chat: false,
    audioMixer: false,
    analytics: false,
    sceneTransition: false,
    overlayTemplates: false,
    recording: false,
    ...initialPanels
  });

  // Track when each panel was opened
  const [panelOpenTimes, setPanelOpenTimes] = useState<Record<PanelId, number>>({} as Record<PanelId, number>);

  // Track when each panel was last used
  const [panelLastUsed, setPanelLastUsed] = useState<Record<PanelId, number>>({} as Record<PanelId, number>);

  // Initialize panel open times for active panels
  useEffect(() => {
    const now = Date.now();
    const initialOpenTimes: Record<PanelId, number> = {} as Record<PanelId, number>;
    const initialLastUsed: Record<PanelId, number> = {} as Record<PanelId, number>;
    
    Object.entries(activePanels).forEach(([panel, isActive]) => {
      if (isActive) {
        initialOpenTimes[panel as PanelId] = now - Math.random() * 1000; // Stagger slightly
        initialLastUsed[panel as PanelId] = now;
      }
    });
    
    setPanelOpenTimes(initialOpenTimes);
    setPanelLastUsed(initialLastUsed);
  }, []);

  // Get the number of active panels
  const getActivePanelCount = () => {
    return Object.values(activePanels).filter(Boolean).length;
  };

  // Check if a panel is active
  const isPanelActive = (panel: PanelId) => {
    return activePanels[panel];
  };

  // Open a panel
  const openPanel = (panel: PanelId, exclusive = false) => {
    // If the panel is already open, just focus it
    if (activePanels[panel]) {
      focusPanel(panel);
      return;
    }

    setActivePanels(prev => {
      // If exclusive mode, close all other panels
      if (exclusive) {
        const newPanels = Object.keys(prev).reduce((acc, key) => ({
          ...acc,
          [key]: key === panel
        }), {} as Record<PanelId, boolean>);
        return newPanels;
      }
      
      // Count currently active panels
      const activeCount = Object.values(prev).filter(Boolean).length;
      
      // If we're at max capacity, replace a panel based on strategy
      if (activeCount >= maxPanels) {
        let panelToReplace: PanelId | null = null;
        
        if (replacementStrategy === 'fifo') {
          // Find the oldest panel (First In, First Out)
          const oldestPanel = Object.entries(prev)
            .filter(([_, isActive]) => isActive)
            .sort((a, b) => {
              const aTime = panelOpenTimes[a[0] as PanelId] || 0;
              const bTime = panelOpenTimes[b[0] as PanelId] || 0;
              return aTime - bTime;
            });
          
          if (oldestPanel.length > 0) {
            panelToReplace = oldestPanel[0][0] as PanelId;
          }
        } else if (replacementStrategy === 'lru') {
          // Find the least recently used panel
          const lruPanel = Object.entries(prev)
            .filter(([_, isActive]) => isActive)
            .sort((a, b) => {
              const aTime = panelLastUsed[a[0] as PanelId] || 0;
              const bTime = panelLastUsed[b[0] as PanelId] || 0;
              return aTime - bTime;
            });
          
          if (lruPanel.length > 0) {
            panelToReplace = lruPanel[0][0] as PanelId;
          }
        }
        
        // Replace the panel
        if (panelToReplace) {
          logger.debug(LogCategory.UI, `Replacing panel ${panelToReplace} with ${panel}`);
          return {
            ...prev,
            [panelToReplace]: false,
            [panel]: true
          };
        }
      }
      
      // Otherwise just open the new panel
      return { ...prev, [panel]: true };
    });
    
    // Record open time and last used time
    const now = Date.now();
    setPanelOpenTimes(prev => ({
      ...prev,
      [panel]: now
    }));
    setPanelLastUsed(prev => ({
      ...prev,
      [panel]: now
    }));
    
    logger.debug(LogCategory.UI, `Panel ${panel} opened`);
  };

  // Close a panel
  const closePanel = (panel: PanelId) => {
    setActivePanels(prev => ({ ...prev, [panel]: false }));
    logger.debug(LogCategory.UI, `Panel ${panel} closed`);
  };

  // Toggle a panel
  const togglePanel = (panel: PanelId) => {
    if (activePanels[panel]) {
      closePanel(panel);
    } else {
      openPanel(panel);
    }
  };

  // Focus a panel (mark as recently used)
  const focusPanel = (panel: PanelId) => {
    if (!activePanels[panel]) return;
    
    const now = Date.now();
    setPanelLastUsed(prev => ({
      ...prev,
      [panel]: now
    }));
    
    logger.debug(LogCategory.UI, `Panel ${panel} focused`);
  };

  // Provide the panel context
  const contextValue: PanelContextType = {
    activePanels,
    panelOpenTimes,
    panelLastUsed,
    openPanel,
    closePanel,
    togglePanel,
    focusPanel,
    isPanelActive,
    getActivePanelCount
  };

  return (
    <PanelContext.Provider value={contextValue}>
      {children}
    </PanelContext.Provider>
  );
};

// Custom hook to use the panel context
export const usePanelManager = () => {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error('usePanelManager must be used within a PanelManager');
  }
  return context;
};

export default PanelManager;