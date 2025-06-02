import { useCallback, useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import type { 
  ChatWebSocketMessage, 
  MegaChatWebSocketMessage,
  ChatMessage,
  MegaChatMessage
} from '../lib/ws/types';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

export interface WebSocketState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastMessage?: ChatWebSocketMessage | MegaChatWebSocketMessage;
  currentStatus?: any;
  error?: string;
}

export interface UseWalrusWSReturn {
  state: WebSocketState;
  sendMessage: (message: ChatMessage | MegaChatMessage) => void;
  disconnect: () => void;
  connect: () => void;
}

export function useWalrusWS(sessionId: string, endpoint: 'chat' | 'mega_chat' = 'chat'): UseWalrusWSReturn {
  const [state, setState] = useState<WebSocketState>({
    status: 'disconnected',
  });
  
  const ws = useRef<ReconnectingWebSocket | null>(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, status: 'connecting' }));
    
    try {
      // Use the new v2 WebSocket endpoints
      const wsUrl = endpoint === 'chat' 
        ? `${WS_BASE_URL}/ws/chat/${sessionId}`
        : `${WS_BASE_URL}/ws/mega_chat/${sessionId}`;
      
      ws.current = new ReconnectingWebSocket(wsUrl, [], {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 4000,
        maxRetries: 10,
        debug: false,
      });

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({ ...prev, status: 'connected', error: undefined }));
      };

      ws.current.onmessage = (event) => {
        try {
          const message: ChatWebSocketMessage | MegaChatWebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          
          setState(prev => ({ 
            ...prev, 
            lastMessage: message,
            currentStatus: message.type === 'status' ? message.payload : prev.currentStatus
          }));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setState(prev => ({ ...prev, status: 'disconnected' }));
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          status: 'error', 
          error: 'Connection failed' 
        }));
      };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: 'Failed to create WebSocket connection' 
      }));
    }
  }, [sessionId, endpoint]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close(1000, 'User disconnected');
      ws.current = null;
    }
    setState(prev => ({ ...prev, status: 'disconnected', currentStatus: undefined }));
  }, []);

  const sendMessage = useCallback((message: ChatMessage | MegaChatMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // Clear previous status when sending new message
      setState(prev => ({ ...prev, currentStatus: undefined }));
      ws.current.send(JSON.stringify(message));
      console.log('WebSocket message sent:', message);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    // Auto-connect when sessionId changes
    if (sessionId) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [sessionId, connect, disconnect]);

  return {
    state,
    sendMessage,
    disconnect,
    connect,
  };
}

export default useWalrusWS; 