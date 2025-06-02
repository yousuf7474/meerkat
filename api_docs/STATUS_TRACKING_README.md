# Status Tracking System

This document describes the comprehensive status tracking system implemented for both chat and document operations in the Walrus API.

## Overview

The status tracking system provides real-time progress updates and detailed logging for:
- **Chat Processing**: Real-time status via SSE streams + DynamoDB storage
- **Document Operations**: Progress tracking stored in DynamoDB
- **Web Crawling**: Step-by-step progress monitoring

## Chat Status Tracking

### SSE Stream Status Messages

When using the chat endpoint with streaming (`Accept: text/event-stream`), you'll receive status messages in addition to content chunks:

```json
{
  "type": "status",
  "status": "processing", 
  "step": "retrieving_context",
  "message": "Retrieving relevant context..."
}
```

### Chat Processing Steps

The chat pipeline reports status for these steps:

1. **initializing** - Starting chat processing
2. **retrieving_context** - Retrieving relevant context from vector store
3. **selecting_model** - Selecting optimal LLM model
4. **generating_response** - Generating AI response
5. **storing_response** - Storing response in DynamoDB
6. **finished** - Processing completed successfully

### Non-Streaming Chat Status

For non-streaming chat requests, status updates are stored in DynamoDB and can be retrieved via:

```
GET /v1/chat/conversations/{user_id}/{conversation_id}/status
```

### Example SSE Response

```
data: {"type": "status", "status": "processing", "step": "initializing", "message": "Starting chat processing..."}
data: {"type": "status", "status": "processing", "step": "retrieving_context", "message": "Retrieving relevant context..."}
data: {"type": "status", "status": "processing", "step": "generating_response", "message": "Generating response..."}
data: {"type": "chunk", "content": "Artificial intelligence"}
data: {"type": "chunk", "content": " is a branch of computer science..."}
data: {"type": "complete", "metadata": {"status": "completed", "latency_ms": 1250}}
```

## Document Status Tracking

### Document Processing Steps

Document upload and web crawling operations track progress through these steps:

#### File Upload Steps:
1. **validating** (10%) - Validating file format and size
2. **extracting_text** (25%) - Extracting text content
3. **chunking_text** (50%) - Splitting into chunks
4. **creating_embeddings** (75%) - Generating vector embeddings
5. **storing_metadata** (95%) - Storing document metadata
6. **finished** (100%) - Upload completed successfully

#### Web Crawling Steps:
1. **initializing** (10%) - Initializing web crawler
2. **crawling** (25%) - Crawling website pages
3. **processing_content** (50%) - Processing crawled content
4. **creating_embeddings** (75%) - Creating embeddings
5. **storing_metadata** (95%) - Storing metadata
6. **finished** (100%) - Crawling completed

### Status API Endpoints

#### Get Document Status
```
GET /v1/documents/{document_id}/status
```

Response:
```json
{
  "processing_status": "processing",
  "processing_step": "creating_embeddings", 
  "progress_percentage": 75,
  "status_message": "Creating embeddings for 15 chunks...",
  "updated_at": "2024-01-15T10:30:45Z",
  "status_metadata": {
    "chunks_created": 15,
    "total_tokens": 3200
  }
}
```

#### Get Chat Status History
```
GET /v1/chat/conversations/{user_id}/{conversation_id}/status
```

Response:
```json
[
  {
    "conversation_id": "conv#session_001",
    "turn_id": "status#2024-01-15T10:30:00Z",
    "status": "processing",
    "step": "initializing", 
    "message": "Starting chat processing...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "conversation_id": "conv#session_001", 
    "turn_id": "status#2024-01-15T10:30:05Z",
    "status": "completed",
    "step": "finished",
    "message": "Chat processing completed successfully",
    "created_at": "2024-01-15T10:30:05Z",
    "metadata": {
      "latency_ms": 1250,
      "response_length": 485
    }
  }
]
```

## Database Schema

### Chat Status Storage

Status updates are stored in the `chat` table with the following structure:

```
PK: conversation_id (e.g., "conv#session_001")
SK: turn_id (e.g., "status#2024-01-15T10:30:00Z")
Attributes:
- item_type: "status"
- status: "processing" | "completed" | "failed"
- step: processing step name
- message: descriptive message
- timestamp: unix timestamp
- created_at: ISO datetime
- metadata: optional additional data
- ttl: 24-hour TTL for cleanup
```

### Document Status Storage

Document status is stored in the `documents` table:

```
PK: document_id
Attributes:
- processing_status: "processing" | "completed" | "failed"
- processing_step: current step name
- status_message: descriptive message
- progress_percentage: 0-100
- status_metadata: additional metrics
- updated_at: last update timestamp
```

## Client Implementation Examples

### JavaScript/TypeScript

