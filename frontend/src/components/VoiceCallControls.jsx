import React from "react";
import { useApp } from "../context/useAppContext";
import { Phone, PhoneOff } from "lucide-react";

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
        <h3 className="text-xl font-bold">Voice Call</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username to call"
          value={voiceTarget}
          onChange={(e) => setVoiceTarget(e.target.value)}
          className="input-modern w-full"
        />
        <button type="submit" disabled={inCall} className="btn-primary w-full">
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
