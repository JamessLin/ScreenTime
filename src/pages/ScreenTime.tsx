"use client"

import { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, SortAsc, SortDesc } from "lucide-react"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { invoke } from "@tauri-apps/api/tauri"

interface AppUsageData {
  id: string
  name: string
  time: string
  time_in_minutes: number
  change: number
  icon: string
  last_used: string
  category: string
}

// Helper function to format the time
function formatTime(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60)
    return `${seconds} second${seconds === 1 ? "" : "s"}`
  } else if (minutes < 60) {
    const roundedMinutes = Math.round(minutes)
    return `${roundedMinutes} min${roundedMinutes === 1 ? "" : "s"}`
  } else {
    const hours = minutes / 60
    const formattedHours = hours % 1 === 0 ? hours.toString() : hours.toFixed(1)
    return `${formattedHours} hours`
  }
}

export default function ScreenTimePage() {
  const [apps, setApps] = useState<AppUsageData[]>([])
  const [sortBy, setSortBy] = useState<"time" | "name">("time")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: AppUsageData[] = await invoke("get_app_usage")
        setApps(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredApps = apps
    .filter(app => categoryFilter === "all" || app.category.toLowerCase() === categoryFilter.toLowerCase())
    .sort((a, b) => {
      if (sortBy === "time") {
        return sortOrder === "desc"
          ? b.time_in_minutes - a.time_in_minutes
          : a.time_in_minutes - b.time_in_minutes
      } else {
        return sortOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      }
    })

  const totalTimeMinutes = apps.reduce((acc, app) => acc + app.time_in_minutes, 0)
  const hours = Math.floor(totalTimeMinutes / 60)
  const minutes = totalTimeMinutes % 60

  if (loading) {
    return <div className="p-6">Loading tracking data...</div>
  }

  return (
    // Outer container fills the entire window height and uses flex column layout.
    <div className="h-screen bg-background text-foreground flex flex-col">
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Browser">Browser</SelectItem>
              <SelectItem value="Productivity">Productivity</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-secondary border-border"
              onClick={() => setSortBy(sortBy === "time" ? "name" : "time")}
            >
              Sort by {sortBy === "time" ? "Name" : "Time"}
            </Button>
            <Button
              variant="outline"
              className="bg-secondary border-border"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            >
              {sortOrder === "desc" ? <SortDesc /> : <SortAsc />}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Applications List */}
      {/* min-h-0 ensures the scrollable container can shrink vertically */}
      <div className="flex-1 overflow-auto p-6 min-h-0 rounded-xl pt-0">
        <Card className="bg-card text-card-foreground">
          <div className="divide-y divide-border">
            {filteredApps.map(app => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-semibold">
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
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">Last used: {app.last_used}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{formatTime(app.time_in_minutes)}</p>
                    <div
                      className={`flex items-center text-sm justify-end ${
                        app.change > 0
                          ? "text-green-500"
                          : app.change < 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {app.change !== 0 && (
                        <>
                          {app.change > 0 ? (
                            <ArrowUpIcon className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownIcon className="w-3 h-3 mr-1" />
                          )}
                        </>
                      )}
                      {app.change === 0 ? "0%" : `${Math.abs(app.change)}%`}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      app.category === "Browser"
                        ? "bg-blue-500/20 text-blue-400"
                        : app.category === "Productivity"
                        ? "bg-purple-500/20 text-purple-400"
                        : app.category === "Music"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {app.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
