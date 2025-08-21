import React from "react";
import { useApp } from "../context/useAppContext";
import { Phone, PhoneOff, PhoneOutgoing } from "lucide-react";

export default function VoiceCallControls() {
  const { voiceTarget, setVoiceTarget, initiateVoiceCall, inCall, endCall } =
    useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    initiateVoiceCall();
  };

  return (
    <div className="glass-card rounded-2xl p-6 mt-6 max-w-full mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <Phone className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold dark:text-white">Voice Call</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username to call"
          value={voiceTarget}
          onChange={(e) => setVoiceTarget(e.target.value)}
          className="input-modern w-full dark:text-white"
        />

        <button
          type="submit"
          disabled={inCall}
          className="btn-primary w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
        >
          <PhoneOutgoing className="w-4 h-4 mr-2" />
          Call
        </button>
      </form>

      {inCall && (
        <button
          onClick={endCall}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl mt-4 flex items-center justify-center w-full"
        >
          <PhoneOff className="w-5 h-5 mr-2" />
          End Call
        </button>
      )}
    </div>
  );
}
