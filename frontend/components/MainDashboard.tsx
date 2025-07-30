import { useState } from 'react';
import EventButton from './EventButton';
import Statistics from './Statistics';

interface MainDashboardProps {
  userId: number;
  username: string;
  onLogout: () => void;
}

export default function MainDashboard({ userId, username, onLogout }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tracking' | 'statistics'>('tracking');
  const [refreshStats, setRefreshStats] = useState(0);

  const handleEventLogged = () => {
    // Trigger statistics refresh
    setRefreshStats(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 right-4 md:right-8">
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            aria-label="Logout"
          >
            👋 Logout
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <img 
            src="/peppa_potty_logo.png" 
            alt="Potty Buddy Logo" 
            className="w-48 h-48 md:w-60 md:h-60 object-contain transition-transform hover:scale-105"
            loading="eager"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Potty Buddy</h2>
        <p className="text-gray-600">Welcome back, {username}!</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'tracking'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📝 Tracking
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'statistics'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 Statistics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'tracking' ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Click a button to log an event:
              </h3>
              <p className="text-gray-500">
                Track your child's potty training progress
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventButton
                type="potty"
                userId={userId}
                onEventLogged={handleEventLogged}
              />
              <EventButton
                type="dirty_pants"
                userId={userId}
                onEventLogged={handleEventLogged}
              />
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                💡 Tip: Click the Statistics tab to view your progress over time
              </p>
            </div>
          </div>
        ) : (
          <Statistics key={refreshStats} userId={userId} />
        )}
      </div>
    </div>
  );
} 