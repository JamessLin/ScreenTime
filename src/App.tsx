import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/test";
import ScreenTime from "./pages/ScreenTime";

const App: React.FC = () => {
  // Get today's date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Define a route with the dynamic date */}
          <Route path={`/screentime`} element={<ScreenTime/>} />
          <Route path="/settings" element={<></>} />
        </Routes>
      </RootLayout>
    </Router>
  );
};

export default App;
