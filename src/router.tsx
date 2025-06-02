import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

// Lazy load all pages
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const CrawlerPage = lazy(() => import('./pages/CrawlerPage'));
const AgentsPage = lazy(() => import('./pages/AgentsPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
  </div>
);

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DocumentsPage />
          </Suspense>
        ),
      },
      {
        path: 'documents',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DocumentsPage />
          </Suspense>
        ),
      },
      {
        path: 'crawler',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CrawlerPage />
          </Suspense>
        ),
      },
      {
        path: 'agents',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AgentsPage />
          </Suspense>
        ),
      },
      {
        path: 'tools',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ToolsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminPage />
          </Suspense>
        ),
      },
      {
        path: 'chat',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChatPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

// Export page components for testing
export {
  DocumentsPage,
  CrawlerPage,
  AgentsPage,
  ToolsPage,
  AdminPage,
  ChatPage,
}; 