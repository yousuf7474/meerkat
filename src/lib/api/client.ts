/**
 * Walrus API v2.0.0 Client
 * Type-safe client using generated OpenAPI types
 */

import type { components } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.dev.scai.scalecapacity.com';

// Error types from the v2 API envelope
export interface ApiError {
  detail: string;
  status_code: number;
  error_type: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
}

// Helper to make typed API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        detail: `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
        error_type: 'http_error',
      };
    }
    throw errorData;
  }

  return response.json();
}

// Document Management
export const DocumentsService = {
  async list(params?: { document_type?: 'file_upload' | 'web_crawl' }) {
    const searchParams = new URLSearchParams();
    if (params?.document_type) {
      searchParams.set('document_type', params.document_type);
    }
    const endpoint = `/v1/documents/${searchParams.toString() ? `?${searchParams}` : ''}`;
    return apiRequest<components['schemas']['DocumentMetadata'][]>(endpoint);
  },

  async upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest<{
      document_id: string;
      filename: string;
      chunks_created: number;
      total_tokens: number;
      status: string;
    }>('/v1/documents/', {
      method: 'POST',
      headers: {
        'Content-Length': file.size.toString(),
      },
      body: formData,
    });
  },

  async get(documentId: string) {
    return apiRequest<components['schemas']['DocumentMetadata']>(`/v1/documents/${documentId}`);
  },

  async delete(documentId: string) {
    return apiRequest<void>(`/v1/documents/${documentId}`, {
      method: 'DELETE',
    });
  },

  async getStatus(documentId: string) {
    return apiRequest<{
      processing_status: 'processing' | 'completed' | 'failed';
      processing_step: string;
      progress_percentage: number;
      status_message: string;
      updated_at: string;
      status_metadata?: Record<string, any>;
    }>(`/v1/documents/${documentId}/status`);
  },

  async crawlWebsite(request: components['schemas']['WebCrawlRequest']) {
    return apiRequest<components['schemas']['WebCrawlResponse']>('/v1/documents/crawl', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async deleteCrawledWebsite(documentId: string) {
    return apiRequest<void>(`/v1/documents/website/${documentId}`, {
      method: 'DELETE',
    });
  },
};

// Chat
export const ChatService = {
  async chat(request: components['schemas']['ChatRequest']) {
    return apiRequest<components['schemas']['ChatResponse']>('/v1/chat/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getUserConversations(userId: string, limit?: number) {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.set('limit', limit.toString());
    const endpoint = `/v1/chat/conversations/${userId}${searchParams.toString() ? `?${searchParams}` : ''}`;
    
    return apiRequest<{
      user_id: string;
      conversations: Record<string, any>[];
      total: number;
    }>(endpoint);
  },

  async getConversationHistory(userId: string, conversationId: string, limit?: number) {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.set('limit', limit.toString());
    const endpoint = `/v1/chat/conversations/${userId}/${conversationId}/history${searchParams.toString() ? `?${searchParams}` : ''}`;
    
    return apiRequest<{
      conversation_id: string;
      user_id: string;
      messages: Record<string, any>[];
    }>(endpoint);
  },
};

// WalrusAgent Management
export const WalrusAgentService = {
  async list() {
    return apiRequest<components['schemas']['WalrusAgentResponse'][]>('/v1/agents/walrus');
  },

  async create(request: components['schemas']['CreateWalrusAgentRequest']) {
    return apiRequest<components['schemas']['WalrusAgentResponse']>('/v1/agents/walrus', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async get(agentId: string) {
    return apiRequest<components['schemas']['WalrusAgentResponse']>(`/v1/agents/walrus/${agentId}`);
  },

  async update(agentId: string, request: components['schemas']['UpdateWalrusAgentRequest']) {
    return apiRequest<components['schemas']['WalrusAgentResponse']>(`/v1/agents/walrus/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  async delete(agentId: string) {
    return apiRequest<void>(`/v1/agents/walrus/${agentId}`, {
      method: 'DELETE',
    });
  },

  async search(request: components['schemas']['SearchAgentCardsRequest']) {
    return apiRequest<components['schemas']['SearchAgentCardsResponse']>('/v1/agents/walrus/search', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

// Legacy Agent Cards
export const AgentCardsService = {
  async list(params?: {
    status_filter?: 'active' | 'inactive' | 'draft';
    limit?: number;
    last_evaluated_key?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status_filter) searchParams.set('status_filter', params.status_filter);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.last_evaluated_key) searchParams.set('last_evaluated_key', params.last_evaluated_key);
    
    const endpoint = `/v1/agents/cards${searchParams.toString() ? `?${searchParams}` : ''}`;
    return apiRequest<components['schemas']['AgentCardListResponse']>(endpoint);
  },

  async create(request: components['schemas']['CreateAgentCardRequest']) {
    return apiRequest<components['schemas']['AgentCardResponse']>('/v1/agents/cards', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

// Tools and Sources
export const ToolsService = {
  async listTools() {
    return apiRequest<Array<{
      name: string;
      description: string;
      category: string;
      examples: string[];
    }>>('/v1/agents/tools');
  },

  async listSources() {
    return apiRequest<Array<{
      name: string;
      source_type: string;
      description: string;
      capabilities: string[];
    }>>('/v1/agents/sources');
  },
};

// Mega Chat
export const MegaChatService = {
  async execute(request: components['schemas']['MegaChatRequest']) {
    return apiRequest<components['schemas']['MegaChatResponse']>('/v1/mega_chat/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getSessionStatus(sessionId: string) {
    return apiRequest<{
      session_id: string;
      status: 'active' | 'completed' | 'failed';
      created_at: string;
      completed_at?: string;
      agents_used: number;
      total_time_ms: number;
      success: boolean;
    }>(`/v1/mega_chat/sessions/${sessionId}/status`);
  },

  async healthCheck() {
    return apiRequest<{
      status: 'healthy' | 'degraded' | 'unhealthy';
      services: Record<string, any>;
      active_sessions: number;
      total_executions: number;
    }>('/v1/mega_chat/health');
  },
};

// SQLite Management
export const SqliteService = {
  async getTables() {
    return apiRequest<components['schemas']['TableInfo'][]>('/v1/sqlite/tables');
  },

  async getTableInfo(tableName: string) {
    return apiRequest<components['schemas']['TableInfo']>(`/v1/sqlite/tables/${tableName}`);
  },

  async executeQuery(request: components['schemas']['QueryRequest']) {
    return apiRequest<components['schemas']['QueryResponse']>('/v1/sqlite/query', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

// Models
export const ModelsService = {
  async list() {
    return apiRequest<components['schemas']['ModelInfo'][]>('/v1/models/');
  },

  async get(modelId: string) {
    return apiRequest<components['schemas']['ModelInfo']>(`/v1/models/${modelId}`);
  },
};

// System
export const SystemService = {
  async getApiInfo() {
    return apiRequest<{
      name: string;
      version: string;
      status: string;
      endpoints: Record<string, any>;
      features: string[];
    }>('/');
  },

  async healthCheck() {
    return apiRequest<{
      status: string;
      version: string;
    }>('/health');
  },
}; 