// WebSocket types for Walrus Streaming API
// Based on AsyncAPI 3.0 specification

export interface ChatMessage {
  query: string;
  retrieval_k?: number;
  retrieval_filter?: Record<string, any>;
}

export interface ChatResponseChunk {
  type: 'chunk';
  content: string;
}

export interface ChatResponseStatus {
  type: 'status';
  status: 'processing' | 'completed' | 'failed';
  step: 'initializing' | 'retrieving_context' | 'selecting_model' | 'generating_response' | 'storing_response' | 'finished';
  message: string;
}

export interface ChatResponseComplete {
  type: 'complete';
  metadata: {
    session_id: string;
    status: 'completed';
    latency_ms?: number;
  };
}

export interface ChatResponseError {
  type: 'error';
  error: string;
}

export type ChatResponse = ChatResponseChunk | ChatResponseStatus | ChatResponseComplete | ChatResponseError;

export interface WebSocketState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage?: ChatResponse;
  currentStatus?: ChatResponseStatus;
  error?: string;
}

export interface UseWalrusWSReturn {
  state: WebSocketState;
  sendMessage: (message: ChatMessage) => void;
  disconnect: () => void;
  connect: () => void;
} 