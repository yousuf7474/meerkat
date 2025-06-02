import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Database, Clock, CheckCircle, XCircle, Users, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// Streaming message types from the mega_chat API
interface StreamingMessage {
  type: 'start' | 'status' | 'agents_selected' | 'agent_start' | 'agent_complete' | 'complete' | 'final' | 'done' | 'error' | 
         'planning_start' | 'planning_complete' | 'execution_start' | 'phase_start' | 'phase_complete' | 'synthesis_start' | 'synthesis_complete';
  session_id: string;
  timestamp: string;
  payload: any;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'streaming';
  content: string;
  timestamp: Date;
  agentName?: string;
  streamingData?: {
    stage: string;
    agents: AgentStatus[];
    finalResult?: any;
    isComplete: boolean;
    errorMessage?: string;
  };
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executionTimeMs?: number;
  error?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to the Enhanced Multi-Agent Chat! Your messages will be processed by specialized AI agents in real-time with streaming updates.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingProgress, setStreamingProgress] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamMegaChat = async (query: string): Promise<void> => {
    const streamingMessageId = Date.now().toString() + '_streaming';
    
    // Add initial streaming message
    const initialStreamingMessage: ChatMessage = {
      id: streamingMessageId,
      type: 'streaming',
      content: 'Processing your query...',
      timestamp: new Date(),
      streamingData: {
        stage: 'starting',
        agents: [],
        isComplete: false
      }
    };
    
    setMessages(prev => [...prev, initialStreamingMessage]);
    setStreamingProgress(0);

    try {
      const response = await fetch(`https://api.dev.scai.scalecapacity.com/v1/mega_chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          query,
          stream: true,
          max_agents: 3,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let buffer = '';
      let agents: AgentStatus[] = [];
      let finalResult: any = null;
      const totalSteps = 5; // start, selection, execution, synthesis, final

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              let dataContent = line.slice(6);
              
              // Handle double prefix issue
              if (dataContent.startsWith('data: ')) {
                dataContent = dataContent.slice(6);
              }
              
              // Skip empty data or heartbeat
              if (!dataContent.trim() || dataContent.trim() === ': heartbeat') {
                continue;
              }

              const message: StreamingMessage = JSON.parse(dataContent);
              
              // Update progress and agents based on message type
              switch (message.type) {
                case 'start':
                  setStreamingProgress((1 / totalSteps) * 100);
                  break;
                  
                case 'planning_start':
                  setStreamingProgress((1 / totalSteps) * 100);
                  break;
                  
                case 'planning_complete':
                  // Show planned agents information
                  setStreamingProgress((2 / totalSteps) * 100);
                  break;
                  
                case 'execution_start':
                  setStreamingProgress((3 / totalSteps) * 100);
                  break;
                  
                case 'phase_start':
                  // Handle phase start with agent information
                  if (message.payload?.agents) {
                    const phaseAgents = message.payload.agents.map((agent: any) => ({
                      id: agent.id,
                      name: agent.name,
                      status: 'pending' as const
                    }));
                    agents = [...agents, ...phaseAgents];
                  }
                  break;
                  
                case 'phase_complete':
                  // Handle phase completion events
                  break;
                  
                case 'synthesis_start':
                  setStreamingProgress((4 / totalSteps) * 100);
                  break;
                  
                case 'synthesis_complete':
                  setStreamingProgress((5 / totalSteps) * 100);
                  break;
                  
                case 'status':
                  const stage = message.payload?.stage;
                  if (stage === 'selection') {
                    setStreamingProgress((2 / totalSteps) * 100);
                  } else if (stage === 'execution') {
                    setStreamingProgress((3 / totalSteps) * 100);
                  } else if (stage === 'synthesis') {
                    setStreamingProgress((4 / totalSteps) * 100);
                  }
                  break;
                  
                case 'agents_selected':
                  agents = message.payload?.agents?.map((agent: any) => ({
                    id: agent.id,
                    name: agent.name,
                    status: 'pending' as const
                  })) || [];
                  break;
                  
                case 'agent_start':
                  agents = agents.map(agent => 
                    agent.id === (message.payload?.agent_id || message.payload?.agent) 
                      ? { ...agent, status: 'running' as const }
                      : agent
                  );
                  break;
                  
                case 'agent_complete':
                  agents = agents.map(agent => 
                    agent.id === (message.payload?.agent_id || message.payload?.agent) 
                      ? { 
                          ...agent, 
                          status: message.payload?.success ? 'completed' as const : 'failed' as const,
                          executionTimeMs: message.payload?.execution_time_ms,
                          error: message.payload?.error
                        }
                      : agent
                  );
                  break;
                  
                case 'complete':
                  setStreamingProgress(100);
                  break;
                  
                case 'final':
                  finalResult = message.payload?.result;
                  setStreamingProgress(100);
                  break;
                  
                case 'done':
                  // Update the streaming message to show completion
                  setMessages(prev => prev.map(msg => 
                    msg.id === streamingMessageId 
                      ? {
                          ...msg,
                          content: finalResult?.final_response || 'Query completed successfully.',
                          type: 'assistant' as const,
                          agentName: `Multi-Agent System (${agents.filter(a => a.status === 'completed').length}/${agents.length} agents)`,
                          streamingData: {
                            stage: 'completed',
                            agents,
                            finalResult,
                            isComplete: true
                          }
                        }
                      : msg
                  ));
                  return; // Exit the streaming loop
                  
                case 'error':
                  setMessages(prev => prev.map(msg => 
                    msg.id === streamingMessageId 
                      ? {
                          ...msg,
                          content: `Error: ${message.payload?.error || 'Unknown error'}`,
                          type: 'system' as const,
                          streamingData: {
                            stage: 'error',
                            agents,
                            errorMessage: message.payload?.error || 'Unknown error',
                            isComplete: true
                          }
                        }
                      : msg
                  ));
                  return;
              }

              // Update the streaming message with current progress
              setMessages(prev => prev.map(msg => 
                msg.id === streamingMessageId 
                  ? {
                      ...msg,
                      streamingData: {
                        stage: message.payload?.stage || message.type || 'processing',
                        agents,
                        finalResult,
                        isComplete: false
                      }
                    }
                  : msg
              ));

            } catch (error) {
              console.warn('Failed to parse SSE message:', line, error);
            }
          }
        }
      }

    } catch (error) {
      console.error('Streaming error:', error);
      
      // Update streaming message to show error
      setMessages(prev => prev.map(msg => 
        msg.id === streamingMessageId 
          ? {
              ...msg,
              content: `Sorry, there was an error processing your message: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: 'system' as const,
              streamingData: {
                stage: 'error',
                agents: [],
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                isComplete: true
              }
            }
          : msg
      ));
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingProgress(0);

    try {
      await streamMegaChat(userMessage.content);
    } finally {
      setIsLoading(false);
      setStreamingProgress(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAgentStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'selection':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'execution':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'synthesis':
        return <Target className="h-4 w-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bot className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Enhanced Multi-Agent Chat</h1>
          <p className="text-muted-foreground">
            Real-time streaming chat with AI agents that can access your documents, websites, and databases
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>AI Assistant</span>
              <Badge variant="default">Multi-Agent Streaming</Badge>
            </CardTitle>
            <CardDescription>
              Powered by multiple specialized AI agents working together with real-time updates
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'system'
                          ? 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        ) : message.type === 'assistant' ? (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        ) : message.type === 'streaming' ? (
                          getStageIcon(message.streamingData?.stage || 'processing')
                        ) : null}
                        <div className="flex-1">
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                          
                          {/* Streaming Data Visualization */}
                          {message.type === 'streaming' && message.streamingData && (
                            <div className="mt-3 space-y-3">
                              {/* Progress Bar */}
                              {!message.streamingData.isComplete && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="capitalize">{message.streamingData.stage}</span>
                                    <span>{Math.round(streamingProgress)}%</span>
                                  </div>
                                  <Progress value={streamingProgress} className="h-2" />
                                </div>
                              )}
                              
                              {/* Agent Status */}
                              {message.streamingData.agents.length > 0 && (
                                <div className="space-y-2">
                                  <hr />
                                  <div className="text-xs font-medium text-muted-foreground">Agent Status:</div>
                                  <div className="grid gap-2">
                                    {message.streamingData.agents.map((agent) => (
                                      <div key={agent.id} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-2">
                                          {getAgentStatusIcon(agent.status)}
                                          <span className="font-medium">{agent.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {agent.executionTimeMs && (
                                            <Badge variant="outline" className="text-xs">
                                              {agent.executionTimeMs.toFixed(0)}ms
                                            </Badge>
                                          )}
                                          <Badge 
                                            variant={
                                              agent.status === 'completed' ? 'default' :
                                              agent.status === 'failed' ? 'destructive' :
                                              agent.status === 'running' ? 'secondary' : 'outline'
                                            }
                                            className="text-xs"
                                          >
                                            {agent.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Error Message */}
                              {message.streamingData.errorMessage && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 text-xs text-red-700 dark:text-red-300">
                                  <strong>Error:</strong> {message.streamingData.errorMessage}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </div>
                            {message.agentName && (
                              <Badge variant="outline" className="text-xs">
                                {message.agentName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI agents are processing your query...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your documents, websites, or data..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Real-time Streaming</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Watch AI agents work in real-time with live progress updates
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Multi-Source Access</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Agents can simultaneously query documents, websites, and databases
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Intelligent Synthesis</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Multiple agent outputs are intelligently combined into coherent responses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 