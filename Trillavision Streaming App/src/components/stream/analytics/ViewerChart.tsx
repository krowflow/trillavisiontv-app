import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ViewerChartProps {
  data: Array<{
    timestamp: string;
    count: number;
  }>;
  className?: string;
}

export const ViewerChart: React.FC<ViewerChartProps> = ({ data, className }) => {
  const formattedData = data.map(point => ({
    time: format(new Date(point.timestamp), 'HH:mm'),
    viewers: point.count
  }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="viewerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#580F96" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#580F96" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            fontSize={12}
            tickMargin={10}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            tickMargin={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="viewers"
            stroke="#580F96"
            fillOpacity={1}
            fill="url(#viewerGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};