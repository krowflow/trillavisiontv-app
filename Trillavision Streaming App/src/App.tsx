import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import StreamSettings from './pages/StreamSettings';
import BrandSettings from './pages/BrandSettings';
import AppSettings from './pages/AppSettings';
import YouTubeIntegration from './pages/YouTubeIntegration';
import YouTubeAuthCallback from './components/auth/YouTubeAuthCallback';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="min-h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth/youtube/callback" element={<YouTubeAuthCallback />} />
              <Route path="/settings/stream" element={<StreamSettings />} />
              <Route path="/settings/brand" element={<BrandSettings />} />
              <Route path="/settings/app" element={<AppSettings />} />
              <Route path="/youtube-integration" element={<YouTubeIntegration />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;