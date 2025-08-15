import React, { useState, useRef, useEffect } from "react";
import { AppContext } from "./AppContext";
import useWebRTC from "../hooks/useWebRTC";

export function AppProvider({ children }) {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState("");
  const [joinedGroup, setJoinedGroup] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [dmUser, setDMUser] = useState("");
  const [dmMessage, setDMMessage] = useState("");
  const [groupMsg, setGroupMsg] = useState("");
  const [callTarget, setCallTarget] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const wsRef = useRef(null);

  const {
    participants,
    remoteStreams,
    createPeer,
    handleSignaling,
    localStreamRef,
  } = useWebRTC(username, (msg) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  function connect(user) {
    setUsername(user);
    wsRef.current = new WebSocket("ws://localhost:8080/ws");

    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ type: "register", from: user }));
      setConnected(true);
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
      const displayMsg = `[${msg.from}${
        msg.to ? "→" + msg.to : msg.group ? "@" + msg.group : ""
      }] ${msg.content}`;
      addMsg(msg.type, displayMsg);
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
      createPeer(msg.from, true, null);
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
      setJoinedGroup(trimmed);
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
      setJoinedGroup(trimmed);
    }
  }

  function sendGroupMsg() {
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
      createPeer(callTarget.trim(), false, null);
    }
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
    darkMode,
    setDarkMode,
    sendBroadcast,
    sendDM,
    createGroup,
    joinGroup,
    sendGroupMsg,
    startGroupCall,
    initiateCall,
    participants,
    remoteStreams,
    localStreamRef,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}
