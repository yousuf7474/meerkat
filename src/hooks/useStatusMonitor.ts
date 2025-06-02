import { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentsService, type ApiError } from '@/lib/api/client';

// Import the correct status types from the generated schema
export type DocumentStatus = {
  processing_status: 'processing' | 'completed' | 'failed';
  processing_step: string;
  progress_percentage: number;
  status_message: string;
  updated_at: string;
  status_metadata?: Record<string, any>;
};

export interface StatusMonitorState<T> {
  status: T | null;
  isMonitoring: boolean;
  error: string | null;
}

export function useDocumentStatusMonitor(documentId: string | null) {
  const [state, setState] = useState<StatusMonitorState<DocumentStatus>>({
    status: null,
    isMonitoring: false,
    error: null,
  });
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const isActiveRef = useRef(false);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    isActiveRef.current = false;
    setState(prev => ({ ...prev, isMonitoring: false }));
  }, []);

  const startMonitoring = useCallback(async () => {
    if (!documentId || isActiveRef.current) return;

    isActiveRef.current = true;
    setState(prev => ({ ...prev, isMonitoring: true, error: null }));

    const pollStatus = async () => {
      if (!isActiveRef.current || !documentId) return;

      try {
        // Use the new v2 API endpoint: /v1/documents/{document_id}/status
        const data = await DocumentsService.getStatus(documentId);
        
        setState(prev => ({ ...prev, status: data, error: null }));
        
        // Stop monitoring when completed or failed
        if (data.processing_status !== 'processing') {
          stopMonitoring();
        }
      } catch (error) {
        const apiError = error as ApiError;
        setState(prev => ({ 
          ...prev, 
          error: apiError.detail || 'Unknown error',
          isMonitoring: false 
        }));
        stopMonitoring();
      }
    };

    // Initial call
    await pollStatus();

    // Set up polling if still active - using 2 second interval as per v2 API docs
    if (isActiveRef.current) {
      intervalRef.current = setInterval(pollStatus, 2000); // Poll every 2 seconds
    }
  }, [documentId, stopMonitoring]);

  useEffect(() => {
    if (documentId) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [documentId, startMonitoring, stopMonitoring]);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
  };
} 