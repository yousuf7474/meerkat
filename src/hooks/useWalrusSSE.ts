import { useCallback, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { 
  ChatWebSocketMessage, 
  ChatStatusMessage 
} from '../lib/ws/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ChatMessage {
  query: string;
  retrieval_k?: number;
  retrieval_filter?: {
    document_type?: 'file_upload' | 'web_crawl';
    source?: string;
    [key: string]: any;
  };
}

export interface SSEState {
  status: 'idle' | 'connecting' | 'streaming' | 'completed' | 'error';
  currentStatus?: ChatStatusMessage['payload'];
  error?: string;
  isStreaming: boolean;
}

export interface UseWalrusSSEReturn {
  state: SSEState;
  sendMessage: (message: ChatMessage) => Promise<void>;
  onChunk: (callback: (chunk: string) => void) => void;
  onComplete: (callback: (metadata: any) => void) => void;
  onStatus: (callback: (status: ChatStatusMessage['payload']) => void) => void;
  onError: (callback: (error: string) => void) => void;
  abort: () => void;
}

export function useWalrusSSE(sessionId: string): UseWalrusSSEReturn {
  const [state, setState] = useState<SSEState>({
    status: 'idle',
    isStreaming: false,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Callback refs
  const onChunkRef = useRef<((chunk: string) => void) | null>(null);
  const onCompleteRef = useRef<((metadata: any) => void) | null>(null);
  const onStatusRef = useRef<((status: ChatStatusMessage['payload']) => void) | null>(null);
  const onErrorRef = useRef<((error: string) => void) | null>(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState(prev => ({ ...prev, status: 'idle', isStreaming: false, currentStatus: undefined }));
  }, []);

  const sendMessage = useCallback(async (message: ChatMessage) => {
    // Abort any existing stream
    abort();
    
    setState(prev => ({ ...prev, status: 'connecting', isStreaming: true, error: undefined }));
    
    try {
      abortControllerRef.current = new AbortController();
      
      console.log('Sending message:', message);
      
      // Use the new v2 streaming endpoint: POST /v1/chat/ with stream=true
      await fetchEventSource(`${API_BASE_URL}/v1/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          query: message.query,
          session_id: sessionId,
          retrieval_k: message.retrieval_k || 8,
          retrieval_filter: message.retrieval_filter || {},
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
        
        onopen(response) {
          console.log('SSE connection opened, status:', response.status);
          if (response.ok) {
            setState(prev => ({ ...prev, status: 'streaming' }));
            return Promise.resolve();
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        },
        
        onmessage(event) {
          console.log('SSE message received:', event.data);
          
          try {
            const data: ChatWebSocketMessage = JSON.parse(event.data);
            console.log('Parsed message:', data);
            
            switch (data.type) {
              case 'status':
                console.log('Status update:', data.payload);
                setState(prev => ({ ...prev, currentStatus: data.payload }));
                onStatusRef.current?.(data.payload);
                break;
                
              case 'chunk':
                console.log('Content chunk:', data.payload.content);
                onChunkRef.current?.(data.payload.content);
                break;
                
              case 'complete':
                console.log('Stream completed:', data.payload);
                setState(prev => ({ 
                  ...prev, 
                  status: 'completed', 
                  isStreaming: false,
                  currentStatus: undefined 
                }));
                onCompleteRef.current?.(data.payload);
                break;
                
              case 'error':
                const errorMsg = data.payload.error || 'Unknown error';
                console.error('Stream error:', errorMsg);
                setState(prev => ({ 
                  ...prev, 
                  status: 'error', 
                  isStreaming: false,
                  error: errorMsg,
                  currentStatus: undefined 
                }));
                onErrorRef.current?.(errorMsg);
                break;
                
              default:
                console.log('Unknown message type:', (data as any).type);
            }
          } catch (parseError) {
            console.error('Failed to parse SSE data:', parseError, 'Event data:', event.data);
          }
        },
        
        onerror(error) {
          console.error('SSE error:', error);
          const errorMsg = error instanceof Error ? error.message : 'Connection failed';
          setState(prev => ({ 
            ...prev, 
            status: 'error', 
            isStreaming: false,
            error: errorMsg,
            currentStatus: undefined 
          }));
          onErrorRef.current?.(errorMsg);
        },
        
        onclose() {
          console.log('SSE connection closed');
          setState(prev => ({ 
            ...prev, 
            status: prev.status === 'streaming' ? 'completed' : prev.status, 
            isStreaming: false 
          }));
        },
      });
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      
      const errorMsg = error.message || 'Connection failed';
      console.error('SSE error:', error);
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        isStreaming: false,
        error: errorMsg,
        currentStatus: undefined 
      }));
      onErrorRef.current?.(errorMsg);
    }
  }, [sessionId, abort]);

  // Callback setters
  const onChunk = useCallback((callback: (chunk: string) => void) => {
    onChunkRef.current = callback;
  }, []);

  const onComplete = useCallback((callback: (metadata: any) => void) => {
    onCompleteRef.current = callback;
  }, []);

  const onStatus = useCallback((callback: (status: ChatStatusMessage['payload']) => void) => {
    onStatusRef.current = callback;
  }, []);

  const onError = useCallback((callback: (error: string) => void) => {
    onErrorRef.current = callback;
  }, []);

  return {
    state,
    sendMessage,
    onChunk,
    onComplete,
    onStatus,
    onError,
    abort,
  };
}

export default useWalrusSSE; 