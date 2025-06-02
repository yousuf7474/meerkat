import useSWR from 'swr';
import { 
  DocumentsService, 
  AgentCardsService, 
  WalrusAgentService,
  ToolsService,
  ChatService,
  SqliteService, 
  ModelsService
} from '../lib/api/client';
import { CrawlerService } from '../lib/api/services/CrawlerService';
import type { components } from '../lib/api/types';
import type { CrawlSiteResponse } from '../lib/api/services/CrawlerService';

// Type definitions for better type safety
type DocumentMetadata = components['schemas']['DocumentMetadata'];
type AgentCardListResponse = components['schemas']['AgentCardListResponse'];
type WalrusAgentResponse = components['schemas']['WalrusAgentResponse'];
type TableInfo = components['schemas']['TableInfo'];
type ModelInfo = components['schemas']['ModelInfo'];

// Generic fetcher function using the new client services
const fetcher = async (key: string) => {
  const [endpoint] = key.split('|');
  
  switch (endpoint) {
    case 'documents':
      return DocumentsService.list({ document_type: 'file_upload' });
    case 'crawler-sites':
      return CrawlerService.listSites();
    case 'agents':
      // For the legacy agents page, we use the legacy cards endpoint
      return AgentCardsService.list();
    case 'walrus-agents':
      // For new WalrusAgent functionality
      return WalrusAgentService.list();
    case 'agent-tools':
      return ToolsService.listTools();
    case 'agent-sources':
      return ToolsService.listSources();
    case 'sqlite-tables':
      return SqliteService.getTables();
    case 'models':
      return ModelsService.list();
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

// Custom hooks for each endpoint
export const useDocuments = () => {
  const { data, error, mutate } = useSWR('documents', fetcher);
  
  return {
    documents: data as DocumentMetadata[] | undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useCrawlerSites = () => {
  const { data, error, mutate } = useSWR('crawler-sites', fetcher);
  
  return {
    sites: data as CrawlSiteResponse[] | undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useAgents = () => {
  const { data, error, mutate } = useSWR('agents', fetcher);
  const agentListResponse = data as AgentCardListResponse | undefined;
  
  return {
    // Extract the cards array from the response object
    agents: agentListResponse?.cards || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useWalrusAgents = () => {
  const { data, error, mutate } = useSWR('walrus-agents', fetcher);
  
  return {
    agents: data as WalrusAgentResponse[] | undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useAgentTools = () => {
  const { data, error, mutate } = useSWR('agent-tools', fetcher);
  
  return {
    tools: data as Array<{
      name: string;
      description: string;
      category: string;
      examples: string[];
    }> | undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useAgentSources = () => {
  const { data, error, mutate } = useSWR('agent-sources', fetcher);
  
  return {
    sources: data as Array<{
      name: string;
      source_type: string;
      description: string;
      capabilities: string[];
    }> | undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useToolsInfo = () => {
  const { data: agentTools, error: agentToolsError } = useSWR('agent-tools', fetcher);
  
  return {
    tools: {
      agent_tools: agentTools,
    },
    isLoading: !agentTools,
    isError: agentToolsError,
  };
};

export const useSqliteTables = () => {
  const { data, error } = useSWR('sqlite-tables', fetcher);
  
  return {
    tables: data as TableInfo[] | undefined,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useModels = () => {
  const { data, error } = useSWR('models', fetcher);
  
  return {
    models: data as ModelInfo[] | undefined,
    isLoading: !error && !data,
    isError: error,
  };
};

// Mutation hooks using the new client
export const useDocumentMutations = () => {
  const { mutate } = useDocuments();
  
  const uploadDocument = async (file: File) => {
    try {
      const result = await DocumentsService.upload(file);
      mutate(); // Refresh the documents list
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteDocument = async (documentId: string) => {
    try {
      await DocumentsService.delete(documentId);
      mutate(); // Refresh the documents list
    } catch (error) {
      throw error;
    }
  };
  
  return {
    uploadDocument,
    deleteDocument,
  };
};

export const useCrawlerMutations = () => {
  const { mutate } = useCrawlerSites();
  
  const addSite = async (siteData: { url: string; max_depth?: number; max_pages?: number }) => {
    try {
      const result = await CrawlerService.addSite(siteData);
      mutate(); // Refresh the sites list
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteSite = async (siteId: string) => {
    try {
      await CrawlerService.deleteSite(siteId);
      mutate(); // Refresh the sites list
    } catch (error) {
      throw error;
    }
  };
  
  const recrawlSite = async (siteId: string) => {
    try {
      const result = await CrawlerService.recrawlSite(siteId);
      mutate(); // Refresh the sites list
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  return {
    addSite,
    deleteSite,
    recrawlSite,
  };
};

export const useAgentMutations = () => {
  const { mutate } = useAgents();
  
  const createAgent = async (agentData: any) => {
    try {
      const result = await AgentCardsService.create(agentData);
      mutate(); // Refresh the agents list
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  const updateAgent = async (_agentId: string, _agentData: any) => {
    try {
      // Note: Legacy agent cards don't have an update endpoint in the current spec
      // This would need to be implemented on the backend
      throw new Error('Update agent not implemented in v2 API');
    } catch (error) {
      throw error;
    }
  };
  
  const deleteAgent = async (_agentId: string) => {
    try {
      // Note: Legacy agent cards don't have a delete endpoint in the current spec
      // This would need to be implemented on the backend
      throw new Error('Delete agent not implemented in v2 API');
    } catch (error) {
      throw error;
    }
  };
  
  return {
    createAgent,
    updateAgent,
    deleteAgent,
  };
};

export const useWalrusAgentMutations = () => {
  const { mutate } = useWalrusAgents();
  
  const createWalrusAgent = async (agentData: any) => {
    try {
      const result = await WalrusAgentService.create(agentData);
      mutate(); // Refresh the agents list
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  const updateWalrusAgent = async (agentId: string, agentData: any) => {
    try {
      const result = await WalrusAgentService.update(agentId, agentData);
      mutate(); // Refresh the agents list
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteWalrusAgent = async (agentId: string) => {
    try {
      await WalrusAgentService.delete(agentId);
      mutate(); // Refresh the agents list
    } catch (error) {
      throw error;
    }
  };
  
  return {
    createWalrusAgent,
    updateWalrusAgent,
    deleteWalrusAgent,
  };
}; 