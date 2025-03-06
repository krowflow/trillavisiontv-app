import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing podcasting mode
 * This hook provides a way to toggle between single microphone and dual microphone modes
 * and persists the setting in localStorage
 */
export const usePodcastingMode = () => {
  const [isPodcastingMode, setIsPodcastingMode] = useState<boolean>(() => {
    try {
      // Initialize from localStorage if available
      const savedMode = localStorage.getItem('podcastingMode');
      return savedMode === 'true';
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return false;
    }
  });
  
  // Listen for storage events from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'podcastingMode') {
        try {
          const newValue = e.newValue === 'true';
          if (newValue !== isPodcastingMode) {
            setIsPodcastingMode(newValue);
          }
        } catch (error) {
          console.error('Error handling storage event:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isPodcastingMode]);
  
  // Toggle podcasting mode
  const togglePodcastingMode = useCallback(() => {
    try {
      const newValue = !isPodcastingMode;
      setIsPodcastingMode(newValue);
      // Save to localStorage
      localStorage.setItem('podcastingMode', String(newValue));
    } catch (error) {
      console.error('Error toggling podcasting mode:', error);
    }
  }, [isPodcastingMode]);
  
  // Enable podcasting mode
  const enablePodcastingMode = useCallback(() => {
    try {
      setIsPodcastingMode(true);
      localStorage.setItem('podcastingMode', 'true');
    } catch (error) {
      console.error('Error enabling podcasting mode:', error);
    }
  }, []);
  
  // Disable podcasting mode
  const disablePodcastingMode = useCallback(() => {
    try {
      setIsPodcastingMode(false);
      localStorage.setItem('podcastingMode', 'false');
    } catch (error) {
      console.error('Error disabling podcasting mode:', error);
    }
  }, []);
  
  return {
    isPodcastingMode,
    togglePodcastingMode,
    enablePodcastingMode,
    disablePodcastingMode
  };
};

export default usePodcastingMode;