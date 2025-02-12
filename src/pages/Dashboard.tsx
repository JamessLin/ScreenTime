import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { BarChart2, Clock, Monitor, Smartphone, Laptop } from 'lucide-react';

interface TrackingData {
  app_name: string;
  duration: number;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const ScreentimeDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [appUsageData, setAppUsageData] = useState<TrackingData[]>([]);
  const [totalScreenTime, setTotalScreenTime] = useState(0);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const data: TrackingData[] = await invoke('get_tracking_data');
        
      
        const sortedData = data.sort((a, b) => b.duration - a.duration);
        
        const total = sortedData.reduce((sum, app) => sum + app.duration, 0);
        
        setAppUsageData(sortedData);
        setTotalScreenTime(total);
      } catch (error) {
        console.error('Failed to fetch tracking data:', error);
      }
    };


    fetchTrackingData();
    const interval = setInterval(fetchTrackingData, 60000);

    return () => clearInterval(interval);
  }, []);

  const periodOptions = ['today', 'week', 'month'];

  const getAppIcon = (appName: string) => {
    const lowercaseName = appName.toLowerCase();
    if (lowercaseName.includes('chrome') || lowercaseName.includes('browser')) return <Monitor />;
    if (lowercaseName.includes('code') || lowercaseName.includes('ide')) return <Laptop />;
    if (lowercaseName.includes('slack') || lowercaseName.includes('communication')) return <Smartphone />;
    return <Monitor />;
  };

  return (
    <div className="flex h-screen bg-neutral-100 text-neutral-900">
      <div className="w-72 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Screentime Tracker</h1>
        </div>
        <div className="p-4">
          <div className="flex justify-between mb-4">
            {periodOptions.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm uppercase tracking-wider 
                  ${selectedPeriod === period 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-500 hover:bg-neutral-100'}`}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Clock className="text-neutral-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">{formatTime(totalScreenTime)}</p>
                <p className="text-xs text-neutral-500">Total Screen Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4">
        <div className="bg-white border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">App Usage</h2>
            <BarChart2 className="text-neutral-500" />
          </div>
          <div>
            {appUsageData.map((app, index) => {
              const totalTime = totalScreenTime || 1;
              const percentage = Math.round((app.duration / totalTime) * 100);

              return (
                <div 
                  key={app.app_name} 
                  className={`flex items-center p-3 ${index < appUsageData.length - 1 ? 'border-b' : ''}`}
                >
                  {getAppIcon(app.app_name)}
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between mb-1">
                      <span>{app.app_name}</span>
                      <span>{formatTime(app.duration)}</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1">
                      <div 
                        className="bg-neutral-900 h-1" 
                        style={{width: `${percentage}%`}}
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