/**
 * Logging utility for consistent logging across the application
 */

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Log categories
export enum LogCategory {
  API = 'api',
  STREAM = 'stream',
  YOUTUBE = 'youtube',
  FFMPEG = 'ffmpeg',
  SOCKET = 'socket',
  UI = 'ui',
  AUTH = 'auth',
  GENERAL = 'general'
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
}

// Maximum number of log entries to keep in memory
const MAX_LOG_ENTRIES = 1000;

// In-memory log storage
let logEntries: LogEntry[] = [];

// Current log level (can be changed at runtime)
let currentLogLevel: LogLevel = LogLevel.INFO;

// Whether to log to console
let logToConsole = true;

/**
 * Set the current log level
 * @param level - Log level to set
 */
export const setLogLevel = (level: LogLevel): void => {
  currentLogLevel = level;
};

/**
 * Enable or disable console logging
 * @param enable - Whether to enable console logging
 */
export const enableConsoleLogging = (enable: boolean): void => {
  logToConsole = enable;
};

/**
 * Get the numeric value of a log level for comparison
 * @param level - Log level
 * @returns Numeric value
 */
const getLogLevelValue = (level: LogLevel): number => {
  switch (level) {
    case LogLevel.DEBUG:
      return 0;
    case LogLevel.INFO:
      return 1;
    case LogLevel.WARN:
      return 2;
    case LogLevel.ERROR:
      return 3;
    default:
      return 1;
  }
};

/**
 * Check if a log level should be logged based on the current log level
 * @param level - Log level to check
 * @returns Whether the log level should be logged
 */
const shouldLog = (level: LogLevel): boolean => {
  return getLogLevelValue(level) >= getLogLevelValue(currentLogLevel);
};

/**
 * Create a log entry
 * @param level - Log level
 * @param category - Log category
 * @param message - Log message
 * @param data - Additional data to log
 */
const createLogEntry = (
  level: LogLevel,
  category: LogCategory,
  message: string,
  data?: any
): LogEntry => {
  return {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    data: data ? structuredClone(data) : undefined
  };
};

/**
 * Add a log entry to the log storage
 * @param entry - Log entry
 */
const addLogEntry = (entry: LogEntry): void => {
  // Add to in-memory storage
  logEntries.push(entry);
  
  // Trim log entries if needed
  if (logEntries.length > MAX_LOG_ENTRIES) {
    logEntries = logEntries.slice(-MAX_LOG_ENTRIES);
  }
  
  // Log to console if enabled
  if (logToConsole) {
    const consoleMethod = entry.level === LogLevel.ERROR ? console.error :
                          entry.level === LogLevel.WARN ? console.warn :
                          entry.level === LogLevel.INFO ? console.info :
                          console.debug;
    
    consoleMethod(
      `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`,
      entry.data
    );
  }
};

/**
 * Log a debug message
 * @param category - Log category
 * @param message - Log message
 * @param data - Additional data to log
 */
export const debug = (
  category: LogCategory,
  message: string,
  data?: any
): void => {
  if (shouldLog(LogLevel.DEBUG)) {
    addLogEntry(createLogEntry(LogLevel.DEBUG, category, message, data));
  }
};

/**
 * Log an info message
 * @param category - Log category
 * @param message - Log message
 * @param data - Additional data to log
 */
export const info = (
  category: LogCategory,
  message: string,
  data?: any
): void => {
  if (shouldLog(LogLevel.INFO)) {
    addLogEntry(createLogEntry(LogLevel.INFO, category, message, data));
  }
};

/**
 * Log a warning message
 * @param category - Log category
 * @param message - Log message
 * @param data - Additional data to log
 */
export const warn = (
  category: LogCategory,
  message: string,
  data?: any
): void => {
  if (shouldLog(LogLevel.WARN)) {
    addLogEntry(createLogEntry(LogLevel.WARN, category, message, data));
  }
};

/**
 * Log an error message
 * @param category - Log category
 * @param message - Log message
 * @param data - Additional data to log
 */
export const error = (
  category: LogCategory,
  message: string,
  data?: any
): void => {
  if (shouldLog(LogLevel.ERROR)) {
    addLogEntry(createLogEntry(LogLevel.ERROR, category, message, data));
  }
};

/**
 * Get all log entries
 * @returns Array of log entries
 */
export const getLogEntries = (): LogEntry[] => {
  return [...logEntries];
};

/**
 * Clear all log entries
 */
export const clearLogEntries = (): void => {
  logEntries = [];
};

/**
 * Get log entries filtered by level and/or category
 * @param level - Log level to filter by
 * @param category - Log category to filter by
 * @returns Filtered log entries
 */
export const getFilteredLogEntries = (
  level?: LogLevel,
  category?: LogCategory
): LogEntry[] => {
  return logEntries.filter(entry => {
    if (level && entry.level !== level) {
      return false;
    }
    if (category && entry.category !== category) {
      return false;
    }
    return true;
  });
};

/**
 * Export a logger object for easier use
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
  enableConsoleLogging,
  getLogEntries,
  clearLogEntries,
  getFilteredLogEntries
};

export default logger;