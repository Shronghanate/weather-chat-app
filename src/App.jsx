import { useEffect, useRef, useState } from "react";
import { sendWeatherMessage } from "./api/mastraClient";
import "./index.css";

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle chat container scroll
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
  };

  // Global scroll listener for mouse wheel / trackpad
  useEffect(() => {
    const handleGlobalScroll = () => {
      if (!chatContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
    };

    window.addEventListener("wheel", handleGlobalScroll, { passive: true });
    window.addEventListener("scroll", handleGlobalScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleGlobalScroll);
      window.removeEventListener("scroll", handleGlobalScroll);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);
    setError("");

    const mastraMessages = [...messages, newUserMsg].map((msg) => ({
      role: msg.role === "bot" ? "assistant" : msg.role,
      content: msg.content,
    }));

    await sendWeatherMessage(
      mastraMessages,
      (partial) => {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === "bot") {
            return [...prev.slice(0, -1), { ...lastMsg, content: partial }];
          }
          return [
            ...prev,
            { role: "bot", content: partial, timestamp: new Date().toLocaleTimeString() },
          ];
        });
      },
      () => {
        setLoading(false);
      },
      (errMsg) => {
        setError(errMsg);
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative">
      {/* Chat container */}
      <div className="relative w-full max-w-[760px] flex-1">
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 w-full px-6 space-y-4 overflow-y-auto scrollbar-none"
          style={{
            height: "calc(100vh - 130px)",
            paddingBottom: "20px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="font-inter"
                style={
                  msg.role === "user"
                    ? {
                        maxWidth: "520px",
                        width: "fit-content",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "12px",
                        borderBottomLeftRadius: "12px",
                        padding: "12px 16px",
                        backgroundColor: "#F5F5F5",
                        color: "#0A0A0A",
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: "28px",
                      }
                    : {
                        width: "723px",
                        maxWidth: "723px",
                        padding: "18px",
                        backgroundColor: "transparent",
                        color: "#0A0A0A",
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "40px",
                        letterSpacing: "1%",
                        wordSpacing: "1.5px",
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-500 italic">Typing...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div ref={chatEndRef} />
        </div>

        {/* Scroll-to-latest button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-black text-white rounded-full px-4 py-2 shadow hover:bg-gray-800 transition-opacity duration-300 z-50"
          >
            ↓ New Messages
          </button>
        )}
      </div>

      {/* Fixed Chat Input Box */}
      <div className="fixed bottom-6 flex justify-center w-full z-50">
        <div
          style={{
            width: "720px",
            height: "112px",
            borderRadius: "16px",
            border: "1px solid #E4E4E7",
            padding: "12px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 6px -2px #0000000D, 0px 10px 15px -3px #0000001A",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          {/* Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
            placeholder="Type your question..."
            className="w-full h-full border-0 focus:outline-none text-[18px] font-inter resize-none"
            style={{
              verticalAlign: "top",
              lineHeight: "40px",
              letterSpacing: "0.8px",
              wordSpacing: "2px",
              paddingRight: "60px",
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              width: "40px",
              height: "40px",
              borderRadius: "10.91px",
              backgroundColor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="disabled:opacity-50 hover:bg-gray-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              style={{ width: "20px", height: "20px", transform: "rotate(45deg)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
