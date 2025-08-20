import React, { useEffect, useRef } from "react";

export default function AudioTile({ stream, label }) {
  const audioRef = useRef();

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="p-2 rounded glass-card">
      <audio ref={audioRef} autoPlay playsInline controls />
      <div className="mt-1 text-center text-sm">{label}</div>
    </div>
  );
}
