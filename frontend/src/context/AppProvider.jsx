import React, { useState, useRef, useEffect } from "react";
import { AppContext } from "./AppContext";
import useWebRTC from "../hooks/useWebRTC";

export function AppProvider({ children }) {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [dmUser, setDMUser] = useState("");
  const [dmMessage, setDMMessage] = useState("");
  const [group, setGroup] = useState("");
  const [joinedGroup, setJoinedGroup] = useState("");
  const [groupMsg, setGroupMsg] = useState("");
  const [callTarget, setCallTarget] = useState("");
  const [voiceTarget, setVoiceTarget] = useState("");
  const [inCall, setInCall] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const wsRef = useRef(null);
  const WS_URL = import.meta.env.VITE_WS_URL;

  const {
    participants,
    setParticipants,
    remoteStreams,
    setRemoteStreams,
    createPeer,
    handleSignaling,
    localStreamRef,
    pcRef,
  } = useWebRTC(username, (msg) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  });

  useEffect(() => {
    if (!inCall) {
      // Clean up on call end
      Object.values(pcRef.current).forEach((pc) => pc && pc.close());
      setParticipants([]);
      setRemoteStreams({});
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      pcRef.current = {};
    }
  }, [inCall]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  function connect(user) {
    setUsername(user);
    wsRef.current = new WebSocket(WS_URL);
    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ type: "register", from: user }));
      setConnected(true);
      if (joinedGroup) {
        wsRef.current.send(
          JSON.stringify({
            type: "join_group",
            from: user,
            group: joinedGroup,
          })
        );
      }
    };
    wsRef.current.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      msgHandler(msg);
    };
    wsRef.current.onclose = () => {
      setConnected(false);
      addMsg(
        "system",
        "❌ Connection lost. Please refresh to reconnect.",
        "error"
      );
    };
    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      addMsg("system", "❌ Connection error occurred.", "error");
    };
  }

  function addMsg(type, content, variant = "default") {
    setMessages((msgs) => [
      ...msgs,
      {
        type,
        content,
        variant,
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }

  function msgHandler(msg) {
    console.log("Received WS message:", msg);
    // Fix: Confirm joined group from backend message (matches Go backend)
    if (
      msg.type === "system" &&
      msg.content.includes("Successfully joined group")
    ) {
      // "✅ Successfully joined group 'groupname'"
      const match = msg.content.match(/Successfully joined group '(.+)'/);
      if (match) {
        setJoinedGroup(match[1]);
        console.log("✅ Joined group confirmed:", match[1]);
      }
    }
    if (msg.type === "system" && msg.content.includes("created successfully")) {
      // "✅ Group 'groupname' created successfully"
      const match = msg.content.match(/Group '(.+)' created successfully/);
      if (match) {
        setJoinedGroup(match[1]);
        console.log("✅ Group created and joined:", match[1]);
      }
    }

    if (msg.type === "system") {
      addMsg(
        "system",
        msg.content,
        msg.content.includes("❌") ? "error" : "success"
      );
    } else if (
      msg.type === "broadcast" ||
      (msg.type === "dm" && msg.to === username) ||
      (msg.type === "group" && msg.group === joinedGroup)
    ) {
      console.log("Adding message to chat:", msg);
      const displayMsg = `[${msg.from}${
        msg.to ? "→" + msg.to : msg.group ? "@" + msg.group : ""
      }] ${msg.content}`;
      addMsg(msg.type, displayMsg);
      console.log("📨 Group message received:", displayMsg);
    }

    if (
      msg.type === "group" &&
      msg.content === "__start_group_call__" &&
      msg.group === joinedGroup &&
      msg.from !== username
    ) {
      createPeer(msg.from, true, joinedGroup);
    }
    if (msg.type === "start_video" && msg.to === username) {
      setInCall(true);
      createPeer(msg.from, true, null);
    }

    if (msg.type === "start_voice" && msg.to === username) {
      setInCall(true);
      createPeer(msg.from, true, null, { audioOnly: true });
    }

    if (["video_offer", "video_answer", "ice_candidate"].includes(msg.type)) {
      handleSignaling(msg, null);
    }
  }

  function sendBroadcast() {
    if (
      broadcastMsg.trim() &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "broadcast",
          from: username,
          content: broadcastMsg.trim(),
        })
      );
      setBroadcastMsg("");
    }
  }

  function sendDM() {
    if (
      dmUser.trim() &&
      dmMessage.trim() &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "dm",
          from: username,
          to: dmUser.trim(),
          content: dmMessage.trim(),
        })
      );
      setDMMessage("");
    }
  }

  function createGroup() {
    const trimmed = group.trim();
    if (
      trimmed &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "create_group",
          from: username,
          group: trimmed,
        })
      );
      // Do NOT setJoinedGroup here; wait for confirmation!
      console.log("🔄 Creating group:", trimmed);
    }
  }

  function joinGroup() {
    const trimmed = group.trim();
    if (
      trimmed &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "join_group",
          from: username,
          group: trimmed,
        })
      );
      // Do NOT setJoinedGroup here; wait for confirmation!
      console.log("🔄 Joining group:", trimmed);
    }
  }

  function sendGroupMsg() {
    console.log("📤 Attempting to send group message:", {
      joinedGroup,
      groupMsg: groupMsg.trim(),
      wsReady: wsRef.current?.readyState === WebSocket.OPEN,
    });

    if (
      joinedGroup &&
      groupMsg.trim() &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "group",
          from: username,
          group: joinedGroup,
          content: groupMsg.trim(),
        })
      );
      setGroupMsg("");
      console.log("✅ Group message sent to:", joinedGroup);
    } else {
      console.log("❌ Cannot send group message - missing requirements");
    }
  }

  function startGroupCall() {
    if (!joinedGroup) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "group",
          from: username,
          group: joinedGroup,
          content: "__start_group_call__",
        })
      );
      setInCall(true);
    }
  }

  function initiateCall() {
    if (
      callTarget.trim() &&
      callTarget.trim() !== username &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "start_video",
          from: username,
          to: callTarget.trim(),
        })
      );
      setInCall(true);
      createPeer(callTarget.trim(), false, null);
    }
  }

  function initiateVoiceCall() {
    if (
      voiceTarget.trim() &&
      voiceTarget.trim() !== username &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "start_voice",
          from: username,
          to: voiceTarget.trim(),
        })
      );
      setInCall(true);
      createPeer(voiceTarget.trim(), false, null, { audioOnly: true });
    }
  }

  function endCall() {
    // Close all peer connections
    Object.values(pcRef.current).forEach((pc) => pc && pc.close());
    // Stop local media stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    // Clean up state
    setInCall(false);
    setParticipants([]);
    setRemoteStreams({});
    localStreamRef.current = null;
    pcRef.current = {};
    addMsg("system", "🔴 Call ended.");
  }

  const ctx = {
    connected,
    connect,
    username,
    setUsername,
    messages,
    broadcastMsg,
    setBroadcastMsg,
    dmUser,
    setDMUser,
    dmMessage,
    setDMMessage,
    group,
    setGroup,
    joinedGroup,
    groupMsg,
    setGroupMsg,
    callTarget,
    setCallTarget,
    voiceTarget,
    setVoiceTarget,
    darkMode,
    setDarkMode,
    sendBroadcast,
    sendDM,
    createGroup,
    joinGroup,
    sendGroupMsg,
    startGroupCall,
    initiateCall,
    initiateVoiceCall,
    endCall,
    inCall,
    participants,
    remoteStreams,
    localStreamRef,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}
