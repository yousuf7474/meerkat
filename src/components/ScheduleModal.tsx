import React, { useState } from 'react';
import { X, Clock, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  url: string;
  onScheduled?: () => void;
}

type ScheduleType = 'daily' | 'weekly' | 'monthly' | 'interval';

interface ScheduleConfig {
  hour: number;
  minute: number;
  day_of_week?: string;
  schedule_option?: string;
  interval_type?: string;
  interval_value?: number;
  day?: number;
}

interface ScheduleCrawlRequest {
  document_id: string;
  schedule_type: ScheduleType;
  schedule_config: ScheduleConfig;
}

export default function ScheduleModal({ isOpen, onClose, documentId, url, onScheduled }: ScheduleModalProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');
  const [config, setConfig] = useState<ScheduleConfig>({
    hour: 9,
    minute: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const request: ScheduleCrawlRequest = {
        document_id: documentId,
        schedule_type: scheduleType,
        schedule_config: config,
      };

      // TODO: Implement scheduling API in v2
      console.log('Schedule request:', request);
      setError('Scheduling feature is not yet implemented in v2 API');
      
      // For now, just close the modal after a delay
      setTimeout(() => {
        setLoading(false);
        onScheduled?.();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule crawl job');
      setLoading(false);
    }
  };

  const updateConfig = (updates: Partial<ScheduleConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule Recrawling
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Website:</p>
            <p className="font-medium truncate">{url}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Schedule Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
              <select 
                value={scheduleType} 
                onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="interval">Custom Interval</option>
              </select>
            </div>

            {/* Time Settings for Daily/Weekly/Monthly */}
            {(scheduleType === 'daily' || scheduleType === 'weekly' || scheduleType === 'monthly') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Hour (0-23)</label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={config.hour}
                    onChange={(e) => updateConfig({ hour: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Minute (0-59)</label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={config.minute}
                    onChange={(e) => updateConfig({ minute: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}

            {/* Weekly Options */}
            {scheduleType === 'weekly' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Day of Week</label>
                <select 
                  value={config.day_of_week || 'monday'} 
                  onChange={(e) => updateConfig({ day_of_week: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
            )}

            {/* Monthly Options */}
            {scheduleType === 'monthly' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Monthly Schedule</label>
                <select 
                  value={config.schedule_option || 'first_day'} 
                  onChange={(e) => updateConfig({ schedule_option: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="first_day">1st of Month</option>
                  <option value="fifteenth">15th of Month</option>
                  <option value="last_day">Last Day of Month</option>
                  <option value="custom">Custom Day</option>
                </select>

                {config.schedule_option === 'custom' && (
                  <div className="space-y-2 mt-2">
                    <label className="block text-sm font-medium text-gray-700">Day of Month (1-28)</label>
                    <Input
                      type="number"
                      min="1"
                      max="28"
                      value={config.day || 1}
                      onChange={(e) => updateConfig({ day: parseInt(e.target.value) || 1 })}
                      placeholder="1-28"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Interval Options */}
            {scheduleType === 'interval' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Interval Type</label>
                  <select 
                    value={config.interval_type || 'hours'} 
                    onChange={(e) => updateConfig({ interval_type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Interval Value</label>
                  <Input
                    type="number"
                    min="1"
                    value={config.interval_value || 24}
                    onChange={(e) => updateConfig({ interval_value: parseInt(e.target.value) || 1 })}
                    placeholder="e.g., 24 for every 24 hours"
                  />
                </div>

                <div className="text-sm text-gray-600">
                  {config.interval_type === 'minutes' && `Every ${config.interval_value || 1} minute(s)`}
                  {config.interval_type === 'hours' && `Every ${config.interval_value || 1} hour(s)`}
                  {config.interval_type === 'days' && `Every ${config.interval_value || 1} day(s)`}
                </div>
              </div>
            )}

            {/* Schedule Summary */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Schedule Summary</span>
              </div>
              <p className="text-sm text-blue-800">
                {scheduleType === 'daily' && `Daily at ${config.hour.toString().padStart(2, '0')}:${config.minute.toString().padStart(2, '0')}`}
                {scheduleType === 'weekly' && `Every ${config.day_of_week} at ${config.hour.toString().padStart(2, '0')}:${config.minute.toString().padStart(2, '0')}`}
                {scheduleType === 'monthly' && `Monthly on ${
                  config.schedule_option === 'first_day' ? '1st' :
                  config.schedule_option === 'fifteenth' ? '15th' :
                  config.schedule_option === 'last_day' ? 'last day' :
                  `${config.day}${getOrdinalSuffix(config.day || 1)}`
                } at ${config.hour.toString().padStart(2, '0')}:${config.minute.toString().padStart(2, '0')}`}
                {scheduleType === 'interval' && `Every ${config.interval_value} ${config.interval_type}`}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 animate-spin" />
                    Scheduling...
                  </div>
                ) : (
                  'Schedule Job'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
} 