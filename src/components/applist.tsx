import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Clock } from "lucide-react";

interface AppTimeInfo {
  title: string;
  time: number;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function AppList() {
  const [apps, setApps] = useState<AppTimeInfo[]>([]);

  useEffect(() => {
    invoke<AppTimeInfo[]>('get_app_times').then(setApps);

    const unlisten = listen<AppTimeInfo[]>('screen-time-update', (event) => {
      setApps(event.payload);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-8">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Screen Time Tracker</h1>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        <div className="grid gap-4 p-4">
          {apps
            .sort((a, b) => b.time - a.time)
            .map((app) => (
              <Card key={app.title}>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="truncate">{app.title}</span>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(app.time)}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}