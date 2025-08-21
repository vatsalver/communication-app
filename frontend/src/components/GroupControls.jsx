import React from "react";
import { useApp } from "../context/useAppContext";
import { Plus, UserPlus } from "lucide-react";

export default function GroupControls() {
  const { group, setGroup, createGroup, joinGroup, joinedGroup } = useApp();

  const handleCreate = (e) => {
    e.preventDefault();
    createGroup();
  };

  const handleJoin = (e) => {
    e.preventDefault();
    joinGroup();
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Group Management
      </h3>

      {joinedGroup && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200 font-medium">
            🎉 You're in group: <span className="font-bold">{joinedGroup}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-4">
        <input
          type="text"
          placeholder="Enter group name"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="input-modern w-full dark:text-white"
        />
        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create
          </button>
          <button
            type="button"
            onClick={handleJoin}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Join
          </button>
        </div>
      </form>
    </div>
  );
}
