import React from "react";
import { Sidebar } from "./sidebar";
import { ThemeProvider } from "./theme-provider";
import { WindowControls } from "./windows-controls";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen w-full overflow-hidden select-none font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* <div className="fixed top-0 left-0 w-full h-10 flex items-center px-4 bg-background text-white z-50" data-tauri-drag-region >
          <WindowControls />
        </div> */}

        <div className="fixed left-0 h-[calc(100%-40px)] w-64 z-40">
          <Sidebar />
        </div>
        <main className="ml-64 h-[calc(100%px)] overflow-auto">
          {children}
        </main>


        <div className="absolute inset-0 -z-10" data-tauri-drag-region />
      </div>
    </ThemeProvider>
  );
};

export default RootLayout;
