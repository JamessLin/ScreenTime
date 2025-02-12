import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";

export const WindowControls: React.FC = () => {
  return (
    <div 
      className=" border-b border-gray-200 dark:border-gray-800 w-full h-10 absolute top-0 left-0 select-none flex items-center justify-between px-4"
      data-tauri-drag-region
    >
      <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
        Screen Time
      </h2>
      <div className="flex gap-2">
   
        <button 
          className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          onClick={() => appWindow.minimize()}
        >
          <Minus size={16} className="text-gray-700 dark:text-gray-300" />
        </button>

        <button 
          className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          onClick={() => appWindow.toggleMaximize()}
        >
          <Square size={16} className="text-gray-700 dark:text-gray-300" />
        </button>

        <button 
          className="p-1 rounded hover:bg-red-500 dark:hover:bg-red-600 transition"
          onClick={() => appWindow.close()}
        >
          <X size={16} className="text-gray-700 dark:text-gray-300 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};
