# Status Tracking Implementation

This document outlines the comprehensive status tracking system implemented in the Meerkat React frontend application.

## Overview

The frontend now includes real-time status tracking for all major operations:
- **Chat Operations**: WebSocket-based status updates during AI response generation
- **Document Upload**: Real-time processing status with progress indicators
- **Website Crawling**: Live crawl status with page count and progress tracking

## Components Added

### 1. StatusMessage Component (`src/components/StatusMessage.tsx`)
A reusable component that displays processing status with:
- Status icons (loading spinner, success checkmark, error alert)
- Step-by-step progress descriptions
- Progress bars with percentage completion
- Metadata display (tokens, chunks, pages crawled)

**Features:**
- Supports different status types: `processing`, `completed`, `failed`
- Human-readable step names for all operation types
- Optional progress bar display
- Customizable styling with className prop

### 2. Status Monitor Hooks (`src/hooks/useStatusMonitor.ts`)

#### `useDocumentStatusMonitor(documentId)`
- Automatically polls document processing status every second
- Stops monitoring when processing completes or fails
- Returns current status, monitoring state, and any errors
- Handles cleanup and prevents memory leaks

#### `useCrawlStatusMonitor(crawlId)`
- Similar to document monitor but for website crawling operations
- Tracks crawl progress, pages processed, and completion status
- Auto-stops when crawl finishes

### 3. Enhanced API Client (`src/hooks/useWalrusApi.ts`)
Updated with new endpoints and types:
- `getDocumentStatus(documentId)` - Get document processing status
- `getCrawlStatus(crawlId)` - Get website crawl status
- `getChatStatusHistory(userId, conversationId)` - Get chat status history

**New Types Added:**
- `DocumentStatus` - Document processing status with steps and progress
- `CrawlStatus` - Website crawl status with page counts and progress
- `ChatStatusHistory` - Chat operation status tracking

### 4. WebSocket Status Integration (`src/hooks/useWalrusWS.ts`)
Enhanced WebSocket hook to handle status messages:
- Tracks current chat processing status
- Handles status message types from the server
- Maintains connection state and auto-reconnection
- Clears status when new messages are sent

## Page Updates

### Chat Page (`src/pages/ChatPage.tsx`)
- **Status Display**: Shows real-time chat processing status between user input and AI response
- **Step Tracking**: Displays current processing step (initializing, retrieving context, generating response, etc.)
- **Visual Feedback**: Status messages appear in the chat flow with appropriate styling
- **Auto-scroll**: Automatically scrolls to show status updates

### Upload Page (`src/pages/UploadPage.tsx`)
- **Real-time Processing**: Shows document processing status after upload
- **Progress Tracking**: Displays progress percentage and current processing step
- **Metadata Display**: Shows chunks created and token counts
- **UI State Management**: Disables upload area during processing
- **Auto-refresh**: Refreshes document list when processing completes

### Crawl Page (`src/pages/CrawlPage.tsx`)
- **Live Crawl Status**: Real-time updates during website crawling
- **Progress Indicators**: Shows pages crawled vs total pages
- **Step Tracking**: Displays current crawl step (initializing, crawling, processing content, etc.)
- **Form State**: Disables form inputs during active crawling
- **Auto-completion**: Clears form and refreshes list when crawl completes

## Status Message Types

### Chat Status Steps
- `initializing` → "Initializing"
- `retrieving_context` → "Retrieving Context"
- `selecting_model` → "Selecting Model"
- `generating_response` → "Generating Response"
- `storing_response` → "Storing Response"
- `finished` → "Complete"

### Document Processing Steps
- `validating` → "Validating File"
- `extracting_text` → "Extracting Text"
- `chunking_text` → "Processing Content"
- `creating_embeddings` → "Creating Embeddings"
- `storing_metadata` → "Finalizing"

### Website Crawl Steps
- `initializing` → "Initializing"
- `crawling` → "Crawling Pages"
- `processing_content` → "Processing Content"
- `creating_embeddings` → "Creating Embeddings"
- `storing_metadata` → "Finalizing"

## Technical Implementation

### Polling Strategy
- Document and crawl status monitoring uses 1-second polling intervals
- Automatic cleanup when operations complete or components unmount
- Error handling with retry logic and timeout management

### WebSocket Integration
- Real-time status updates for chat operations
- Automatic reconnection with exponential backoff
- Status message parsing and state management

### State Management
- React hooks for status tracking with proper cleanup
- TypeScript interfaces for type safety
- Error boundary handling for graceful degradation

### Performance Considerations
- Efficient polling with automatic stop conditions
- Memory leak prevention with proper cleanup
- Minimal re-renders through optimized state updates

## Usage Examples

### Monitoring Document Upload
```typescript
const [uploadId, setUploadId] = useState<string | null>(null);
const { status, isMonitoring, error } = useDocumentStatusMonitor(uploadId);

// Display status
{status && (
  <StatusMessage
    status={status.processing_status}
    step={status.processing_step}
    message={status.status_message}
    progress={status.progress_percentage}
  />
)}
```

### WebSocket Chat Status
```typescript
const { state } = useWalrusWS(userId);

// Display current chat status
{state.currentStatus && (
  <StatusMessage
    status={state.currentStatus.status}
    step={state.currentStatus.step}
    message={state.currentStatus.message}
    showProgress={false}
  />
)}
```

## Environment Configuration

The status tracking system uses the following environment variables:
- `VITE_API_BASE_URL` - Base URL for REST API endpoints (default: http://localhost:8000)
- `VITE_WS_BASE_URL` - Base URL for WebSocket connections (default: ws://localhost:8000)

## Error Handling

- Network errors are caught and displayed to users
- Polling automatically stops on persistent errors
- WebSocket reconnection with exponential backoff
- Graceful degradation when status endpoints are unavailable

## Future Enhancements

- Configurable polling intervals
- Batch status updates for multiple operations
- Status persistence across page refreshes
- Push notifications for long-running operations
- Advanced error recovery strategies 