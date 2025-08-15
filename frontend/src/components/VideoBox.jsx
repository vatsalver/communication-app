import React from "react";
import { useApp } from "../context/useAppContext";
import VideoTile from "./VideoTile";
import { Video } from "lucide-react";

export default function VideoBox() {
  const { localStreamRef, username, participants, remoteStreams } = useApp();

  const hasVideo = localStreamRef.current || participants.length > 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Video className="w-6 h-6 text-red-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Video Streams
        </h3>
        <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
          {participants.length + (localStreamRef.current ? 1 : 0)}
        </span>
      </div>

      <div className="min-h-[200px]">
        {hasVideo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localStreamRef.current && (
              <VideoTile
                stream={localStreamRef.current}
                label={`${username} (You)`}
                muted={true}
              />
            )}
            {participants.map((peerId) => (
              <VideoTile
                key={peerId}
                stream={remoteStreams[peerId]}
                label={peerId}
                muted={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <p>No active video streams</p>
          </div>
        )}
      </div>
    </div>
  );
}
