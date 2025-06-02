import React, { useState, useEffect } from 'react';
import { X, Plus, Bot, Database, Globe, FileText, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  useSqliteTables, 
  useDocuments, 
  useCrawlerSites, 
  useAgentTools 
} from '@/hooks/useApi';

interface WalrusAgent {
  id: string;
  name: string;
  sqlite_tables: string[];
  docs: string[];
  websites: string[];
  api_calls: string[];
  description?: string;
}

interface AgentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agent: Partial<WalrusAgent>) => Promise<void>;
  initialAgent?: WalrusAgent | null;
  isLoading?: boolean;
}

export default function AgentForm({ isOpen, onClose, onSubmit, initialAgent, isLoading }: AgentFormProps) {
  const [formData, setFormData] = useState<Partial<WalrusAgent>>({
    id: '',
    name: '',
    sqlite_tables: [],
    docs: [],
    websites: [],
    api_calls: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newItem, setNewItem] = useState<Record<string, string>>({
    website: '',
  });

  // Data for selection options
  const { tables, isLoading: tablesLoading } = useSqliteTables();
  const { documents, isLoading: docsLoading } = useDocuments();
  const { sites, isLoading: sitesLoading } = useCrawlerSites();
  const { tools, isLoading: toolsLoading } = useAgentTools();

  // Reset form when opening/closing or when initialAgent changes
  useEffect(() => {
    if (isOpen) {
      if (initialAgent) {
        setFormData({
          id: initialAgent.id,
          name: initialAgent.name,
          sqlite_tables: [...initialAgent.sqlite_tables],
          docs: [...initialAgent.docs],
          websites: [...initialAgent.websites],
          api_calls: [...initialAgent.api_calls],
        });
      } else {
        setFormData({
          id: '',
          name: '',
          sqlite_tables: [],
          docs: [],
          websites: [],
          api_calls: [],
        });
      }
      setErrors({});
      setNewItem({ website: '' });
    }
  }, [isOpen, initialAgent]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id?.trim()) {
      newErrors.id = 'Agent ID is required';
    } else if (!/^[a-z0-9-_]+$/.test(formData.id)) {
      newErrors.id = 'ID must contain only lowercase letters, numbers, hyphens, and underscores';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Agent name is required';
    }

    if (formData.sqlite_tables && formData.sqlite_tables.length > 4) {
      newErrors.sqlite_tables = 'Maximum 4 SQLite tables allowed';
    }

    if (formData.api_calls && formData.api_calls.length > 2) {
      newErrors.api_calls = 'Maximum 2 API calls allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addItem = (field: keyof WalrusAgent, value: string) => {
    if (!value.trim()) return;

    const currentItems = formData[field] as string[] || [];
    if (!currentItems.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentItems, value.trim()]
      }));
    }
  };

  const removeItem = (field: keyof WalrusAgent, index: number) => {
    const currentItems = formData[field] as string[] || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentItems.filter((_, i) => i !== index)
    }));
  };

  const addWebsite = () => {
    const website = newItem.website.trim();
    if (website) {
      // Basic URL validation
      try {
        new URL(website.startsWith('http') ? website : `https://${website}`);
        addItem('websites', website);
        setNewItem(prev => ({ ...prev, website: '' }));
      } catch {
        setErrors(prev => ({ ...prev, website: 'Please enter a valid URL' }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">
                {initialAgent ? 'Edit Agent' : 'Create New Agent'}
              </h2>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>
                  Define the agent's identity and basic properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id">Agent ID</Label>
                    <Input
                      id="id"
                      value={formData.id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                      placeholder="e.g., university-advisor"
                      disabled={!!initialAgent} // ID cannot be changed when editing
                      className={errors.id ? 'border-red-500' : ''}
                    />
                    {errors.id && <p className="text-sm text-red-500 mt-1">{errors.id}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., University Academic Advisor"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Sources
                </CardTitle>
                <CardDescription>
                  Select the data sources this agent can access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* SQLite Tables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>SQLite Tables (max 4)</Label>
                    <span className="text-sm text-muted-foreground">
                      {formData.sqlite_tables?.length || 0}/4
                    </span>
                  </div>
                  
                  {tablesLoading ? (
                    <div className="text-sm text-muted-foreground">Loading tables...</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                      {tables?.filter(table => table.name).map((table) => (
                        <button
                          key={table.name}
                          type="button"
                          onClick={() => addItem('sqlite_tables', table.name!)}
                          disabled={
                            (formData.sqlite_tables?.length || 0) >= 4 ||
                            formData.sqlite_tables?.includes(table.name!)
                          }
                          className={`p-2 text-sm border rounded transition-colors text-left ${
                            formData.sqlite_tables?.includes(table.name!)
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'hover:bg-gray-50 border-gray-200'
                          } ${
                            (formData.sqlite_tables?.length || 0) >= 4 && !formData.sqlite_tables?.includes(table.name!)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                        >
                          {table.name}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.sqlite_tables?.map((table, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {table}
                        <button
                          type="button"
                          onClick={() => removeItem('sqlite_tables', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {errors.sqlite_tables && (
                    <p className="text-sm text-red-500 mt-1">{errors.sqlite_tables}</p>
                  )}
                </div>

                {/* Documents */}
                <div>
                  <Label className="flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-1" />
                    Documents
                  </Label>
                  
                  {docsLoading ? (
                    <div className="text-sm text-muted-foreground">Loading documents...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 max-h-40 overflow-y-auto">
                      {documents?.filter(doc => doc.document_id).map((doc) => (
                        <button
                          key={doc.document_id}
                          type="button"
                          onClick={() => addItem('docs', doc.document_id!)}
                          disabled={formData.docs?.includes(doc.document_id!)}
                          className={`p-2 text-sm border rounded transition-colors text-left ${
                            formData.docs?.includes(doc.document_id!)
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'hover:bg-gray-50 border-gray-200 cursor-pointer'
                          }`}
                        >
                          <div className="font-medium">{doc.filename}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {doc.document_id}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.docs?.map((docId, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {documents?.find(d => d.document_id === docId)?.filename || docId}
                        <button
                          type="button"
                          onClick={() => removeItem('docs', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Websites */}
                <div>
                  <Label className="flex items-center mb-2">
                    <Globe className="h-4 w-4 mr-1" />
                    Websites
                  </Label>
                  
                  {/* Existing crawled sites */}
                  {sitesLoading ? (
                    <div className="text-sm text-muted-foreground">Loading sites...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      {sites?.map((site) => (
                        <button
                          key={site.id}
                          type="button"
                          onClick={() => addItem('websites', site.url)}
                          disabled={formData.websites?.includes(site.url)}
                          className={`p-2 text-sm border rounded transition-colors text-left ${
                            formData.websites?.includes(site.url)
                              ? 'bg-purple-50 border-purple-200 text-purple-700'
                              : 'hover:bg-gray-50 border-gray-200 cursor-pointer'
                          }`}
                        >
                          <div className="font-medium truncate">{site.url}</div>
                          <div className="text-xs text-muted-foreground">
                            Status: {site.status}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Add new website */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newItem.website}
                      onChange={(e) => setNewItem(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                      className={errors.website ? 'border-red-500' : ''}
                    />
                    <Button type="button" onClick={addWebsite} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.website && <p className="text-sm text-red-500 mb-2">{errors.website}</p>}
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.websites?.map((website, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span className="max-w-40 truncate">{website}</span>
                        <button
                          type="button"
                          onClick={() => removeItem('websites', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* External Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  External Tools
                </CardTitle>
                <CardDescription>
                  Select external API tools this agent can use (max 2)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <Label>API Calls</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.api_calls?.length || 0}/2
                  </span>
                </div>
                
                {toolsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading tools...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {tools?.map((tool) => (
                      <button
                        key={tool.name}
                        type="button"
                        onClick={() => addItem('api_calls', tool.name)}
                        disabled={
                          (formData.api_calls?.length || 0) >= 2 ||
                          formData.api_calls?.includes(tool.name)
                        }
                        className={`p-3 text-sm border rounded transition-colors text-left ${
                          formData.api_calls?.includes(tool.name)
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'hover:bg-gray-50 border-gray-200'
                        } ${
                          (formData.api_calls?.length || 0) >= 2 && !formData.api_calls?.includes(tool.name)
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-xs text-muted-foreground">{tool.description}</div>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {formData.api_calls?.map((apiCall, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      {apiCall}
                      <button
                        type="button"
                        onClick={() => removeItem('api_calls', index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                {errors.api_calls && (
                  <p className="text-sm text-red-500 mt-1">{errors.api_calls}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-2 p-6 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (initialAgent ? 'Update Agent' : 'Create Agent')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 