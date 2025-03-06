/**
 * Error handling utilities for consistent error management across the application
 */

import { setStreamError } from '../store/slices/streamSlice';
import { AppDispatch } from '../store';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  code: string;
  details?: Record<string, any>;

  constructor(message: string, code: string, details?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Error codes for different types of errors
 */
export enum ErrorCode {
  // API errors
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Stream errors
  STREAM_START_ERROR = 'STREAM_START_ERROR',
  STREAM_STOP_ERROR = 'STREAM_STOP_ERROR',
  DEVICE_ERROR = 'DEVICE_ERROR',
  
  // YouTube errors
  YOUTUBE_AUTH_ERROR = 'YOUTUBE_AUTH_ERROR',
  YOUTUBE_API_ERROR = 'YOUTUBE_API_ERROR',
  
  // FFmpeg errors
  FFMPEG_ERROR = 'FFMPEG_ERROR',
  
  // Socket errors
  SOCKET_ERROR = 'SOCKET_ERROR',
  
  // Unknown error
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Handle API errors consistently
 * @param error - The error object
 * @param dispatch - Redux dispatch function
 * @param customMessage - Optional custom error message
 */
export const handleApiError = (
  error: any,
  dispatch: AppDispatch,
  customMessage?: string
): void => {
  console.error('API Error:', error);
  
  let errorMessage = customMessage || 'An error occurred while processing your request';
  let errorCode = ErrorCode.API_ERROR;
  
  if (error.response) {
    // The request was made and the server responded with an error status
    errorMessage = error.response.data?.message || `Error: ${error.response.status} ${error.response.statusText}`;
    
    if (error.response.status === 401) {
      errorCode = ErrorCode.UNAUTHORIZED;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response received from server. Please check your connection.';
    errorCode = ErrorCode.NETWORK_ERROR;
  } else if (error.message && error.message.includes('timeout')) {
    // Request timed out
    errorMessage = 'Request timed out. Please try again.';
    errorCode = ErrorCode.TIMEOUT_ERROR;
  }
  
  // Dispatch error to Redux store
  dispatch(setStreamError(errorMessage));
  
  // Return AppError for additional handling if needed
  return new AppError(errorMessage, errorCode, {
    originalError: error,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle YouTube API errors
 * @param error - The error object
 * @param dispatch - Redux dispatch function
 */
export const handleYouTubeError = (
  error: any,
  dispatch: AppDispatch
): void => {
  console.error('YouTube API Error:', error);
  
  let errorMessage = 'An error occurred with the YouTube API';
  let errorCode = ErrorCode.YOUTUBE_API_ERROR;
  
  if (error.response?.data?.error?.message) {
    errorMessage = `YouTube API Error: ${error.response.data.error.message}`;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  if (errorMessage.includes('authentication') || errorMessage.includes('auth') || errorMessage.includes('token')) {
    errorCode = ErrorCode.YOUTUBE_AUTH_ERROR;
    errorMessage = 'YouTube authentication error. Please reconnect your YouTube account.';
  }
  
  dispatch(setStreamError(errorMessage));
  
  return new AppError(errorMessage, errorCode, {
    originalError: error,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle FFmpeg errors
 * @param error - The error object
 * @param dispatch - Redux dispatch function
 */
export const handleFFmpegError = (
  error: any,
  dispatch: AppDispatch
): void => {
  console.error('FFmpeg Error:', error);
  
  let errorMessage = 'An error occurred with video processing';
  
  if (error.message) {
    errorMessage = `Video processing error: ${error.message}`;
  }
  
  dispatch(setStreamError(errorMessage));
  
  return new AppError(errorMessage, ErrorCode.FFMPEG_ERROR, {
    originalError: error,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle socket connection errors
 * @param error - The error object
 * @param dispatch - Redux dispatch function
 */
export const handleSocketError = (
  error: any,
  dispatch: AppDispatch
): void => {
  console.error('Socket Error:', error);
  
  let errorMessage = 'Connection error. Please check your network.';
  
  if (error.message) {
    errorMessage = `Connection error: ${error.message}`;
  }
  
  dispatch(setStreamError(errorMessage));
  
  return new AppError(errorMessage, ErrorCode.SOCKET_ERROR, {
    originalError: error,
    timestamp: new Date().toISOString()
  });
};

/**
 * Create a user-friendly error message
 * @param error - The error object
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error.message) {
    // Clean up common error messages
    let message = error.message;
    
    // Remove technical details that aren't helpful to users
    message = message.replace(/Error: /, '');
    message = message.replace(/\[.*?\]/, '');
    
    // Simplify common error messages
    if (message.includes('network') || message.includes('connection')) {
      return 'Network connection issue. Please check your internet connection.';
    }
    
    if (message.includes('timeout')) {
      return 'The operation timed out. Please try again.';
    }
    
    if (message.includes('permission') || message.includes('access')) {
      return 'Permission denied. Please check your account permissions.';
    }
    
    return message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Error boundary component props
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error boundary component state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}