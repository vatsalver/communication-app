import React, { useEffect, useRef } from "react";
import { useApp } from "../context/useAppContext";
import { MessageCircle } from "lucide-react";

export default function ChatBox() {
  const { messages } = useApp();
  const messagesEndRef = useRef(null);

  /*const scrollAllowedRef = useRef(false);

  useEffect(() => {
    if (scrollAllowedRef.current) {
      
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollAllowedRef.current = true;
    }
  }, [messages]); */

  const getMessageStyle = (type, variant) => {
    const baseStyle = "p-3 rounded-xl mb-2 message-animation";

    if (type === "system") {
      if (variant === "error")
        return `${baseStyle} bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800`;
      if (variant === "success")
        return `${baseStyle} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800`;
      return `${baseStyle} bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800`;
    }

    if (type === "broadcast")
      return `${baseStyle} bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100`;
    if (type === "dm")
      return `${baseStyle} bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800`;
    if (type === "group")
      return `${baseStyle} bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-800`;

    return baseStyle;
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Messages
        </h3>
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
          {messages.length}
        </span>
      </div>

      <div className="h-80 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={getMessageStyle(message.type, message.variant)}
            >
              <div className="flex justify-between items-start">
                <p className="whitespace-pre-wrap flex-1">{message.content}</p>
                {message.timestamp && (
                  <span className="text-xs opacity-60 ml-2">
                    {message.timestamp}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
