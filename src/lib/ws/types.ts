/**
 * WebSocket types for Walrus API v2.0.0
 * Generated from AsyncAPI specification
 */

// Base message types
export interface BaseMessage {
  type: 'status' | 'chunk' | 'complete' | 'error';
  payload: any;
}

// Chat WebSocket Messages
export interface ChatMessage {
  query: string;
  retrieval_k?: number;
  retrieval_filter?: {
    document_type?: 'file_upload' | 'web_crawl';
    source?: string;
    [key: string]: any;
  };
}

export interface ChatStatusMessage extends BaseMessage {
  type: 'status';
  payload: {
    status: 'processing' | 'retrieving' | 'generating' | 'complete';
    message: string;
    progress?: number;
  };
}

export interface ChatChunkMessage extends BaseMessage {
  type: 'chunk';
  payload: {
    content: string;
    delta: string;
  };
}

export interface ChatCompleteMessage extends BaseMessage {
  type: 'complete';
  payload: {
    session_id: string;
    total_tokens?: number;
    latency_ms?: number;
    chunks_retrieved?: number;
    model_used?: string;
  };
}

export interface ChatErrorMessage extends BaseMessage {
  type: 'error';
  payload: {
    error: string;
    error_type: string;
    details?: any;
  };
}

// Mega Chat WebSocket Messages
export interface MegaChatMessage {
  query: string;
  agent_ids?: string[];
  max_agents?: number;
  strategy?: 'auto' | 'single_best' | 'parallel';
  synthesis_strategy?: 'auto' | 'merge' | 'best' | 'consensus';
}

export interface MegaChatStatusMessage extends BaseMessage {
  type: 'status';
  payload: {
    session_id: string;
    status: 'planning' | 'selecting_agents' | 'executing' | 'synthesizing' | 'complete';
    message: string;
    agents_selected?: string[];
    current_agent?: string;
    progress?: number;
  };
}

export interface MegaChatChunkMessage extends BaseMessage {
  type: 'chunk';
  payload: {
    content: string;
    delta: string;
    agent_id?: string;
    step?: string;
  };
}

export interface MegaChatCompleteMessage extends BaseMessage {
  type: 'complete';
  payload: {
    session_id: string;
    final_answer: string;
    agents_used: Array<{
      id: string;
      name: string;
      execution_time_ms: number;
      tools_used: string[];
    }>;
    tools_used: string[];
    sources_used: string[];
    total_time_ms: number;
    execution_summary: {
      strategy_used: string;
      synthesis_method: string;
      success: boolean;
    };
  };
}

export interface MegaChatErrorMessage extends BaseMessage {
  type: 'error';
  payload: {
    error: string;
    error_type: string;
    session_id?: string;
    failed_agent?: string;
    details?: any;
  };
}

// Union types for message handling
export type ChatWebSocketMessage = 
  | ChatStatusMessage 
  | ChatChunkMessage 
  | ChatCompleteMessage 
  | ChatErrorMessage;

export type MegaChatWebSocketMessage = 
  | MegaChatStatusMessage 
  | MegaChatChunkMessage 
  | MegaChatCompleteMessage 
  | MegaChatErrorMessage;

export type WebSocketMessage = ChatWebSocketMessage | MegaChatWebSocketMessage;

// Connection status
export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  error?: string;
  lastConnected?: Date;
}

// WebSocket endpoints
export const WS_ENDPOINTS = {
  CHAT: (sessionId: string) => `/ws/chat/${sessionId}`,
  MEGA_CHAT: (sessionId: string) => `/ws/mega_chat/${sessionId}`,
} as const; 