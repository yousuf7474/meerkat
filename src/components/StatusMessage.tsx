import React from 'react';
import { Progress } from './ui/progress';
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface StatusMessageProps {
  status: 'processing' | 'completed' | 'failed';
  step?: string;
  message: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'processing':
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getStepDisplayName = (step: string) => {
  const stepNames: Record<string, string> = {
    // Chat steps (from API docs)
    initializing: 'Initializing',
    retrieving_context: 'Retrieving Context',
    selecting_model: 'Selecting Model',
    generating_response: 'Generating Response',
    storing_response: 'Storing Response',
    finished: 'Complete',
    
    // Document upload steps (from API docs)
    validating: 'Validating File',
    extracting_text: 'Extracting Text',
    chunking_text: 'Processing Content',
    creating_embeddings: 'Creating Embeddings',
    storing_metadata: 'Finalizing',
    
    // Web crawling steps (from API docs) - same as document processing
    crawling: 'Crawling Pages',
    processing_content: 'Processing Content',
  };
  
  return stepNames[step] || step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const StatusMessage: React.FC<StatusMessageProps> = ({
  status,
  step,
  message,
  progress,
  showProgress = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-2 rounded-lg border bg-card p-3 text-card-foreground ${className}`}>
      <div className="flex items-center space-x-3">
        {getStatusIcon(status)}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {step ? getStepDisplayName(step) : 'Processing'}
            </span>
            {typeof progress === 'number' && (
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{message}</p>
        </div>
      </div>
      
      {showProgress && typeof progress === 'number' && (
        <Progress value={progress} className="h-2" />
      )}
    </div>
  );
};

export default StatusMessage; 