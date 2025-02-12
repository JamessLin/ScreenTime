"use client"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const apps = [
  {
    name: "Chrome",
    usage: "2h 45m",
    icon: "/chrome-icon.png",
    change: "+12%",
  },
  {
    name: "VS Code",
    usage: "1h 30m",
    icon: "/vscode-icon.png",
    change: "-5%",
  },
  {
    name: "Slack",
    usage: "1h 15m",
    icon: "/slack-icon.png",
    change: "+3%",
  },
  {
    name: "Spotify",
    usage: "45m",
    icon: "/spotify-icon.png",
    change: "0%",
  },
  {
    name: "Terminal",
    usage: "30m",
    icon: "/terminal-icon.png",
    change: "+2%",
  },
]

export function AppUsage() {
  return (
    <div className="space-y-8">
      {apps.map((app) => (
        <div key={app.name} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={app.icon} alt={app.name} />
            <AvatarFallback>{app.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{app.name}</p>
            <p className="text-sm text-muted-foreground">{app.usage}</p>
          </div>
          <div
            className={`ml-auto font-medium ${app.change.startsWith("+") ? "text-green-500" : app.change.startsWith("-") ? "text-red-500" : "text-gray-500"}`}
          >
            {app.change}
          </div>
        </div>
      ))}
    </div>
  )
}

