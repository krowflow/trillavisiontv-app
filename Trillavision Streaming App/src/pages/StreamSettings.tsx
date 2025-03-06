import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { StreamSettings as StreamSettingsComponent } from '../components/stream/StreamSettings';
import { YouTubeAuth } from '../components/auth/YouTubeAuth';

/**
 * Stream settings page
 */
const StreamSettings: React.FC = () => {
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
            <h1 className="text-2xl font-bold mb-6">Stream Settings</h1>
            
            <div className="grid grid-cols-1 gap-6">
              <YouTubeAuth onAuthSuccess={() => {}} />
              <StreamSettingsComponent />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StreamSettings;