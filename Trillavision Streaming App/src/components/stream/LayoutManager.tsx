import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Layout } from 'lucide-react';

interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  config: {
    rows: number;
    cols: number;
    areas: string[];
  };
}

interface LayoutManagerProps {
  onClose?: () => void;
}

export const LayoutManager: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-base font-semibold">Layouts</h2>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Plus size={14} />}
          className="h-5 px-1.5 text-[11px] hover:bg-primary/10"
        >
          Add Layout
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-center text-gray-500 py-4">
          <Layout size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-[11px]">No layouts created</p>
          <p className="text-[10px] text-gray-400">Create your first layout to get started</p>
        </div>
      </div>
    </div>
  );
};

export default LayoutManager;