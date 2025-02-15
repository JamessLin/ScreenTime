"use client"

import { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, Clock, SortAsc, SortDesc } from "lucide-react"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { invoke } from "@tauri-apps/api/tauri"

interface Application {
  id: string
  name: string
  time: string
  timeInMinutes: number
  change: number
  icon: string
  lastUsed: string
  category: "work" | "entertainment" | "social"
}

export default function ScreenTimePage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [sortBy, setSortBy] = useState<"time" | "name">("time")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Application[] = await invoke("get_tracking_data")
        setApplications(data)
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

  const filteredApplications = [...applications]
    .filter((app) => categoryFilter === "all" || app.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === "time") {
        return sortOrder === "desc" ? b.timeInMinutes - a.timeInMinutes : a.timeInMinutes - b.timeInMinutes
      } else {
        return sortOrder === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      }
    })

  const totalTime = applications.reduce((acc, app) => acc + app.timeInMinutes, 0)
  const hours = Math.floor(totalTime / 60)
  const minutes = totalTime % 60

  if (loading) {
    return <div className="p-6">Loading tracking data...</div>
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Screen Time</h1>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="text-xl font-semibold">
              {hours}h {minutes}m
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="social">Social</SelectItem>
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
      <div className="flex-1 overflow-auto  rounded-xl pt-0">
        <Card className="bg-card text-card-foreground">
          <div className="divide-y divide-border">
            {filteredApplications.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-semibold">
                    {app.icon}
                  </div>
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">Last used: {app.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{app.time}</p>
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
                      app.category === "work"
                        ? "bg-blue-500/20 text-blue-400"
                        : app.category === "entertainment"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-green-500/20 text-green-400"
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

