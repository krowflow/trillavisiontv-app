import React from 'react';
import { Card } from '../../ui/Card';
import { Users, Clock, Activity, MessageSquare } from 'lucide-react';

interface Metric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface MetricsGridProps {
  metrics: Metric[];
  className?: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, className }) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center text-gray-500 mb-1">
            {metric.icon}
            <span className="text-xs font-medium ml-1">{metric.title}</span>
          </div>
          <div className="flex items-end">
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.trend && (
              <div 
                className={`ml-2 text-sm flex items-center ${
                  metric.trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {metric.trend.isPositive ? '↑' : '↓'}
                {metric.trend.value}%
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};