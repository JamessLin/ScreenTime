import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { Card } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"

interface AppUsage {
  name: string
  description: string
  usage_seconds: number
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export default function ScreenTimePage({ params }: { params: { date: string } }) {
  const [apps, setApps] = useState<AppUsage[]>([])
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching tracking data...") // Debug log
        const data = await invoke<AppUsage[]>("get_tracking_data")
        console.log("Received tracking data:", data) // Debug log
        
        // Filter out apps with 0 seconds of usage
        const activeApps = data.filter(app => app.usage_seconds > 0)
        
        // Sort by usage time descending
        const sortedData = activeApps.sort((a, b) => b.usage_seconds - a.usage_seconds)
        console.log("Sorted and filtered data:", sortedData) // Debug log
        
        setApps(sortedData)
        setError(null)
      } catch (error) {
        console.error("Error fetching tracking data:", error)
        setError("Failed to fetch tracking data")
      }
    }

    fetchData()
    // Update every 30 seconds instead of every minute for more responsive updates
    const interval = setInterval(fetchData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const date = new Date(params.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
                  key={app.name}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    </div>
                  </div>
                  <div className="font-mono font-medium">
                    {formatDuration(app.usage_seconds)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  )
}