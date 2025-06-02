import { Database, FileText, Globe, Code, Wrench } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAgentTools, useSqliteTables } from '@/hooks/useApi';

export default function ToolsPage() {
  const { tools, isLoading, isError } = useAgentTools();
  const { tables, isLoading: tablesLoading } = useSqliteTables();

  const getToolIcon = (toolName: string) => {
    if (toolName.includes('sqlite') || toolName.includes('database')) {
      return <Database className="h-5 w-5 text-blue-600" />;
    }
    if (toolName.includes('document') || toolName.includes('upload')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    if (toolName.includes('crawl') || toolName.includes('website')) {
      return <Globe className="h-5 w-5 text-green-600" />;
    }
    if (toolName.includes('api')) {
      return <Code className="h-5 w-5 text-purple-600" />;
    }
    return <Wrench className="h-5 w-5 text-gray-600" />;
  };

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Failed to load tools information. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tools Registry</h1>
        <p className="text-muted-foreground">
          Explore available tools and data sources for AI agents
        </p>
      </div>

      {/* Tools Information */}
      <Card>
        <CardHeader>
          <CardTitle>Available Tools & Sources</CardTitle>
          <CardDescription>
            View detailed information about each tool and data source available to agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
          ) : tools && tools.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {tools.map((tool, index) => (
                <AccordionItem key={tool.name || index} value={tool.name || `tool-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center space-x-3">
                      {getToolIcon(tool.name || '')}
                      <div>
                        <div className="font-medium">{tool.name || 'Unknown Tool'}</div>
                        <div className="text-sm text-muted-foreground">
                          {tool.description || 'No description available'}
                        </div>
                      </div>
                      {/* Tool Type Badge */}
                      {(tool as any).kind && (
                        <Badge variant="outline">{(tool as any).kind}</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {tool.description || 'No description available'}
                        </p>
                      </div>
                      
                      {/* Entrypoint */}
                      {(tool as any).entrypoint && (
                        <div>
                          <h4 className="font-medium mb-2">Entrypoint</h4>
                          <Badge variant="secondary">{(tool as any).entrypoint}</Badge>
                        </div>
                      )}
                      
                      {/* Examples */}
                      {tool.examples && tool.examples.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Examples</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {tool.examples.slice(0, 3).map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Schema (if available) */}
                      {(tool as any).schema && (
                        <div>
                          <h4 className="font-medium mb-2">Schema</h4>
                          <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-20"
                               title="Tool schema"
                               content={JSON.stringify((tool as any).schema, null, 2)}
                          >
                            {JSON.stringify((tool as any).schema, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {tool.name === 'query_sqlite' && (
                        <div>
                          <h4 className="font-medium mb-2">Available Tables</h4>
                          {tablesLoading ? (
                            <div className="text-sm text-muted-foreground">Loading tables...</div>
                          ) : tables && tables.length > 0 ? (
                            <div className="space-y-2">
                              {tables.map((table) => (
                                <div key={table.name} className="border rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline">{table.name}</Badge>
                                  </div>
                                  <div className="text-sm">
                                    <strong>Columns:</strong>
                                    <div className="mt-1 space-y-1">
                                      {table.columns?.map((column: any) => (
                                        <div key={column.name} className="flex justify-between">
                                          <span className="font-mono text-xs">{column.name}</span>
                                          <span className="text-xs text-muted-foreground">{column.type}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No tables available</div>
                          )}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tools available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 