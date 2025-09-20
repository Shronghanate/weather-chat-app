import { useEffect, useRef, useState } from "react";

export default function MessageList({ messages, loading, error }) {
  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Auto-scroll when new messages arrive if user is near bottom
  useEffect(() => {
    if (!showScrollBtn) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Handle scroll
  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    setShowScrollBtn(!isAtBottom);
  };

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
  className="h-[calc(100vh-180px)] overflow-y-auto space-y-6 relative scrollbar-none"
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          } transition-all`}
        >
          {msg.role === "user" ? (
            <div className="px-5 py-3 rounded-2xl text-sm shadow-sm bg-[#F5F5F5] text-gray-900 max-w-[70%]">
              <p>{msg.content}</p>
              <span className="block text-xs text-gray-400 mt-1 text-right">
                {msg.timestamp}
              </span>
            </div>
          ) : (
            <div className="text-gray-900 text-base font-medium leading-relaxed bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg max-w-[85%]">
              <p>{msg.content}</p>
              <span className="block text-xs text-gray-400 mt-2">
                {msg.timestamp}
              </span>
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="text-gray-500 italic">Typing...</div>
        </div>
      )}

      {error && (
        <div className="flex justify-center text-red-500 text-sm">{error}</div>
      )}

      <div ref={bottomRef} />

      {/* Scroll-to-bottom arrow */}
      {showScrollBtn && (
        <button
          onClick={() =>
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 bg-black text-white w-10 h-10 rounded-full shadow-md hover:bg-gray-800 transition"
        >
          ↓
        </button>
      )}
    </div>
  );
}
