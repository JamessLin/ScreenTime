import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { BarChart2, Clock, Monitor, Smartphone, Laptop } from 'lucide-react';

interface AppUsage {
  id: string;
  name: string;
  time: string;
  time_in_minutes: number;
  change: number;
  icon: string;
  last_used: string;
  category: string;
}

const formatTotalTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getIconComponent = (icon: string, appName: string) => {
  // Use the provided icon field to decide which icon to show.
  // Fallback to a mapping based on the app name if needed.
  const lowerIcon = icon.toLowerCase();
  if (lowerIcon.includes('chrome') || lowerIcon.includes('firefox')) return <Monitor />;
  if (lowerIcon.includes('vscode') || lowerIcon.includes('code')) return <Laptop />;
  if (lowerIcon.includes('spotify') || lowerIcon.includes('music')) return <Smartphone />;
  // Default fallback:
  return <Monitor />;
};

const ScreentimeDashboard: React.FC = () => {
  const [appUsageData, setAppUsageData] = useState<AppUsage[]>([]);
  const [totalScreenTime, setTotalScreenTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppUsage = async () => {
      try {
        // Call the new Tauri command to get usage data.
        const data: AppUsage[] = await invoke('get_app_usage');
        // Sort descending by active time (in minutes).
        const sortedData = data.sort((a, b) => b.time_in_minutes - a.time_in_minutes);
        const total = sortedData.reduce((sum, app) => sum + app.time_in_minutes, 0);
        setAppUsageData(sortedData);
        setTotalScreenTime(total);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch app usage data:', error);
      }
    };

    fetchAppUsage();
    const interval = setInterval(fetchAppUsage, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-6">Loading tracking data...</div>;
  }

  return (
    <div className="flex h-screen bg-neutral-100 text-neutral-900">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Screentime Tracker</h1>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Clock className="text-neutral-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{formatTotalTime(totalScreenTime)}</p>
                <p className="text-xs text-neutral-500">Total Screen Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="bg-white border rounded">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">App Usage</h2>
            <BarChart2 className="text-neutral-500" />
          </div>
          <div>
            {appUsageData.map((app, index) => {
              const percentage = Math.round((app.time_in_minutes / (totalScreenTime || 1)) * 100);
              return (
                <div
                  key={app.id}
                  className={`flex items-center p-3 ${index < appUsageData.length - 1 ? 'border-b' : ''}`}
                >
                  {getIconComponent(app.icon, app.name)}
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between mb-1">
                      <span>{app.name}</span>
                      <span>{app.time}</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1">
                      <div
                        className="bg-neutral-900 h-1"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScreentimeDashboard;
