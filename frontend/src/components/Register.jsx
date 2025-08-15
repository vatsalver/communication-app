import React from "react";
import { useApp } from "../context/useAppContext";
import { LogIn } from "lucide-react";

export default function Register() {
  const { connected, connect, username, setUsername } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username.trim());
    }
  };

  if (connected) return null;

  return (
    <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Join the Conversation
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your username to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-modern w-full text-center"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!username.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Connect
        </button>
      </form>
    </div>
  );
}
