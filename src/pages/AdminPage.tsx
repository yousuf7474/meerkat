import { Settings, Database, Cloud, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground">
          Monitor system status and manage configuration
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Online</div>
            <Badge variant="default" className="mt-2">Healthy</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Connected</div>
            <Badge variant="default" className="mt-2">SQLite + DynamoDB</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vector Store</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <Badge variant="default" className="mt-2">OpenSearch</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Models</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <Badge variant="default" className="mt-2">Bedrock</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
            <CardDescription>
              Current system environment and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">API Base URL:</span>
                <span className="text-sm text-muted-foreground">http://localhost:8000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">WebSocket URL:</span>
                <span className="text-sm text-muted-foreground">ws://localhost:8000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Environment:</span>
                <Badge variant="outline">Development</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version:</span>
                <span className="text-sm text-muted-foreground">v2.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
            <CardDescription>
              Resource usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Max Concurrent Agents:</span>
                <span className="text-sm text-muted-foreground">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Token Limit:</span>
                <span className="text-sm text-muted-foreground">10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Max File Size:</span>
                <span className="text-sm text-muted-foreground">50MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Crawl Depth Limit:</span>
                <span className="text-sm text-muted-foreground">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>
            Administrative actions and maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Backup Database
            </Button>
            <Button variant="outline">
              <Cloud className="mr-2 h-4 w-4" />
              Sync Vector Store
            </Button>
            <Button variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              View Logs
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 