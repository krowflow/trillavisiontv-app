import React, { useState } from 'react';
import classNames from 'classnames';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'dark';
  className?: string;
  contentClassName?: string;
  scrollable?: boolean;
}

/**
 * Tabs component with improved overflow handling
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  className,
  contentClassName,
  scrollable = true
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const getTabHeaderClasses = (tabId: string) => {
    const isActive = tabId === activeTabId;
    
    if (variant === 'dark') {
      return classNames(
        'px-4 py-2 text-sm font-medium transition-colors flex items-center',
        isActive
          ? 'text-primary border-b-2 border-primary'
          : 'text-gray-400 border-b-2 border-transparent hover:text-white hover:border-gray-700'
      );
    }

    return classNames(
      'px-4 py-2 text-sm font-medium transition-colors flex items-center',
      isActive
        ? 'text-primary border-b-2 border-primary'
        : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'
    );
  };

  return (
    <div className={classNames('flex flex-col h-full', className)}>
      <div className={`flex border-b flex-shrink-0 ${variant === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={getTabHeaderClasses(tab.id)}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className={classNames(
        'flex-1 min-h-0',
        scrollable ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden',
        contentClassName
      )}>
        {tabs.find((tab) => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};

export default Tabs;