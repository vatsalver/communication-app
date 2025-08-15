import React from "react";
import { AppProvider } from "./context/AppProvider";
import Header from "./components/Header";
import Register from "./components/Register";
import GroupControls from "./components/GroupControls";
import ChatControls from "./components/ChatControls";
import VideoControls from "./components/VideoControls";
import VideoBox from "./components/VideoBox";
import ChatBox from "./components/ChatBox";
import { useApp } from "./context/useAppContext";

function AppContent() {
  const { connected } = useApp();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Header />

        {!connected ? (
          <Register />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GroupControls />
              <VideoControls />
            </div>

            <ChatControls />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VideoBox />
              <ChatBox />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
