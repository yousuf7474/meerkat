import { useState, useCallback } from 'react';
import { 
  DocumentsService, 
  ChatService, 
  WalrusAgentService,
  MegaChatService,
  SqliteService,
  ModelsService,
  SystemService,
  type ApiError,
  type ApiResponse 
} from '@/lib/api/client';
import type { components } from '@/lib/api/types';

// Re-export types from the generated schema
export type Document = components['schemas']['DocumentMetadata'];
export type DocumentUploadResponse = {
  document_id: string;
  filename: string;
  chunks_created: number;
  total_tokens: number;
  status: string;
};
export type WebCrawlRequest = components['schemas']['WebCrawlRequest'];
export type WebCrawlResponse = components['schemas']['WebCrawlResponse'];
export type ChatRequest = components['schemas']['ChatRequest'];
export type ChatResponse = components['schemas']['ChatResponse'];
export type WalrusAgentResponse = components['schemas']['WalrusAgentResponse'];
export type CreateWalrusAgentRequest = components['schemas']['CreateWalrusAgentRequest'];
export type UpdateWalrusAgentRequest = components['schemas']['UpdateWalrusAgentRequest'];
export type MegaChatRequest = components['schemas']['MegaChatRequest'];
export type MegaChatResponse = components['schemas']['MegaChatResponse'];
export type TableInfo = components['schemas']['TableInfo'];
export type QueryRequest = components['schemas']['QueryRequest'];
export type QueryResponse = components['schemas']['QueryResponse'];
export type ModelInfo = components['schemas']['ModelInfo'];

export interface DocumentStatus {
  processing_status: 'processing' | 'completed' | 'failed';
  processing_step: string;
  progress_percentage: number;
  status_message: string;
  updated_at: string;
  status_metadata?: {
    chunks_created?: number;
    total_tokens?: number;
  };
}

export interface Conversation {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  status: string;
}

export interface ConversationHistory {
  conversation_id: string;
  user_id: string;
  messages: Message[];
  total: number;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  created_at: string;
  model_id?: string;
  latency_ms?: number;
}

export interface ChatStatusHistory {
  conversation_id: string;
  turn_id: string;
  status: 'processing' | 'completed' | 'failed';
  step: string;
  message: string;
  created_at: string;
  metadata?: {
    latency_ms?: number;
    response_length?: number;
  };
}

export interface HealthResponse {
  status: string;
  version: string;
}

export interface ApiInfo {
  name: string;
  version: string;
  status: string;
  endpoints: Record<string, string>;
  features: string[];
  documentation?: Record<string, string>;
}

