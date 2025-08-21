import React from "react";
import { useApp } from "../context/useAppContext";
import { Send, MessageSquare, Mail, Users } from "lucide-react";

export default function ChatControls() {
  const {
    broadcastMsg,
    setBroadcastMsg,
    sendBroadcast,
    dmUser,
    setDMUser,
    dmMessage,
    setDMMessage,
    sendDM,
    joinedGroup,
    groupMsg,
    setGroupMsg,
    sendGroupMsg,
  } = useApp();

  const handleBroadcast = (e) => {
    e.preventDefault();
    sendBroadcast();
  };

  const handleDM = (e) => {
    e.preventDefault();
    sendDM();
  };

  const handleGroup = (e) => {
    e.preventDefault();
    sendGroupMsg();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Broadcast */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Broadcast
          </h3>
        </div>
        <form onSubmit={handleBroadcast} className="space-y-3">
          <textarea
            placeholder="Share something with everyone..."
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            className="input-modern w-full resize-none dark:text-white"
            rows={3}
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
          >
            <Send className="w-4 h-4 mr-2" />
            Broadcast
          </button>
        </form>
      </div>

      {/* Direct Message */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Direct Message
          </h3>
        </div>
        <form onSubmit={handleDM} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={dmUser}
            onChange={(e) => setDMUser(e.target.value)}
            className="input-modern w-full dark:text-white"
          />
          <textarea
            placeholder="Private message..."
            value={dmMessage}
            onChange={(e) => setDMMessage(e.target.value)}
            className="input-modern w-full resize-none dark:text-white"
            rows={2}
          />
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
          >
            <Send className="w-4 h-4 mr-2" />
            Send DM
          </button>
        </form>
      </div>

      {/* Group Message */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Group Chat
          </h3>
        </div>
        {joinedGroup ? (
          <form onSubmit={handleGroup} className="space-y-3">
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
              📍 {joinedGroup}
            </div>
            <textarea
              placeholder={`Message to ${joinedGroup}...`}
              value={groupMsg}
              onChange={(e) => setGroupMsg(e.target.value)}
              className="input-modern w-full resize-none dark:text-white"
              rows={2}
            />
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              Send to Group
            </button>
          </form>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Join a group to start messaging
          </p>
        )}
      </div>
    </div>
  );
}
