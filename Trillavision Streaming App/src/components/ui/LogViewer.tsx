import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { logger, LogLevel, LogCategory, LogEntry } from '../../utils/logging';
import { RefreshCw, Trash2 } from 'lucide-react';

interface LogViewerProps {
  maxHeight?: string;
  defaultLevel?: LogLevel;
  defaultCategory?: LogCategory;
  title?: string;
  autoRefresh?: boolean;
}

/**
 * Log viewer component for displaying application logs
 */
export const LogViewer: React.FC<LogViewerProps> = ({
  maxHeight = '400px',
  defaultLevel,
  defaultCategory,
  title = 'Application Logs',
  autoRefresh = false
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<LogLevel | null>(defaultLevel || null);
  const [filterCategory, setFilterCategory] = useState<LogCategory | null>(defaultCategory || null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(autoRefresh);
  
  // Load logs on mount and when filters change
  useEffect(() => {
    const loadLogs = () => {
      let filteredLogs: LogEntry[];
      
      if (filterLevel && filterCategory) {
        filteredLogs = logger.getFilteredLogEntries(filterLevel, filterCategory);
      } else if (filterLevel) {
        filteredLogs = logger.getFilteredLogEntries(filterLevel);
      } else if (filterCategory) {
        filteredLogs = logger.getFilteredLogEntries(undefined, filterCategory);
      } else {
        filteredLogs = logger.getLogEntries();
      }
      
      setLogs(filteredLogs);
    };
    
    loadLogs();
    
    // Set up auto-refresh interval
    let interval: NodeJS.Timeout | null = null;
    if (isAutoRefreshing) {
      interval = setInterval(loadLogs, 2000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [filterLevel, filterCategory, isAutoRefreshing]);
  
  // Handle level filter change
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterLevel(value ? value as LogLevel : null);
  };
  
  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterCategory(value ? value as LogCategory : null);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    let filteredLogs: LogEntry[];
    
    if (filterLevel && filterCategory) {
      filteredLogs = logger.getFilteredLogEntries(filterLevel, filterCategory);
    } else if (filterLevel) {
      filteredLogs = logger.getFilteredLogEntries(filterLevel);
    } else if (filterCategory) {
      filteredLogs = logger.getFilteredLogEntries(undefined, filterCategory);
    } else {
      filteredLogs = logger.getLogEntries();
    }
    
    setLogs(filteredLogs);
  };
  
  // Handle clear button click
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      logger.clearLogEntries();
      setLogs([]);
    }
  };
  
  // Get CSS class for log entry based on level
  const getLogEntryClass = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'bg-red-500 text-white';
      case LogLevel.WARN:
        return 'bg-yellow-500 text-white';
      case LogLevel.INFO:
        return 'bg-blue-500 text-white';
      case LogLevel.DEBUG:
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={handleRefresh}
              title="Refresh logs"
            >
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 size={16} />}
              onClick={handleClear}
              title="Clear logs"
              disabled={logs.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="w-40">
            <select
              value={filterLevel || ''}
              onChange={handleLevelChange}
              className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
            >
              <option value="">All Levels</option>
              {Object.values(LogLevel).map(level => (
                <option key={level} value={level}>{level.toUpperCase()}</option>
              ))}
            </select>
          </div>
          
          <div className="w-40">
            <select
              value={filterCategory || ''}
              onChange={handleCategoryChange}
              className="block w-full rounded-md shadow-sm border-gray-300 focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"
            >
              <option value="">All Categories</option>
              {Object.values(LogCategory).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAutoRefreshing}
                onChange={() => setIsAutoRefreshing(!isAutoRefreshing)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm">Auto-refresh</span>
            </label>
          </div>
        </div>
      </div>
      
      <div 
        className="overflow-auto font-mono text-xs"
        style={{ maxHeight }}
      >
        {logs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No logs to display
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLogEntryClass(log.level)} bg-opacity-10`}>
                      {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {log.category}
                  </td>
                  <td className="px-3 py-2 text-gray-900">
                    <div className="truncate max-w-md" title={log.message}>
                      {log.message}
                    </div>
                    {log.data && (
                      <details className="mt-1">
                        <summary className="text-xs text-gray-500 cursor-pointer">Data</summary>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};

export default LogViewer;