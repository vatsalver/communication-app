import { useRef, useState } from "react";

export default function useWebRTC(username, wsSend) {
  const pcRef = useRef({});
  const [participants, setParticipants] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const localStreamRef = useRef();

  async function setupLocalStream(ref) {
    if (!localStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (ref && ref.current) ref.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    }
    return localStreamRef.current;
  }

  async function createPeer(peerId, isAnswerer, groupName, localVideoRef) {
    if (pcRef.current[peerId]) return pcRef.current[peerId];
    setParticipants((p) => (p.includes(peerId) ? p : [...p, peerId]));

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current[peerId] = pc;

    const localStream = await setupLocalStream(localVideoRef);
    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        wsSend({
          type: "ice_candidate",
          from: username,
          to: peerId,
          group: groupName,
          candidate: JSON.stringify(e.candidate),
        });
      }
    };

    pc.ontrack = (e) => {
      setRemoteStreams((rs) => ({ ...rs, [peerId]: e.streams[0] }));
    };

    if (!isAnswerer) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        wsSend({
          type: "video_offer",
          from: username,
          to: peerId,
          group: groupName,
          sdp: offer.sdp,
        });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    }
    return pc;
  }

  async function handleSignaling(msg, localVideoRef) {
    if (!msg.from || msg.from === username) return;
    let pc = pcRef.current[msg.from];

    try {
      if (msg.type === "video_offer") {
        if (!pc)
          pc = await createPeer(msg.from, true, msg.group, localVideoRef);
        await pc.setRemoteDescription({ type: "offer", sdp: msg.sdp });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        wsSend({
          type: "video_answer",
          from: username,
          to: msg.from,
          group: msg.group,
          sdp: answer.sdp,
        });
      } else if (msg.type === "video_answer" && pc) {
        await pc.setRemoteDescription({ type: "answer", sdp: msg.sdp });
      } else if (msg.type === "ice_candidate" && pc) {
        await pc.addIceCandidate(JSON.parse(msg.candidate));
      }
    } catch (error) {
      console.error("Error handling signaling:", error);
    }
  }

  return {
    participants,
    remoteStreams,
    setupLocalStream,
    createPeer,
    handleSignaling,
    localStreamRef,
  };
}
