"use client"

import React, { useState, useEffect } from "react"
import { BarChart3, Clock, Layout, Settings, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"

export function Sidebar({ onCollapse }: { onCollapse?: (collapsed: boolean) => void }) {
  const [theme, setTheme] = React.useState("light")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  useEffect(() => {
    if (onCollapse) {
      onCollapse(isCollapsed)
    }
  }, [isCollapsed, onCollapse])

  const cn = (...classes: (string | boolean)[]) => {
    return classes.filter(Boolean).join(" ")
  }

  const navItems = [
    { icon: BarChart3, label: "Dashboard", path: "/", color: "text-blue-600 dark:text-blue-400" },
    { icon: Clock, label: "Screen Time", path: "/screentime", color: "text-purple-600 dark:text-purple-400" },
    { icon: Layout, label: "Applications", path: "/apps", color: "text-green-600 dark:text-green-400" },
    { icon: Settings, label: "Settings", path: "/settings", color: "text-orange-600 dark:text-orange-400" },
  ]

  return (
    <div className={cn("sticky top-0 h-screen transition-all duration-300 ease-in-out", isCollapsed ? "w-16" : "w-64")}>
      {/* Glassmorphism background */}
      <div
        className={cn(
          "fixed h-screen bg-white/40 dark:bg-gray-950/40 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
        )}
      />

      {/* Content */}
      <div className="relative flex flex-col h-screen py-4">
        {/* Navigation */}
        <div className="flex-1 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm font-medium transition-all hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
                  location.pathname === item.path && "bg-gray-200/50 dark:bg-gray-800/50",
                  location.pathname === item.path && item.color,
                  isCollapsed ? "px-0" : "px-3",
                  "h-10", // Adjusted height
                )}
              >
                <Link to={item.path} className="flex items-center w-full">
                  <item.icon
                    className={cn("flex-shrink-0 transition-all", isCollapsed ? "h-5 w-5 mx-auto" : "h-5 w-5 mr-3")}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Theme toggle and collapse button */}
        <div className="px-3 mt-6 space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-sm font-medium hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
              isCollapsed ? "px-0 justify-center" : "px-3 justify-start",
              "h-10", // Adjusted height
            )}
            onClick={toggleTheme}
          >
            <Sun
              className={cn(
                "h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
                isCollapsed ? "" : "mr-3",
              )}
            />
            <Moon
              className={cn(
                "absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
                isCollapsed ? "" : "mr-3",
              )}
            />
            {!isCollapsed && <span className="truncate">Toggle theme</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full text-sm font-medium hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
              isCollapsed ? "px-0 justify-center" : "px-3 justify-start",
              "h-10", // Adjusted height
            )}
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-3" />
                <span className="truncate">Collapse sidebar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

