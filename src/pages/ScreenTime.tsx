import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";

interface AppUsage {
  id: string;
  name: string;
  time: string; // Formatted "HH:MM" string
  time_in_minutes: number;
  change: number;
  icon: string;
  last_used: string;
  category: string;
}

export default function ScreenTimePage({ params }: { params: { date: string } }) {
  const [apps, setApps] = useState<AppUsage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching app usage data...");
        const data = await invoke<AppUsage[]>("get_app_usage");
        console.log("Received app usage data:", data);

        // Filter out apps with no usage (i.e. 0 minutes)
        const activeApps = data.filter(app => app.time_in_minutes > 0);
        // Sort by usage time descending
        const sortedData = activeApps.sort((a, b) => b.time_in_minutes - a.time_in_minutes);
        console.log("Sorted and filtered data:", sortedData);

        setApps(sortedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching app usage data:", error);
        setError("Failed to fetch app usage data");
      }
    };

    fetchData();
    // Update every 30 seconds for more responsive updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const date = new Date(params.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Screen Time</h1>
        <p className="text-muted-foreground">{date}</p>
      </div>
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : apps.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No activity tracked yet. Keep using your apps and check back in a minute.
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <div className="space-y-4">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      {app.icon ? (
                        <img
                          src={app.icon}
                          alt={app.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        app.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {app.category} — Last used: {app.last_used}
                      </p>
                    </div>
                  </div>
                  <div className="font-mono font-medium">{app.time}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
