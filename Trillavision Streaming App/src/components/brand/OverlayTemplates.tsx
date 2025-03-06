import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OverlayTemplate, OverlayType } from '../../types';
import { 
  Layout, 
  Image, 
  Type, 
  Palette, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Edit2,
  AlertTriangle,
  Radio,
  MapPin,
  Hash,
  MessageSquare,
  TrendingUp,
  Globe,
  Users,
  Clock,
  X,
  Tv
} from 'lucide-react';
import { logger, LogCategory } from '../../utils/logging';

interface OverlayTemplatesProps {
  onSelectTemplate?: (template: OverlayTemplate) => void;
  onClose?: () => void;
}

export const OverlayTemplates: React.FC<OverlayTemplatesProps> = ({ 
  onSelectTemplate,
  onClose
}) => {
  // Templates state
  const [templates, setTemplates] = useState<OverlayTemplate[]>([
    // Trillavision T.V. Templates
    {
      id: 'template-breaking',
      name: 'Breaking News Alert',
      type: OverlayType.CUSTOM,
      previewUrl: 'https://images.unsplash.com/photo-1495563381401-ecfeb17f5e69?w=300&h=200&fit=crop&auto=format',
      content: `<div class="flex flex-col">
        <div class="flex items-center">
          <span class="text-red-500 mr-2">⚠</span>
          <span class="text-red-500 font-bold">BREAKING NEWS</span>
        </div>
        <div class="text-white font-bold mt-1">Trillavision T.V.</div>
        <div class="text-white opacity-80 mt-1">Live from the streets</div>
      </div>`,
      defaultSettings: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderLeft: '4px solid #ef4444'
      }
    },
    {
      id: 'template-location',
      name: 'Location Tag',
      type: OverlayType.TEXT,
      previewUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop&auto=format',
      content: `<div class="flex flex-col">
        <div class="flex items-center">
          <span class="text-red-500 mr-1">📍</span>
          <span class="text-white font-medium">Downtown District</span>
        </div>
        <div class="text-white opacity-80 text-xs mt-1">Trillavision T.V.</div>
      </div>`,
      defaultSettings: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '12px',
        borderRadius: '8px'
      }
    },
    {
      id: 'template-real-issues',
      name: 'Real Issues',
      type: OverlayType.TEXT,
      previewUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&h=200&fit=crop&auto=format',
      content: `<div class="flex flex-col">
        <div class="text-white font-medium">True Street News: Real Issues</div>
        <div class="text-white opacity-80 text-sm">Street Coverage</div>
        <div class="flex items-center mt-1">
          <span class="text-primary mr-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M8 21h8"></path>
              <path d="M12 17v4"></path>
            </svg>
          </span>
          <span class="text-primary text-xs">Live Coverage</span>
        </div>
      </div>`,
      defaultSettings: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '16px',
        borderLeft: '4px solid #580F96'
      }
    },
    {
      id: 'template-branding',
      name: 'Trillavision Brand',
      type: OverlayType.CUSTOM,
      previewUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=200&fit=crop&auto=format',
      content: `<div class="flex items-center space-x-2 bg-black bg-opacity-80 p-3 rounded">
        <span class="text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M8 21h8"></path>
            <path d="M12 17v4"></path>
          </svg>
        </span>
        <span class="text-white font-medium">Trillavision T.V.</span>
      </div>`,
      defaultSettings: {
        backgroundColor: 'transparent'
      }
    }
  ]);

  // Selected template state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // New template form state
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<OverlayTemplate>>({
    name: '',
    type: OverlayType.TEXT,
    content: '',
    defaultSettings: {}
  });
  
  // Edit mode state
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  
  // Copy success state
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  
  // Get the selected template
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    
    if (template && onSelectTemplate) {
      onSelectTemplate(template);
      logger.debug(LogCategory.UI, 'Template selected', { templateId, templateName: template.name });
    }
  };

  // Get template icon based on type
  const getTemplateIcon = (template: OverlayTemplate) => {
    switch (template.id) {
      case 'template-breaking':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'template-location':
        return <MapPin size={16} className="text-primary" />;
      case 'template-real-issues':
        return <Radio size={16} className="text-primary" />;
      case 'template-branding':
        return <Tv size={16} className="text-primary" />;
      default:
        return <Layout size={16} className="text-primary" />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Overlay Templates</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Trillavision T.V. Templates */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Tv size={16} className="text-primary mr-2" />
          Trillavision T.V. Templates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className={`bg-white rounded-lg border overflow-hidden transition-all ${
                template.id === selectedTemplateId
                  ? 'border-primary ring-2 ring-primary ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="h-32 bg-gray-900 relative cursor-pointer"
                onClick={() => handleSelectTemplate(template.id)}
              >
                <img 
                  src={template.previewUrl} 
                  alt={template.name}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4" dangerouslySetInnerHTML={{ __html: template.content }} />
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {getTemplateIcon(template)}
                    <h3 className="font-medium text-sm ml-2">{template.name}</h3>
                  </div>
                  <span className="text-xs text-gray-500">{template.type}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onSelectTemplate) {
                      onSelectTemplate(template);
                    }
                  }}
                  fullWidth
                  className="mt-2"
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverlayTemplates;