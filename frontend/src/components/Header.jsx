import React from "react";
import { useApp } from "../context/useAppContext";
import { Sun, Moon, Wifi, WifiOff } from "lucide-react";

export default function Header() {
  const { darkMode, setDarkMode, connected, username } = useApp();

  return (
    <header className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Communication Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Real-time messaging and video calls
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {username && (
            <div className="flex items-center space-x-2">
              {connected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {username}
              </span>
            </div>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
