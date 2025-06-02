import { useState } from 'react';
import { Plus, Bot, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWalrusAgents, useWalrusAgentMutations } from '@/hooks/useApi';
import AgentForm from '@/components/ui/agent-form';

// WalrusAgent interface based on API response
interface WalrusAgent {
  id: string;
  name: string;
  sqlite_tables: string[];
  docs: string[];
  websites: string[];
  api_calls: string[];
  description: string;
}

export default function AgentsPage() {
  const { agents, isLoading, isError, mutate } = useWalrusAgents();
  const { createWalrusAgent, updateWalrusAgent, deleteWalrusAgent } = useWalrusAgentMutations();
  
  const [deleteAgentId, setDeleteAgentId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<WalrusAgent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteAgentId) return;
    
    try {
      await deleteWalrusAgent(deleteAgentId);
      setDeleteAgentId(null);
      await mutate(); // Refresh the agents list
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const handleCreateAgent = () => {
    setEditingAgent(null);
    setIsFormOpen(true);
  };

  const handleEditAgent = (agent: WalrusAgent) => {
    setEditingAgent(agent);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (agentData: Partial<WalrusAgent>) => {
    setIsSubmitting(true);
    try {
      if (editingAgent) {
        // Update existing agent
        await updateWalrusAgent(editingAgent.id, agentData);
      } else {
        // Create new agent
        await createWalrusAgent(agentData);
      }
      
      setIsFormOpen(false);
      setEditingAgent(null);
      await mutate(); // Refresh the agents list
    } catch (error) {
      console.error('Form submission failed:', error);
      alert(`Failed to ${editingAgent ? 'update' : 'create'} agent. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
  };

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Failed to load agents. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">
            Create and manage AI agents with specific tools and data sources
          </p>
        </div>
        
        <Button onClick={handleCreateAgent}>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Agents</CardTitle>
          <CardDescription>
            {agents?.length || 0} agent(s) configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
          ) : agents && agents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Data Sources</TableHead>
                  <TableHead>API Calls</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent: any) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div>
                          <div>{agent.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {agent.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {agent.docs && agent.docs.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              📄 {agent.docs.length} docs
                            </Badge>
                          </div>
                        )}
                        {agent.websites && agent.websites.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              🌐 {agent.websites.length} sites
                            </Badge>
                          </div>
                        )}
                        {agent.sqlite_tables && agent.sqlite_tables.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              🗄️ {agent.sqlite_tables.length} tables
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.api_calls?.map((call: string) => (
                          <Badge key={call} variant="secondary" className="text-xs">
                            {call}
                          </Badge>
                        ))}
                        {(!agent.api_calls || agent.api_calls.length === 0) && (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-muted-foreground truncate">
                        {agent.description?.substring(0, 100)}...
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAgent(agent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteAgentId(agent.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">No agents created</p>
              <p className="text-muted-foreground mb-4">
                Create your first AI agent to get started
              </p>
              <Button onClick={handleCreateAgent}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Agent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Form */}
      <AgentForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialAgent={editingAgent}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      {deleteAgentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete Agent</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this agent? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteAgentId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 