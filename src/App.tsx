import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/test";
import ScreenTime from "./pages/ScreenTime";
import ScreenTimePage2 from "./pages/Demo";
import ScreentimeDashboard from "./pages/Dashboard";
const App: React.FC = () => {
  // Get today's date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Define a route with the dynamic date */}
          <Route path={`/screentime`} element={<ScreenTime params={{ date: currentDate }} />} />
          <Route path="/settings" element={<ScreenTimePage2 />} />
        </Routes>
      </RootLayout>
    </Router>
  );
};

export default App;
