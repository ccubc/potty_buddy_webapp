import { useState, useEffect } from 'react';
import { apiClient, Statistics } from '../lib/api';

interface StatisticsProps {
  userId: number;
}

export default function Statistics({ userId }: StatisticsProps) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistics();
  }, [userId]);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.getStatistics(userId);
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const getLast14Days = () => {
    const dates = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getEventCountForDate = (date: string, eventType: 'dirty_pants' | 'potty') => {
    if (!statistics) return 0;
    const event = statistics.dailyEvents.find(
      e => e.date === date && e.event_type === eventType
    );
    return event ? parseInt(event.count) : 0;
  };

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Statistics (Last 14 Days)</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Statistics (Last 14 Days)</h3>
        <div className="text-red-600">{error}</div>
        <button
          onClick={loadStatistics}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  const dates = getLast14Days();
  const totals = statistics?.totals || {};

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Statistics (Last 14 Days)</h3>
      
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-success-50 rounded-lg">
          <div className="text-2xl font-bold text-success-600">
            {totals.potty || 0}
          </div>
          <div className="text-sm text-success-700">Potty Successes</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {totals.dirty_pants || 0}
          </div>
          <div className="text-sm text-red-700">Accidents</div>
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Daily Breakdown:</h4>
        {dates.map((date) => {
          const pottyCount = getEventCountForDate(date, 'potty');
          const accidentCount = getEventCountForDate(date, 'dirty_pants');
          const total = pottyCount + accidentCount;
          
          if (total === 0) return null;

          return (
            <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                {new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center space-x-4">
                {pottyCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <span>🚽</span>
                    <span className="text-success-600 font-semibold">{pottyCount}</span>
                  </div>
                )}
                {accidentCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <span>👖</span>
                    <span className="text-red-600 font-semibold">{accidentCount}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {dates.every(date => {
          const pottyCount = getEventCountForDate(date, 'potty');
          const accidentCount = getEventCountForDate(date, 'dirty_pants');
          return pottyCount + accidentCount === 0;
        }) && (
          <div className="text-center text-gray-500 py-4">
            No events recorded in the last 14 days
          </div>
        )}
      </div>
    </div>
  );
} 