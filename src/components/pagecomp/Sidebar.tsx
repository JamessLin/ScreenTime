"use client"

import { Home, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { ModeToggle } from "./mode-toggle"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation()

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "App Usage", path: "/apps" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-screen bg-card border-r border-border transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && <h1 className="text-xl font-bold">ScreenTime</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={`w-full justify-start ${collapsed ? "px-2" : "px-4"}`}
                >
                  <item.icon className={`h-5 w-5 ${!collapsed && "mr-2"}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <ModeToggle />
      </div>
    </div>
  )
}