#### Monitoring Chat with SSE
```typescript
const eventSource = new EventSource('/v1/chat/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream'
  },
  body: JSON.stringify({
    query: 'What is AI?',
    session_id: 'user_123',
    stream: true
  })
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'status':
      console.log(`Status: ${data.step} - ${data.message}`);
      updateProgressBar(data.step);
      break;
      
    case 'chunk':
      appendToResponse(data.content);
      break;
      
    case 'complete':
      console.log('Chat completed:', data.metadata);
      break;
  }
};
```

#### Monitoring Document Upload
```typescript
async function uploadWithProgress(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  // Start upload
  const uploadResponse = await fetch('/v1/documents/', {
    method: 'POST',
    body: formData
  });
  
  const { document_id } = await uploadResponse.json();
  
  // Monitor progress
  const interval = setInterval(async () => {
    const statusResponse = await fetch(`/v1/documents/${document_id}/status`);
    const status = await statusResponse.json();
    
    updateProgressBar(status.progress_percentage);
    console.log(`${status.progress_percentage}% - ${status.status_message}`);
    
    if (status.processing_status === 'completed') {
      clearInterval(interval);
      console.log('Upload completed!');
    }
  }, 1000);
}
```

### Python

#### Using the StatusMonitor Class
```python
# See example_status_usage.py for complete implementation
monitor = StatusMonitor("http://localhost:8000")

# Monitor chat with SSE
await monitor.monitor_chat_stream(
    session_id="user_123",
    query="What is artificial intelligence?"
)

# Monitor document upload
document_id = await monitor.monitor_document_upload("document.pdf")

# Get status history
await monitor.get_chat_status_history("user_123", "session_001")
```

## Frontend Integration

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface DocumentStatus {
  processing_status: string;
  processing_step: string;
  progress_percentage: number;
  status_message: string;
}

export function useDocumentStatus(documentId: string) {
  const [status, setStatus] = useState<DocumentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/v1/documents/${documentId}/status`);
        const statusData = await response.json();
        setStatus(statusData);
        
        if (statusData.processing_status !== 'processing') {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching status:', error);
        setIsLoading(false);
      }
    };

    const interval = setInterval(pollStatus, 1000);
    pollStatus(); // Initial call

    return () => clearInterval(interval);
  }, [documentId]);

  return { status, isLoading };
}
```

### Vue 3 Composition API Example

```typescript
import { ref, watch, onUnmounted } from 'vue';

export function useDocumentStatus(documentId: Ref<string>) {
  const status = ref(null);
  const isLoading = ref(true);
  let interval: number | null = null;

  const pollStatus = async () => {
    if (!documentId.value) return;
    
    try {
      const response = await fetch(`/v1/documents/${documentId.value}/status`);
      status.value = await response.json();
      
      if (status.value?.processing_status !== 'processing') {
        isLoading.value = false;
        if (interval) clearInterval(interval);
      }
    } catch (error) {
      console.error('Error:', error);
      isLoading.value = false;
    }
  };

  watch(documentId, (newId) => {
    if (newId && !interval) {
      interval = setInterval(pollStatus, 1000);
      pollStatus();
    }
  }, { immediate: true });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
  });

  return { status, isLoading };
}
```

## Best Practices

### Polling Guidelines
- **Chat Status**: Use SSE streams for real-time updates
- **Document Status**: Poll every 1-2 seconds during processing
- **Stop Polling**: When status becomes 'completed' or 'failed'
- **Error Handling**: Implement exponential backoff for failed requests

### UI/UX Recommendations
- Show progress bars for document operations
- Display current step and descriptive messages
- Provide cancel options for long-running operations
- Cache status to avoid unnecessary API calls
- Show estimated time remaining when possible

### Error Handling
- Check for 'failed' status and display error messages
- Retry failed operations with user confirmation
- Log status history for debugging
- Provide fallback UI when status is unavailable

### Performance Considerations
- Use SSE for real-time chat updates (lower overhead)
- Batch status requests when monitoring multiple documents
- Implement client-side caching for completed operations
- Use WebSocket connections for high-frequency updates if needed

## Troubleshooting

### Common Issues

1. **Status Not Found (404)**
   - Document might not exist yet
   - Status tracking not initialized
   - Check document_id validity

2. **SSE Connection Issues**
   - Verify Accept header: `text/event-stream`
   - Check for proxy/firewall blocking
   - Implement connection retry logic

3. **Progress Stuck at Same Percentage**
   - Long-running operation (normal for large files)
   - Check server logs for processing errors
   - Verify sufficient server resources

### Debug Commands

```bash
# Check chat status via curl
curl "http://localhost:8000/v1/chat/conversations/user_123/session_001/status"

# Monitor document status
curl "http://localhost:8000/v1/documents/{document_id}/status"

# Test SSE connection
curl -H "Accept: text/event-stream" \
     -H "Content-Type: application/json" \
     -d '{"query": "test", "session_id": "debug", "stream": true}' \
     "http://localhost:8000/v1/chat/"
```

This status tracking system provides comprehensive monitoring capabilities for both real-time and batch operations, enabling better user experience and operational visibility. 