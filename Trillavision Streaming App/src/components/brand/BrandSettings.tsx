import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateBrandSettings, addOverlay, removeOverlay, toggleOverlayVisibility } from '../../store/slices/brandSlice';
import { OverlayType } from '../../types';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { OverlayPreview } from './OverlayPreview';
import { 
  Palette, 
  Image, 
  Type, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  Settings, 
  Layout, 
  Clock, 
  Globe,
  AlertTriangle,
  MessageSquare,
  Radio,
  MapPin,
  Hash,
  TrendingUp
} from 'lucide-react';

export const BrandSettings: React.FC = () => {
  const dispatch = useDispatch();
  const brandSettings = useSelector((state: RootState) => state.brand);
  
  const [overlayName, setOverlayName] = useState('');
  const [overlayType, setOverlayType] = useState<OverlayType>(OverlayType.TEXT);
  const [overlayContent, setOverlayContent] = useState('');
  
  const handleUpdateBrandName = (name: string) => {
    dispatch(updateBrandSettings({ name }));
  };
  
  const handleUpdateColors = (colors: { primary: string; secondary: string }) => {
    dispatch(updateBrandSettings({ colors }));
  };
  
  const handleAddOverlay = () => {
    if (!overlayName.trim() || !overlayContent.trim()) return;
    
    const newOverlay = {
      id: `overlay-${Date.now()}`,
      name: overlayName,
      type: overlayType,
      content: overlayContent,
      position: { x: 50, y: 50, width: 200, height: 100 },
      style: {},
      visible: true
    };
    
    dispatch(addOverlay(newOverlay));
    setOverlayName('');
    setOverlayContent('');
  };

  const handleUseTemplate = (template: any) => {
    dispatch(addOverlay({
      id: `overlay-${Date.now()}`,
      name: template.name,
      type: template.type,
      content: template.content,
      position: template.position,
      style: template.style,
      visible: true
    }));
  };
  
  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings size={16} />,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Identity</h3>
            <div className="space-y-4">
              <Input
                label="Brand Name"
                value={brandSettings.name}
                onChange={(e) => handleUpdateBrandName(e.target.value)}
                fullWidth
              />
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={brandSettings.colors.primary}
                        onChange={(e) => handleUpdateColors({
                          ...brandSettings.colors,
                          primary: e.target.value
                        })}
                        className="w-12 h-12 rounded-lg border border-gray-200 p-1 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={brandSettings.colors.primary}
                      onChange={(e) => handleUpdateColors({
                        ...brandSettings.colors,
                        primary: e.target.value
                      })}
                      className="font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={brandSettings.colors.secondary}
                        onChange={(e) => handleUpdateColors({
                          ...brandSettings.colors,
                          secondary: e.target.value
                        })}
                        className="w-12 h-12 rounded-lg border border-gray-200 p-1 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={brandSettings.colors.secondary}
                      onChange={(e) => handleUpdateColors({
                        ...brandSettings.colors,
                        secondary: e.target.value
                      })}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary bg-opacity-5 rounded-lg p-4">
            <div className="flex items-center text-primary mb-2">
              <Palette size={18} className="mr-2" />
              <h4 className="font-medium">Preview</h4>
            </div>
            <div 
              className="h-32 rounded-lg border-2 border-dashed"
              style={{ borderColor: brandSettings.colors.primary }}
            >
              <div className="h-full flex items-center justify-center">
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: brandSettings.colors.primary }}
                >
                  {brandSettings.name}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'overlays',
      label: 'Overlays',
      icon: <Image size={16} />,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Overlay</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Overlay Name"
                  value={overlayName}
                  onChange={(e) => setOverlayName(e.target.value)}
                  placeholder="Enter overlay name"
                  fullWidth
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overlay Type
                  </label>
                  <select
                    value={overlayType}
                    onChange={(e) => setOverlayType(e.target.value as OverlayType)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value={OverlayType.TEXT}>Text</option>
                    <option value={OverlayType.IMAGE}>Image</option>
                    <option value={OverlayType.TIMER}>Timer</option>
                    <option value={OverlayType.SOCIAL}>Social</option>
                    <option value={OverlayType.CUSTOM}>Custom</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={overlayContent}
                  onChange={(e) => setOverlayContent(e.target.value)}
                  placeholder="Enter overlay content..."
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary min-h-[100px]"
                />
              </div>
              
              <Button
                onClick={handleAddOverlay}
                disabled={!overlayName.trim() || !overlayContent.trim()}
                leftIcon={<Plus size={16} />}
                fullWidth
              >
                Add Overlay
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <OverlayPreview />
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Overlays</h3>
            
            {brandSettings.overlays.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Image size={32} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500">No overlays created yet</p>
                <p className="text-sm text-gray-400">Add your first overlay above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {brandSettings.overlays.map((overlay) => (
                  <div
                    key={overlay.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {overlay.name}
                        </span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary bg-opacity-10 text-primary">
                          {overlay.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {overlay.content}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Position: {Math.round(overlay.position.x)}, {Math.round(overlay.position.y)} | 
                        Size: {Math.round(overlay.position.width)} × {Math.round(overlay.position.height)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(toggleOverlayVisibility(overlay.id))}
                        className={overlay.visible ? 'text-primary' : 'text-gray-400'}
                      >
                        {overlay.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(removeOverlay(overlay.id))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <Layout size={16} />,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Street News Overlays</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Breaking News Alert */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1495563381401-ecfeb17f5e69?w=300&h=200&fit=crop&auto=format" 
                    alt="Breaking News Template"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="text-red-500 mr-2" size={20} />
                      <span className="text-red-500 font-bold text-sm">BREAKING NEWS</span>
                    </div>
                    <div className="text-white font-bold mt-1">True Street News: Real Issues</div>
                    <div className="text-white text-sm opacity-80 mt-1">Live from the streets</div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Breaking News Alert</h4>
                  <p className="text-xs text-gray-500 mt-1">Dynamic breaking news overlay with urban style</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleUseTemplate({
                      name: "Breaking News Alert",
                      type: OverlayType.CUSTOM,
                      content: `<div class="flex flex-col">
                        <div class="flex items-center">
                          <span class="text-red-500 mr-2">⚠</span>
                          <span class="text-red-500 font-bold">BREAKING NEWS</span>
                        </div>
                        <div class="text-white font-bold mt-1">True Street News: Real Issues</div>
                        <div class="text-white opacity-80 mt-1">Live from the streets</div>
                      </div>`,
                      position: { x: 40, y: 40, width: 400, height: 120 },
                      style: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '20px', borderLeft: '4px solid #ef4444' }
                    })}
                  >
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Location Tag */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop&auto=format" 
                    alt="Location Tag Template"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-red-500 mr-1" />
                      <span className="text-white font-medium">Downtown District</span>
                    </div>
                    <div className="text-white text-xs opacity-80 mt-1">Live Street Coverage</div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Location Tag</h4>
                  <p className="text-xs text-gray-500 mt-1">Show location context for street reporting</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleUseTemplate({
                      name: "Location Tag",
                      type: OverlayType.TEXT,
                      content: `<div class="flex flex-col">
                        <div class="flex items-center">
                          <span class="text-red-500 mr-1">📍</span>
                          <span class="text-white font-medium">Downtown District</span>
                        </div>
                        <div class="text-white opacity-80 text-xs mt-1">Live Street Coverage</div>
                      </div>`,
                      position: { x: 40, y: 400, width: 250, height: 80 },
                      style: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '12px', borderRadius: '8px' }
                    })}
                  >
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Topic Highlight */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1557683311-eac922347aa1?w=300&h=200&fit=crop&auto=format" 
                    alt="Topic Highlight Template"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">#COMMUNITY</span>
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">#JUSTICE</span>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">#CHANGE</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Topic Highlight</h4>
                  <p className="text-xs text-gray-500 mt-1">Highlight key topics and hashtags</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleUseTemplate({
                      name: "Topic Highlight",
                      type: OverlayType.CUSTOM,
                      content: `<div class="flex items-center space-x-2">
                        <span class="bg-red-500 text-white text-xs px-2 py-1 rounded">#COMMUNITY</span>
                        <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded">#JUSTICE</span>
                        <span class="bg-green-500 text-white text-xs px-2 py-1 rounded">#CHANGE</span>
                      </div>`,
                      position: { x: 40, y: 40, width: 300, height: 40 },
                      style: { backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '8px', borderRadius: '4px' }
                    })}
                  >
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Street Interview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&h=200&fit=crop&auto=format" 
                    alt="Street Interview Template"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <div className="text-white font-medium">John Smith</div>
                    <div className="text-white text-xs opacity-80">Community Activist</div>
                    <div className="flex items-center mt-1">
                      <Radio size={12} className="text-red-500 mr-1" />
                      <span className="text-red-500 text-xs">LIVE INTERVIEW</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Street Interview</h4>
                  <p className="text-xs text-gray-500 mt-1">Lower third for street interviews</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleUseTemplate({
                      name: "Street Interview",
                      type: OverlayType.TEXT,
                      content: `<div class="flex flex-col">
                        <div class="text-white font-medium">John Smith</div>
                        <div class="text-white opacity-80 text-sm">Community Activist</div>
                        <div class="flex items-center mt-1">
                          <span class="text-red-500 mr-1">⚫</span>
                          <span class="text-red-500 text-xs">LIVE INTERVIEW</span>
                        </div>
                      </div>`,
                      position: { x: 40, y: 360, width: 300, height: 100 },
                      style: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '16px', borderLeft: '4px solid #580F96' }
                    })}
                  >
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Statistics Panel */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&auto=format" 
                    alt="Statistics Panel Template"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-80 p-4 rounded">
                      <div className="text-white text-sm font-medium mb-2">Community Impact</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-green-500 text-lg font-bold">+24%</div>
                          <div className="text-white text-xs">Growth</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-500 text-lg font-bold">1.2K</div>
                          <div className="text-white text-xs">Responses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Statistics Panel</h4>
                  <p className="text-xs text-gray-500 mt-1">Display key statistics and metrics</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleUseTemplate({
                      name: "Statistics Panel",
                      type: OverlayType.CUSTOM,
                      content: `<div class="bg-black bg-opacity-80 p-4 rounded">
                        <div class="text-white text-sm font-medium mb-2">Community Impact</div>
                        <div class="grid grid-cols-2 gap-4">
                          <div class="text-center">
                            <div class="text-green-500 text-lg font-bold">+24%</div>
                            <div class="text-white text-xs">Growth</div>
                          </div>
                          <div class="text-center">
                            <div class="text-blue-500 text-lg font-bold">1.2K</div>
                            <div class="text-white text-xs">Responses</div>
                          </div>
                        </div>
                      </div>`,
                      position: { x: 40, y: 40, width: 200, height: 120 },
                      style: { borderRadius: '8px' }
                    })}
                  >
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Social Impact */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-900 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop&auto=format" 
                    alt="Social Impact Template"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare size={16} className="text-primary mr-2" />
                        <span className="text-white">Join the Conversation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash size={16} className="text-primary" />
                        <span className="text-white">TrueStreetNews</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">Social Impact</h4>
                  <p className="text-xs text-gray-500 mt-1">Engage viewers with social media</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleUseTemplate({
                      name: "Social Impact",
                      type: OverlayType.CUSTOM,
                      content: `<div class="flex items-center justify-between bg-black bg-opacity-80 p-3">
                        <div class="flex items-center">
                          <span class="text-primary mr-2">💬</span>
                          <span class="text-white">Join the Conversation</span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span class="text-primary">#</span>
                          <span class="text-white">TrueStreetNews</span>
                        </div>
                      </div>`,
                      position: { x: 0, y: 400, width: '100%', height: 60 },
                      style: {}
                    })}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default BrandSettings;