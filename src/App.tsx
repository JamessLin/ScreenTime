// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import RootLayout from "./components/RootLayout";
// import Home from "./pages/test";
// import ScreenTime from "./pages/ScreenTime";
// import Dashboard from "./pages/test2";
// import Settings from "./pages/settings";

// const App: React.FC = () => {
//   // Get today's date in YYYY-MM-DD format
//   const currentDate = new Date().toISOString().split("T")[0];

//   return (
//     <Router>
//       <RootLayout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           {/* Define a route with the dynamic date */}
//           <Route path={`/screentime`} element={<ScreenTime/>} />
//           <Route path="/settings" element={<Settings/> }/>
//         </Routes>
//       </RootLayout>
//     </Router>
//   );
// };

// export default App;
"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/settings"
import AppUsage from "./pages/AppUsage"
import Sidebar from "./components/pagecomp/Sidebar"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <ThemeProvider defaultTheme="system" storageKey="screentime-theme">
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apps" element={<AppUsage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

