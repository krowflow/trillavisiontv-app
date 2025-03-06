import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface EngagementMetric {
  name: string;
  value: number;
  color: string;
}

interface EngagementChartProps {
  data: EngagementMetric[];
  className?: string;
}

export const EngagementChart: React.FC<EngagementChartProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`]}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            fill="#580F96"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};