import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setYouTubeConnection } from '../../store/slices/streamSlice';
import { useYouTubeAPI } from '../../hooks/useYouTubeAPI';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { logger, LogCategory } from '../../utils/logging';

/**
 * YouTube OAuth callback component
 * This component handles the OAuth callback from YouTube
 */
const YouTubeAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const { authorize } = useYouTubeAPI();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (!code) {
        setStatus('error');
        setError('No authorization code provided');
        logger.error(LogCategory.AUTH, 'YouTube OAuth callback missing code parameter');
        return;
      }
      
      try {
        logger.info(LogCategory.AUTH, 'Processing YouTube OAuth callback', { state });
        const success = await authorize(code);
        
        if (success) {
          setStatus('success');
          dispatch(setYouTubeConnection(true));
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            // Redirect to the state parameter or dashboard
            navigate(state ? decodeURIComponent(state) : '/youtube-integration');
          }, 2000);
        } else {
          setStatus('error');
          setError('Failed to authorize with YouTube');
          logger.error(LogCategory.AUTH, 'YouTube authorization failed');
        }
      } catch (err) {
        setStatus('error');
        setError('An error occurred during authorization');
        logger.error(LogCategory.AUTH, 'YouTube authorization error', { error: err });
      }
    };
    
    handleCallback();
  }, [authorize, navigate, location.search, dispatch]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-md w-full p-8">
        {status === 'loading' && (
          <div className="text-center">
            <Loader size={48} className="text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Connecting to YouTube</h1>
            <p className="text-gray-600">Please wait while we complete the authorization process...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Successfully Connected!</h1>
            <p className="text-gray-600 mb-6">Your YouTube account has been successfully connected to Trillavision T.V.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/youtube-integration')}
              fullWidth
            >
              Continue to YouTube Integration
            </Button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Authorization Error</h1>
            <p className="text-gray-600 mb-6">{error || 'An unknown error occurred during authorization.'}</p>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => navigate('/youtube-integration')}
                fullWidth
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                fullWidth
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default YouTubeAuthCallback;