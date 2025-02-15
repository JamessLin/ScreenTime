"use client"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Card } from "../../components/ui/card"

interface Application {
  id: string
  name: string
  time: string
  change: number
  icon: string
}

export default function ScreenTimeList() {
  const applications: Application[] = [
    {
      id: "chrome",
      name: "Chrome",
      time: "2h 45m",
      change: 12,
      icon: "C",
    },
    {
      id: "vscode",
      name: "VS Code",
      time: "1h 30m",
      change: -5,
      icon: "V",
    },
    {
      id: "slack",
      name: "Slack",
      time: "1h 15m",
      change: 3,
      icon: "S",
    },
    {
      id: "spotify",
      name: "Spotify",
      time: "45m",
      change: 0,
      icon: "S",
    },
    {
      id: "terminal",
      name: "Terminal",
      time: "30m",
      change: 2,
      icon: "T",
    },
  ]

  return (
    <div className="w-full max-w-md p-4">
      <Card className="bg-[#0B0F17] border-[#1D2230] p-6">
        <h2 className="text-white text-lg font-semibold mb-4">Top Applications</h2>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1D2230] flex items-center justify-center text-white">
                  {app.icon}
                </div>
                <div>
                  <p className="text-white font-medium">{app.name}</p>
                  <p className="text-sm text-gray-400">{app.time}</p>
                </div>
              </div>
              <div
                className={`flex items-center ${
                  app.change > 0 ? "text-green-500" : app.change < 0 ? "text-red-500" : "text-gray-400"
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
          ))}
        </div>
      </Card>
    </div>
  )
}

