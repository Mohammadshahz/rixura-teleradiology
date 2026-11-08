import React, { useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import useChat from "../../../hooks/useChat";

const ChatBox = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    handleSend,
    loading,
    submitting,
  } = useChat();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div
        className="flex flex-col h-screen min-h-0 bg-white dark:bg-gray-900"
      >
        {/* Scrollable Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2 flex flex-col gap-2">
          {loading ? (
            <div className="absolute inset-0 z-10 bg-gray-light2/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <span className="text-gray dark:text-gray-light text-lg font-medium">
                Loading messages...
              </span>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-400">No messages yet.</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.userType === "CENTER" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="relative max-w-sm break-words">
                  <div
                    className={`mx-2 px-3 py-2 rounded-lg text-sm relative ${
                      msg.userType === "CENTER"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    <span className="block text-xs font-semibold text-gray-400 mb-1">
                      {msg.userType === "RADIOLOGIST"
                        ? "Dr. " + msg.radiologist?.name
                        : msg.center?.name}
                    </span>
                    <p>{msg.content}</p>
                  </div>
                  <div
                    className={`absolute top-5 w-0 h-0 border-t-8 border-t-transparent ${
                      msg.userType === "CENTER"
                        ? "right-[0px] border-l-8 border-l-blue-600"
                        : "left-[0px] border-r-8 border-r-gray-200 dark:border-r-gray-700"
                    }`}
                  ></div>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Box (Fixed at bottom) */}
      {/* <div className="border-t border-gray-300 dark:border-gray-700 p-2">
        <div className="flex items-center">
          <input
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={submitting}
          />
          <button
            className="ml-2 p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSend}
            disabled={submitting}
          >
            <PaperAirplaneIcon className="h-4 w-4 transform -rotate-45" />
          </button>
        </div>
      </div> */}
    </>
  );
};

export default ChatBox;
