import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setYouTubeConnection } from '../store/slices/streamSlice';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toggle } from '../components/ui/Toggle';
import { YouTubeAuth } from '../components/auth/YouTubeAuth';
import { useYouTubeAPI } from '../hooks/useYouTubeAPI';
import { logger, LogCategory } from '../utils/logging';
import { 
  Youtube, 
  Check, 
  AlertCircle, 
  Settings, 
  Video, 
  Users, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff,
  Calendar,
  Clock
} from 'lucide-react';

const YouTubeIntegration: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthorized } = useYouTubeAPI();
  const isConnectedToYouTube = useSelector((state: RootState) => state.stream.isConnectedToYouTube);
  
  const [streamTitle, setStreamTitle] = useState('Trillavision T.V. Live Stream');
  const [streamDescription, setStreamDescription] = useState('Live stream powered by Trillavision T.V.');
  const [isPrivate, setIsPrivate] = useState(true);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // YouTube channel stats (mock data)
  const [channelStats, setChannelStats] = useState({
    subscribers: 1250,
    totalViews: 45600,
    lastStreamViewers: 87,
    averageWatchTime: '8:24',
    topLocation: 'United States'
  });
  
  // Recent broadcasts (mock data)
  const [recentBroadcasts, setRecentBroadcasts] = useState([
    {
      id: 'broadcast-1',
      title: 'Introduction to Trillavision T.V.',
      date: '2025-03-15',
      duration: '1:24:36',
      views: 156,
      likes: 42
    },
    {
      id: 'broadcast-2',
      title: 'Podcast Episode #1 - Getting Started',
      date: '2025-03-10',
      duration: '0:48:12',
      views: 89,
      likes: 23
    },
    {
      id: 'broadcast-3',
      title: 'Live Q&A Session',
      date: '2025-03-05',
      duration: '0:32:45',
      views: 64,
      likes: 18
    }
  ]);
  
  useEffect(() => {
    // Update connection status in Redux store
    if (isAuthorized !== isConnectedToYouTube) {
      dispatch(setYouTubeConnection(isAuthorized));
    }
    
    logger.info(LogCategory.YOUTUBE, 'YouTube integration page loaded', { isAuthorized });
  }, [isAuthorized, isConnectedToYouTube, dispatch]);
  
  const handleCreateStream = () => {
    // Save stream settings to Redux store
    // This would typically dispatch an action to update stream settings
    logger.info(LogCategory.YOUTUBE, 'Stream settings saved', { 
      title: streamTitle, 
      description: streamDescription,
      isPrivate,
      isScheduled,
      scheduledTime
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const tabs = [
    {
      id: 'general',
      label: 'General',
      icon: <Settings size={16} />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <Globe size={16} />
    },
    {
      id: 'broadcasts',
      label: 'Broadcasts',
      icon: <Video size={16} />
    }
  ];
  
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
            <h1 className="text-2xl font-bold mb-6 flex items-center">
              <Youtube size={24} className="text-red-600 mr-2" />
              YouTube Integration
            </h1>
            
            <div className="grid grid-cols-1 gap-6">
              {!isAuthorized ? (
                <YouTubeAuth onAuthSuccess={() => {
                  dispatch(setYouTubeConnection(true));
                }} />
              ) : (
                <>
                  <Card className="p-4 bg-green-50 border border-green-200">
                    <div className="flex items-center">
                      <Check size={20} className="text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">Connected to YouTube</span>
                    </div>
                  </Card>
                  
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200">
                      <div className="flex">
                        {tabs.map(tab => (
                          <button
                            key={tab.id}
                            className={`px-4 py-3 flex items-center text-sm font-medium ${
                              activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            {tab.icon}
                            <span className="ml-2">{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {activeTab === 'general' && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-lg font-medium mb-4">Stream Settings</h2>
                            <div className="space-y-4">
                              <Input
                                label="Stream Title"
                                value={streamTitle}
                                onChange={(e) => setStreamTitle(e.target.value)}
                                placeholder="Enter a title for your stream"
                                fullWidth
                              />
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Stream Description
                                </label>
                                <textarea
                                  value={streamDescription}
                                  onChange={(e) => setStreamDescription(e.target.value)}
                                  placeholder="Enter a description for your stream"
                                  className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 min-h-[100px]"
                                />
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Lock size={16} className="text-gray-500" />
                                  <Toggle
                                    label="Private Stream"
                                    checked={isPrivate}
                                    onChange={setIsPrivate}
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Calendar size={16} className="text-gray-500" />
                                  <Toggle
                                    label="Schedule Stream"
                                    checked={isScheduled}
                                    onChange={setIsScheduled}
                                  />
                                </div>
                              </div>
                              
                              {isScheduled && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Scheduled Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
                                  />
                                </div>
                              )}
                              
                              <div className="pt-4">
                                <Button
                                  variant="primary"
                                  onClick={handleCreateStream}
                                  disabled={!streamTitle.trim()}
                                >
                                  Save Stream Settings
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-medium mb-4">Privacy Settings</h2>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Eye size={16} className="text-gray-500 mr-2" />
                                  <span className="text-sm">Show viewer count</span>
                                </div>
                                <Toggle checked={true} onChange={() => {}} />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Users size={16} className="text-gray-500 mr-2" />
                                  <span className="text-sm">Allow comments</span>
                                </div>
                                <Toggle checked={true} onChange={() => {}} />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <EyeOff size={16} className="text-gray-500 mr-2" />
                                  <span className="text-sm">Hide stream from search</span>
                                </div>
                                <Toggle checked={false} onChange={() => {}} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'analytics' && (
                        <div className="space-y-6">
                          <h2 className="text-lg font-medium mb-4">Channel Analytics</h2>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Subscribers</div>
                              <div className="text-2xl font-bold">{channelStats.subscribers}</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Total Views</div>
                              <div className="text-2xl font-bold">{channelStats.totalViews}</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Last Stream Viewers</div>
                              <div className="text-2xl font-bold">{channelStats.lastStreamViewers}</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Avg. Watch Time</div>
                              <div className="text-2xl font-bold">{channelStats.averageWatchTime}</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Top Location</div>
                              <div className="text-2xl font-bold">{channelStats.topLocation}</div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="text-md font-medium mb-3">Viewer Demographics</h3>
                            <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
                              <p className="text-gray-500">Demographic visualization would appear here</p>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="text-md font-medium mb-3">Engagement Metrics</h3>
                            <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
                              <p className="text-gray-500">Engagement metrics visualization would appear here</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'broadcasts' && (
                        <div className="space-y-6">
                          <h2 className="text-lg font-medium mb-4">Recent Broadcasts</h2>
                          
                          <div className="space-y-4">
                            {recentBroadcasts.map(broadcast => (
                              <div key={broadcast.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{broadcast.title}</h3>
                                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                                      <Calendar size={14} className="mr-1" />
                                      <span className="mr-3">{broadcast.date}</span>
                                      <Clock size={14} className="mr-1" />
                                      <span>{broadcast.duration}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Eye size={14} className="mr-1" />
                                      <span>{broadcast.views} views</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                        <path d="M7 10v12"></path>
                                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                                      </svg>
                                      <span>{broadcast.likes} likes</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                  >
                                    View Analytics
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                  >
                                    Download
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 text-center">
                            <Button
                              variant="outline"
                            >
                              View All Broadcasts
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default YouTubeIntegration;