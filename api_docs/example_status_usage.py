#!/usr/bin/env python3
"""
Example script demonstrating status tracking features for chat and document operations.

This script shows how to:
1. Monitor chat processing status via SSE streams
2. Check document processing status via REST API
3. Retrieve status history for debugging

Usage:
    python example_status_usage.py
"""

import asyncio
import aiohttp
import json
import time
from typing import AsyncIterator


class StatusMonitor:
    """Monitor status updates for chat and document operations."""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
    
    async def monitor_chat_stream(self, session_id: str, query: str) -> None:
        """Monitor chat processing via SSE stream."""
        url = f"{self.base_url}/v1/chat/"
        headers = {
            'Accept': 'text/event-stream',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "query": query,
            "session_id": session_id,
            "stream": True
        }
        
        print(f"🚀 Starting chat stream for session: {session_id}")
        print(f"📝 Query: {query}")
        print("-" * 50)
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200:
                    async for line in response.content:
                        if line:
                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith('data: '):
                                data_str = line_str[6:]  # Remove 'data: ' prefix
                                try:
                                    data = json.loads(data_str)
                                    await self._handle_chat_event(data)
                                except json.JSONDecodeError:
                                    continue
                else:
                    print(f"❌ Error: {response.status} - {await response.text()}")
    
    async def _handle_chat_event(self, event_data: dict) -> None:
        """Handle different types of chat events."""
        event_type = event_data.get('type')
        
        if event_type == 'status':
            status = event_data.get('status')
            step = event_data.get('step')
            message = event_data.get('message')
            print(f"📊 Status: {status} | Step: {step} | {message}")
            
        elif event_type == 'chunk':
            content = event_data.get('content', '')
            print(f"💬 {content}", end='', flush=True)
            
        elif event_type == 'complete':
            metadata = event_data.get('metadata', {})
            latency = metadata.get('latency_ms', 0)
            print(f"\n✅ Chat completed in {latency}ms")
            
        elif event_type == 'error':
            error = event_data.get('error')
            print(f"❌ Error: {error}")
    
    async def monitor_document_upload(self, file_path: str) -> str:
        """Monitor document upload progress."""
        url = f"{self.base_url}/v1/documents/"
        
        print(f"📁 Starting document upload: {file_path}")
        print("-" * 50)
        
        # Upload document
        async with aiohttp.ClientSession() as session:
            with open(file_path, 'rb') as file:
                data = aiohttp.FormData()
                data.add_field('file', file, filename=file_path)
                
                async with session.post(url, data=data) as response:
                    if response.status == 201:
                        result = await response.json()
                        document_id = result['document_id']
                        print(f"✅ Upload initiated. Document ID: {document_id}")
                        
                        # Monitor progress
                        await self._monitor_document_progress(document_id)
                        return document_id
                    else:
                        error_text = await response.text()
                        print(f"❌ Upload failed: {response.status} - {error_text}")
                        return None
    
    async def _monitor_document_progress(self, document_id: str) -> None:
        """Monitor document processing progress."""
        url = f"{self.base_url}/v1/documents/{document_id}/status"
        
        print("📊 Monitoring processing status...")
        
        async with aiohttp.ClientSession() as session:
            while True:
                try:
                    async with session.get(url) as response:
                        if response.status == 200:
                            status_data = await response.json()
                            
                            processing_status = status_data.get('processing_status')
                            step = status_data.get('processing_step')
                            progress = status_data.get('progress_percentage', 0)
                            message = status_data.get('status_message', '')
                            
                            print(f"📊 [{progress:3d}%] {processing_status} | {step} | {message}")
                            
                            if processing_status in ['completed', 'failed']:
                                break
                                
                        elif response.status == 404:
                            print("⏳ Status not available yet...")
                        else:
                            print(f"❌ Error checking status: {response.status}")
                            break
                            
                except Exception as e:
                    print(f"❌ Error: {e}")
                    break
                
                await asyncio.sleep(1)  # Check every second
    
    async def get_chat_status_history(self, user_id: str, conversation_id: str) -> None:
        """Retrieve chat status history for debugging."""
        url = f"{self.base_url}/v1/chat/conversations/{user_id}/{conversation_id}/status"
        
        print(f"📋 Retrieving chat status history for {conversation_id}")
        print("-" * 50)
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    history = await response.json()
                    
                    for entry in history:
                        timestamp = entry.get('created_at')
                        status = entry.get('status')
                        step = entry.get('step')
                        message = entry.get('message', '')
                        
                        print(f"🕐 {timestamp} | {status} | {step} | {message}")
                else:
                    error_text = await response.text()
                    print(f"❌ Error: {response.status} - {error_text}")


async def main():
    """Demonstrate status tracking features."""
    monitor = StatusMonitor()
    
    print("🔍 Walrus API Status Tracking Demo")
    print("=" * 60)
    
    # Demo 1: Chat with status monitoring
    print("\n1️⃣ Chat Status Monitoring (SSE Stream)")
    await monitor.monitor_chat_stream(
        session_id="demo_session_001",
        query="What is artificial intelligence and how does machine learning work?"
    )
    
    await asyncio.sleep(2)  # Brief pause
    
    # Demo 2: Document upload with progress monitoring
    print("\n2️⃣ Document Upload Progress Monitoring")
    # Note: You'll need to provide an actual file path
    # document_id = await monitor.monitor_document_upload("test_document.pdf")
    print("📁 Skipping document upload demo (no test file provided)")
    
    await asyncio.sleep(2)  # Brief pause
    
    # Demo 3: Chat status history
    print("\n3️⃣ Chat Status History Retrieval")
    await monitor.get_chat_status_history(
        user_id="demo_session_001",
        conversation_id="demo_session_001"
    )
    
    print("\n✨ Demo completed!")


if __name__ == "__main__":
    asyncio.run(main()) 