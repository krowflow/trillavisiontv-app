import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { StreamStatus } from '../../types';
import { useYouTubeAnalytics } from '../../hooks/useYouTubeAnalytics';
import { Card } from '../ui/Card';
import { Users, Clock, BarChart2, TrendingUp, Activity, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface StreamAnalyticsProps {
  onClose?: () => void;
}

export const StreamAnalytics: React.FC<StreamAnalyticsProps> = ({ onClose }) => {
  const { status, analytics, broadcastId } = useSelector((state: RootState) => state.stream);
  const { isLoading, error, lastUpdate } = useYouTubeAnalytics(broadcastId);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  if (status !== StreamStatus.LIVE) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Eye size={48} className="mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium mb-2">Analytics are only available during live streams</p>
        <p className="text-sm">Start streaming to see viewer metrics and engagement data</p>
      </div>
    );
  }

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin">
          <BarChart2 size={32} className="text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="font-medium mb-2">Error loading analytics</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center text-gray-500 mb-1">
            <Users size={16} className="mr-1" />
            <span className="text-xs font-medium">Current Viewers</span>
          </div>
          <div className="text-2xl font-bold">{analytics?.viewerCount || 0}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center text-gray-500 mb-1">
            <TrendingUp size={16} className="mr-1" />
            <span className="text-xs font-medium">Peak Viewers</span>
          </div>
          <div className="text-2xl font-bold">{analytics?.peakViewers || 0}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center text-gray-500 mb-1">
            <Activity size={16} className="mr-1" />
            <span className="text-xs font-medium">Engagement Rate</span>
          </div>
          <div className="text-2xl font-bold">{(analytics?.engagementRate || 0).toFixed(1)}%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center text-gray-500 mb-1">
            <Clock size={16} className="mr-1" />
            <span className="text-xs font-medium">Avg. Watch Time</span>
          </div>
          <div className="text-2xl font-bold">{formatDuration(Math.round(analytics?.viewerRetention || 0))}</div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Viewer Trend</h3>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">Viewer trend visualization</p>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Device Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(analytics?.deviceBreakdown || {}).map(([device, percentage]) => (
            <div key={device}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize text-gray-600">{device}</span>
                <span className="font-medium">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Top Viewer Locations</h3>
        <div className="space-y-2">
          {(analytics?.geographicData || []).map((data) => (
            <div key={data.country} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{data.country}</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {data.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-xs text-gray-500 text-right">
        Last updated: {lastUpdate ? format(lastUpdate, 'HH:mm:ss') : 'Never'}
      </div>
    </div>
  );
};

export default StreamAnalytics;