"use client"

import { Minus, Square, X } from "lucide-react"

export function WindowControls() {
  return (
    <div className="flex items-center justify-end h-10 px-4 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
      <div className="flex items-center space-x-2">
        <button className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
          <Minus className="h-4 w-4" />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
          <Square className="h-4 w-4" />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

 