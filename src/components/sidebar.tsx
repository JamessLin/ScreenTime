import React from 'react';
import { BarChart3, Clock, Layout, Settings, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useLocation } from 'react-router-dom';

export function Sidebar() {
  const [theme, setTheme] = React.useState('light');
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const cn = (...classes: (string | boolean)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className="sticky top-0 h-screen w-60">
      {/* Glassmorphism background */}
      <div className="fixed w-60 h-screen bg-white/40 dark:bg-gray-950/40 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800" />

      {/* Content */}
      <div className="relative flex flex-col h-screen">
        {/* App title area */}
        {/* <div className="p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Screen Time
          </h2>
        </div> */}

        {/* Navigation */}
        <div className="flex-1 px-3 py-2">
          <nav className="space-y-2">
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-medium transition-all hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
                location.pathname === "/" && "bg-gray-200/50 dark:bg-gray-800/50 text-blue-600 dark:text-blue-400",
              )}
            >
              <Link to="/">
                <BarChart3 className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-medium transition-all hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
                location.pathname.includes("/screentime") &&
                  "bg-gray-200/50 dark:bg-gray-800/50 text-purple-600 dark:text-purple-400",
              )}
            >
              <Link to="/screentime">
                <Clock className="mr-3 h-5 w-5" />
                Screen Time
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-medium transition-all hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
                location.pathname === "/apps" && "bg-gray-200/50 dark:bg-gray-800/50 text-green-600 dark:text-green-400",
              )}
            >
              <Link to="/apps">
                <Layout className="mr-3 h-5 w-5" />
                Applications
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-medium transition-all hover:bg-gray-200/50 dark:hover:bg-gray-800/50",
                location.pathname === "/settings" && "bg-gray-200/50 dark:bg-gray-800/50 text-orange-600 dark:text-orange-400",
              )}
            >
              <Link to="/settings">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </Button>
          </nav>
        </div>

        {/* Theme toggle and window controls */}
        <div className="p-4 mb-10 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start font-medium hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
            onClick={toggleTheme}
          >
            <Sun className="mr-3 h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-3">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
