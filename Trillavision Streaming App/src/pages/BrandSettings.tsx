import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { BrandSettings as BrandSettingsComponent } from '../components/brand/BrandSettings';

/**
 * Brand settings page
 */
const BrandSettings: React.FC = () => {
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
            <h1 className="text-2xl font-bold mb-6">Brand Settings</h1>
            <BrandSettingsComponent />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BrandSettings;