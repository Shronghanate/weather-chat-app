// ChatMessage.jsx
export default function ChatMessage({ message, isUser }) {
  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`font-inter`}
        style={{
          width: "723px",
          maxWidth: "723px",
          padding: isUser ? "12px 16px" : "18px",
          backgroundColor: isUser ? "rgb(245, 245, 245)" : "transparent",
          color: "rgb(10, 10, 10)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "40px",
          letterSpacing: "1%",
          wordSpacing: "1.5px",
          borderRadius: isUser ? "12px" : "0px",
        }}
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
}
