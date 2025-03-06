import React, { useState, useEffect } from 'react';
import { useYouTubeAPI } from '../../hooks/useYouTubeAPI';
import { Button } from '../ui/Button';
import { Youtube, Check, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { logger, LogCategory } from '../../utils/logging';

interface YouTubeAuthProps {
  onAuthSuccess?: () => void;
}

/**
 * YouTube authentication component
 */
export const YouTubeAuth: React.FC<YouTubeAuthProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthorized, getAuthUrl } = useYouTubeAPI();
  
  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        setIsLoading(true);
        setError(null);
        
        try {
          logger.info(LogCategory.AUTH, 'Processing OAuth callback code');
          // The actual authorization is handled by the YouTubeAuthCallback component
          // This is just a fallback in case the user lands here with a code
          
          // Remove code from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
        } catch (err) {
          setError('An error occurred during authorization');
          logger.error(LogCategory.AUTH, 'Error processing OAuth callback', { error: err });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    handleOAuthCallback();
  }, [onAuthSuccess]);
  
  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authUrl = await getAuthUrl();
      
      if (authUrl) {
        logger.info(LogCategory.AUTH, 'Redirecting to YouTube auth page');
        // Save current path in state parameter for redirect after auth
        const currentPath = window.location.pathname;
        const stateParam = encodeURIComponent(currentPath);
        const authUrlWithState = `${authUrl}&state=${stateParam}`;
        
        // Redirect to YouTube auth page
        window.location.href = authUrlWithState;
      } else {
        setError('Failed to get authorization URL');
        logger.error(LogCategory.AUTH, 'Failed to get YouTube auth URL');
      }
    } catch (err) {
      setError('An error occurred');
      logger.error(LogCategory.AUTH, 'Error initiating YouTube auth', { error: err });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isAuthorized) {
    return (
      <Card className="p-4 bg-green-50 border border-green-200">
        <div className="flex items-center">
          <Check size={20} className="text-green-500 mr-2" />
          <span className="text-green-700 font-medium">Connected to YouTube</span>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Connect to YouTube</h2>
        <p className="text-gray-600 mb-4">
          Connect your YouTube account to enable live streaming directly from Trillavision T.V.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
        )}
        
        <Button
          variant="primary"
          leftIcon={<Youtube size={18} />}
          onClick={handleConnect}
          isLoading={isLoading}
          fullWidth
        >
          {isLoading ? 'Connecting...' : 'Connect to YouTube'}
        </Button>
      </Card>
    </div>
  );
};