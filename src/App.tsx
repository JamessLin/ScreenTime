// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout"; // Import the layout
import Dashboard from "./pages/Dashboard";
import Home from "./pages/test";

const App: React.FC = () => {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* {/* <Route path="/screentime" element={<Home />} /> */}
          <Route path="/settings" element={<Home />} /> 
        </Routes>
      </RootLayout>
    </Router>
  );
};

export default App;
