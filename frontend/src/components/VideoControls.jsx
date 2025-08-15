import React from "react";
import { useApp } from "../context/useAppContext";
import { Video, Users, Phone } from "lucide-react";

export default function VideoControls() {
  const {
    callTarget,
    setCallTarget,
    initiateCall,
    startGroupCall,
    joinedGroup,
  } = useApp();

  const handleCall = (e) => {
    e.preventDefault();
    initiateCall();
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Video className="w-6 h-6 text-red-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Video Calls
        </h3>
      </div>

      <div className="space-y-4">
        {/* 1:1 Call */}
        <form onSubmit={handleCall}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username to call"
              value={callTarget}
              onChange={(e) => setCallTarget(e.target.value)}
              className="input-modern w-full"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
            >
              <Phone className="w-4 h-4 mr-2" />
              Start 1:1 Call
            </button>
          </div>
        </form>

        {/* Group Call */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          {joinedGroup ? (
            <button
              onClick={startGroupCall}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
            >
              <Users className="w-4 h-4 mr-2" />
              Group Call ({joinedGroup})
            </button>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-3">
              Join a group to start group calls
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
