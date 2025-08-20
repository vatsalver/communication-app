import React from "react";
import { useApp } from "../context/useAppContext";
import { Video, Users, Phone, PhoneOff } from "lucide-react";

export default function VideoControls() {
  const {
    callTarget,
    setCallTarget,
    initiateCall,
    inCall,
    endCall,
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

      <form onSubmit={handleCall} className="space-y-4">
        <input
          type="text"
          placeholder="Username to call"
          value={callTarget}
          onChange={(e) => setCallTarget(e.target.value)}
          className="input-modern w-full"
        />
        <button
          type="submit"
          disabled={inCall}
          className="btn-primary w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-60"
        >
          <Phone className="w-4 h-4 mr-2" />
          Start 1:1 Video Call
        </button>
      </form>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        {joinedGroup ? (
          <>
            <button
              onClick={startGroupCall}
              disabled={inCall}
              className="btn-primary w-full mb-2 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium disabled:opacity-60"
            >
              <Users className="w-4 h-4 mr-2" />
              Group Video Call ({joinedGroup})
            </button>
            {inCall && (
              <button
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 w-full flex items-center justify-center"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-3">
            Join a group to start group calls
          </p>
        )}
      </div>
    </div>
  );
}
