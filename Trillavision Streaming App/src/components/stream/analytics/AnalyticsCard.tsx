import React from 'react';
import { Card } from '../../ui/Card';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className
}) => {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center text-gray-500 mb-1">
        <Icon size={16} className="mr-1" />
        <span className="text-xs font-medium">{title}</span>
      </div>
      
      <div className="flex items-end">
        <div className="text-2xl font-bold">{value}</div>
        
        {trend && (
          <div 
            className={`ml-2 text-sm flex items-center ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'}
            {trend.value}%
          </div>
        )}
      </div>
    </Card>
  );
};