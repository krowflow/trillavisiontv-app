import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYouTubeAPI } from '../hooks/useYouTubeAPI';
import { Loader } from 'lucide-react';

/**
 * Auth callback page for handling OAuth redirects
 */
const AuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { authorize } = useYouTubeAPI();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (!code) {
        setError('No authorization code provided');
        return;
      }
      
      try {
        const success = await authorize(code);
        
        if (success) {
          // Redirect to the dashboard or the page specified in state
          navigate(state || '/dashboard');
        } else {
          setError('Failed to authorize with YouTube');
        }
      } catch (err) {
        console.error('Authorization error:', err);
        setError('An error occurred during authorization');
      }
    };
    
    handleCallback();
  }, [authorize, navigate]);
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="animate-spin mb-4">
        <Loader size={48} className="text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700">Authorizing with YouTube...</h2>
      <p className="text-gray-500 mt-2">Please wait while we complete the authorization process.</p>
    </div>
  );
};

export default AuthCallback;