export function useWalrusApi() {
  const [loading, setLoading] = useState(false);

  // Document Management APIs
  const uploadDocument = useCallback(async (file: File): Promise<ApiResponse<DocumentUploadResponse>> => {
    setLoading(true);
    try {
      const data = await DocumentsService.upload(file);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocuments = useCallback(async (documentType?: 'file_upload' | 'web_crawl'): Promise<ApiResponse<Document[]>> => {
    setLoading(true);
    try {
      const data = await DocumentsService.list(documentType ? { document_type: documentType } : undefined);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocument = useCallback(async (documentId: string): Promise<ApiResponse<Document>> => {
    setLoading(true);
    try {
      const data = await DocumentsService.get(documentId);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: string): Promise<ApiResponse<void>> => {
    setLoading(true);
    try {
      await DocumentsService.delete(documentId);
      return { loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentStatus = useCallback(async (documentId: string): Promise<ApiResponse<DocumentStatus>> => {
    setLoading(true);
    try {
      const data = await DocumentsService.getStatus(documentId);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const crawlWebsite = useCallback(async (request: WebCrawlRequest): Promise<ApiResponse<WebCrawlResponse>> => {
    setLoading(true);
    try {
      const data = await DocumentsService.crawlWebsite(request);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCrawledWebsite = useCallback(async (documentId: string): Promise<ApiResponse<void>> => {
    setLoading(true);
    try {
      await DocumentsService.deleteCrawledWebsite(documentId);
      return { loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Chat APIs
  const chat = useCallback(async (request: ChatRequest): Promise<ApiResponse<ChatResponse>> => {
    setLoading(true);
    try {
      const data = await ChatService.chat(request);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserConversations = useCallback(async (userId: string, limit?: number): Promise<ApiResponse<{ user_id: string; conversations: any[]; total: number }>> => {
    setLoading(true);
    try {
      const data = await ChatService.getUserConversations(userId, limit);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversationHistory = useCallback(async (userId: string, conversationId: string, limit?: number): Promise<ApiResponse<{ conversation_id: string; user_id: string; messages: any[] }>> => {
    setLoading(true);
    try {
      const data = await ChatService.getConversationHistory(userId, conversationId, limit);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // WalrusAgent APIs
  const getWalrusAgents = useCallback(async (): Promise<ApiResponse<WalrusAgentResponse[]>> => {
    setLoading(true);
    try {
      const data = await WalrusAgentService.list();
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const createWalrusAgent = useCallback(async (request: CreateWalrusAgentRequest): Promise<ApiResponse<WalrusAgentResponse>> => {
    setLoading(true);
    try {
      const data = await WalrusAgentService.create(request);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getWalrusAgent = useCallback(async (agentId: string): Promise<ApiResponse<WalrusAgentResponse>> => {
    setLoading(true);
    try {
      const data = await WalrusAgentService.get(agentId);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWalrusAgent = useCallback(async (agentId: string, request: UpdateWalrusAgentRequest): Promise<ApiResponse<WalrusAgentResponse>> => {
    setLoading(true);
    try {
      const data = await WalrusAgentService.update(agentId, request);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteWalrusAgent = useCallback(async (agentId: string): Promise<ApiResponse<void>> => {
    setLoading(true);
    try {
      await WalrusAgentService.delete(agentId);
      return { loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mega Chat APIs
  const executeMegaChat = useCallback(async (request: MegaChatRequest): Promise<ApiResponse<MegaChatResponse>> => {
    setLoading(true);
    try {
      const data = await MegaChatService.execute(request);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMegaChatSessionStatus = useCallback(async (sessionId: string): Promise<ApiResponse<any>> => {
    setLoading(true);
    try {
      const data = await MegaChatService.getSessionStatus(sessionId);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMegaChatHealth = useCallback(async (): Promise<ApiResponse<any>> => {
    setLoading(true);
    try {
      const data = await MegaChatService.healthCheck();
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // SQLite APIs
  const getSqliteTables = useCallback(async (): Promise<ApiResponse<TableInfo[]>> => {
    setLoading(true);
    try {
      const data = await SqliteService.getTables();
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getSqliteTableInfo = useCallback(async (tableName: string): Promise<ApiResponse<TableInfo>> => {
    setLoading(true);
    try {
      const data = await SqliteService.getTableInfo(tableName);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSqlQuery = useCallback(async (request: QueryRequest): Promise<ApiResponse<QueryResponse>> => {
    setLoading(true);
    try {
      const data = await SqliteService.executeQuery(request);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Models APIs
  const getModels = useCallback(async (): Promise<ApiResponse<ModelInfo[]>> => {
    setLoading(true);
    try {
      const data = await ModelsService.list();
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getModel = useCallback(async (modelId: string): Promise<ApiResponse<ModelInfo>> => {
    setLoading(true);
    try {
      const data = await ModelsService.get(modelId);
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // System APIs
  const getApiInfo = useCallback(async (): Promise<ApiResponse<ApiInfo>> => {
    setLoading(true);
    try {
      const data = await SystemService.getApiInfo();
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getHealthCheck = useCallback(async (): Promise<ApiResponse<HealthResponse>> => {
    setLoading(true);
    try {
      const data = await SystemService.healthCheck();
      return { data, loading: false };
    } catch (error) {
      return { error: error as ApiError, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    // Document Management
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    getDocumentStatus,
    crawlWebsite,
    deleteCrawledWebsite,
    // Chat
    chat,
    getUserConversations,
    getConversationHistory,
    // WalrusAgent
    getWalrusAgents,
    createWalrusAgent,
    getWalrusAgent,
    updateWalrusAgent,
    deleteWalrusAgent,
    // Mega Chat
    executeMegaChat,
    getMegaChatSessionStatus,
    getMegaChatHealth,
    // SQLite
    getSqliteTables,
    getSqliteTableInfo,
    executeSqlQuery,
    // Models
    getModels,
    getModel,
    // System
    getApiInfo,
    getHealthCheck,
  };
}

// Convenience hooks for specific data fetching
export const useDocuments = () => {
  const { getDocuments } = useWalrusApi();
  return { getDocuments };
};

export const useConversations = () => {
  const { getUserConversations, getConversationHistory } = useWalrusApi();
  return { getUserConversations, getConversationHistory };
}; 