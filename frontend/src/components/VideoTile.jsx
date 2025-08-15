import React, { useEffect, useRef } from "react";
import { User } from "lucide-react";

export default function VideoTile({ stream, label, muted }) {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative glass-card rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="w-full h-32 object-cover"
      />

      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <User className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <span className="text-white text-xs font-medium truncate block">
          {label}
        </span>
      </div>

      {muted && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-1 py-0.5 rounded text-xs">
          MUTED
        </div>
      )}
    </div>
  );
}
