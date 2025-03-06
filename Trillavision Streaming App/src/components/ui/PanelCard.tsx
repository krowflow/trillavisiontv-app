import React from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { X } from 'lucide-react';

interface PanelCardProps {
  title: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  isResizable?: boolean;
  isCollapsible?: boolean;
  isMaximizable?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * PanelCard component for consistent panel styling and behavior
 * Used for all panels in the dashboard
 */
export const PanelCard: React.FC<PanelCardProps> = ({
  title,
  icon,
  onClose,
  children,
  className = '',
  isResizable = false,
  isCollapsible = false,
  isMaximizable = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMaximized, setIsMaximized] = React.useState(false);
  
  // Handle collapse toggle
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Handle maximize toggle
  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
  };
  
  // Determine card classes based on state
  const cardClasses = `
    ${className}
    ${isMaximized ? 'fixed inset-4 z-50' : 'h-full'}
    transition-all duration-200
  `;
  
  return (
    <Card className={cardClasses}>
      <CardHeader 
        title={title}
        icon={icon}
        className="flex-shrink-0"
      >
        <div className="flex items-center space-x-1">
          {isCollapsible && (
            <button
              onClick={handleCollapseToggle}
              className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </button>
          )}
          
          {isMaximizable && (
            <button
              onClick={handleMaximizeToggle}
              className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label={isMaximized ? 'Restore' : 'Maximize'}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                </svg>
              )}
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close"
              title="Close"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent scrollable className="flex-1 overflow-auto">
          {children}
        </CardContent>
      )}
      
      {isResizable && !isCollapsed && !isMaximized && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" 
             title="Resize"
             onMouseDown={(e) => {
               // Resize logic would go here
               // This is a placeholder for future implementation
               e.preventDefault();
             }}
        />
      )}
    </Card>
  );
};

export default PanelCard;