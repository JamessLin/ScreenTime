"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ThemeProvider } from "./theme-provider"

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div
        className="h-screen w-full overflow-hidden select-none font-sans"
        style={{ fontFamily: "Inter, sans-serif" }}
      >

        {/* Main content area */}
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="flex-shrink-0 h-full">
            <Sidebar onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)} />
          </div>

          {/* Main content */}
          <main
            className={`flex-grow h-full overflow-auto transition-all duration-300 ease-in-out}`}
          >
            {children}
          </main>
        </div>

      </div>
    </ThemeProvider>
  )
}

export default RootLayout

