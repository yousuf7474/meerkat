# 🦫 Meerkat
**Multi-Agent RAG System Frontend**

A sophisticated React application that provides a beautiful interface for managing and interacting with a Multi-Agent Retrieval-Augmented Generation (RAG) system. Built with modern technologies for real-time AI agent orchestration, document management, and intelligent chat capabilities.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🤖 Multi-Agent Chat System
- **Real-time streaming responses** with live progress tracking
- **Agent orchestration** with visual status indicators
- **Phase-based execution** (Planning → Execution → Synthesis)
- **Intelligent agent selection** based on query context
- **Error handling** and retry mechanisms

### 📚 Document Management
- Upload and manage knowledge base documents
- Document preprocessing and indexing
- Full-text search capabilities
- Document metadata management

### 🕷️ Web Crawler
- Automated web content crawling
- URL queue management
- Content extraction and processing
- Crawl status monitoring

### ⚙️ Agent & Tools Management
- Configure AI agents and their capabilities
- Tool integration and management
- Agent performance monitoring
- Custom tool creation interface

### 🛠️ Admin Dashboard
- System configuration and monitoring
- User management and permissions
- API key management
- System health metrics

## 🏗️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing with lazy loading

### UI Components & Styling
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - Reusable component system

### State Management & Data Fetching
- **SWR** - Data fetching with caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Real-time Communication
- **Server-Sent Events** - Real-time streaming updates
- **ReconnectingWebSocket** - Resilient WebSocket connections
- **Microsoft Fetch Event Source** - Enhanced SSE handling

### API Integration
- **Axios** - HTTP client
- **OpenAPI TypeScript** - Auto-generated API types
- **AsyncAPI** - WebSocket API documentation

### Development Tools
- **ESLint** - Code linting with Airbnb config
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meerkat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_BASE_URL to your backend URL
   ```

4. **Set up API specifications**
   - Place your OpenAPI 3.1 specification in `specs/openapi.yaml`
   - Place your AsyncAPI 3.0 specification in `specs/asyncapi.yaml`

5. **Generate API clients**
   ```bash
   npm run generate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
meerkat/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatPage.tsx    # Multi-agent chat interface
│   │   ├── DocumentsPage.tsx
│   │   ├── CrawlerPage.tsx
│   │   ├── AgentsPage.tsx
│   │   ├── ToolsPage.tsx
│   │   └── AdminPage.tsx
│   ├── layouts/            # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── lib/               # Utilities and API clients
│   └── router.tsx         # Application routing
├── specs/                 # API specifications
│   ├── openapi.yaml       # REST API spec
│   └── asyncapi.yaml      # WebSocket API spec
├── public/               # Static assets
└── dist/                # Production build
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run generate` - Generate API clients from specs
- `npm run generate:rest` - Generate REST API types
- `npm run generate:ws` - Generate WebSocket API types

## 🌐 API Integration

The application integrates with a backend API that provides:

- **REST API** - Document management, agent configuration, system admin
- **WebSocket API** - Real-time updates and notifications  
- **Streaming API** - Server-sent events for chat responses

API types are automatically generated from OpenAPI and AsyncAPI specifications.

## 🎨 UI Components

Built with a consistent design system using:

- **Radix UI** primitives for accessibility
- **Tailwind CSS** for styling
- **shadcn/ui** component patterns
- **Custom theme** with CSS variables
- **Responsive design** for all screen sizes

## 🔒 Features in Detail

### Real-time Chat
- Streaming responses with progress indicators
- Agent status visualization
- Message history and persistence
- Error handling and recovery

### Document Management
- Drag-and-drop file uploads
- Document preview and metadata
- Search and filtering
- Batch operations

### Agent Orchestration
- Multi-agent workflow visualization
- Real-time execution tracking
- Performance metrics
- Configuration management

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `dist/` folder contains the production build that can be deployed to:
- **Vercel** - Zero-config deployment
- **Netlify** - Drag-and-drop deployment  
- **AWS S3** + CloudFront
- **Any static hosting provider**

### Environment Variables
- `VITE_API_BASE_URL` - Backend API URL
- Additional variables can be added as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions and support:
- Open an issue on GitHub
- Check the API documentation in `api_docs/`
- Review the component documentation
