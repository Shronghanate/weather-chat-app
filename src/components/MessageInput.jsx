import { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="relative bg-white shadow-md rounded-xl h-[112px] flex items-center px-4">
      <input
        type="text"
        placeholder="Type your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled}
        className="w-full h-full border-0 text-base focus:outline-none disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="flex items-center justify-center w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-lg ml-3 disabled:opacity-50"
      >
        ➤
      </button>
    </div>
  );
}
