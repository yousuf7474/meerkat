import { useEffect, useState } from 'react';
import { Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWalrusApi } from '@/hooks/useWalrusApi';

export default function ChatSidebar() {
  const [userId] = useState('default-user'); // In a real app, this would come from auth
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getUserConversations } = useWalrusApi();

  const fetchConversations = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserConversations(userId);
      if (response.data) {
        setConversations(response.data.conversations || []);
      } else if (response.error) {
        setError(response.error.detail || 'Failed to load conversations');
      }
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(userId);
  }, [userId]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // In a real app, this would load the conversation history
  };

  const handleDeleteConversation = async (conversationId: string) => {
    // Implementation would call delete API
    console.log('Delete conversation:', conversationId);
    // Refresh the list after deletion
    await fetchConversations(userId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm text-destructive">Error loading conversations: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Conversations
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {!conversations || conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No conversations yet. Start a chat to see your history here.
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.conversation_id}
                className={`group relative p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                  selectedConversation === conversation.conversation_id
                    ? 'bg-accent border-brand'
                    : 'border-border'
                }`}
                onClick={() => handleSelectConversation(conversation.conversation_id)}
              >
                <div className="pr-8">
                  <h3 className="text-sm font-medium truncate">
                    {conversation.title || 'Untitled Conversation'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.message_count || 0} messages
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(conversation.updated_at)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conversation.conversation_id);
                  }}
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 