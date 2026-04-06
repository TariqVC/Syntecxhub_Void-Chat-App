import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getSocket } from "../../hooks/useSocket";
import MessageBubble from "./MessageBubble";
import StarField from "../ui/StarField";

const ChatWindow = () => {
  const { activeRoom, messages, setMessages, addMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeRoom) return;

    socket.emit("joinRoom", activeRoom._id);
    socket.on("roomHistory", setMessages);
    socket.on("newMessage", addMessage);
    socket.on("userTyping", ({ username }) => setTypingUser(username));
    socket.on("userStopTyping", () => setTypingUser(null));

    return () => {
      socket.emit("leaveRoom", activeRoom._id);
      socket.off("roomHistory");
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  const handleTyping = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    if (!socket || !activeRoom) return;
    socket.emit("typing", { roomId: activeRoom._id, username: authUser.username });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId: activeRoom._id });
    }, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const socket = getSocket();
    if (!socket || !text.trim() || !activeRoom) return;
    socket.emit("sendMessage", { roomId: activeRoom._id, text });
    socket.emit("stopTyping", { roomId: activeRoom._id });
    setText("");
    clearTimeout(typingTimeout.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e);
  };

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ background: "#07080f" }}>
        <StarField />
        <div className="text-center fade-in relative z-10">
          <div className="float text-5xl mb-4">🌌</div>
          <h2 className="text-white/50 text-base font-medium mb-1">No channels yet</h2>
          <p className="text-white/20 text-sm">Select a channel or create one to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden" style={{ background: "#07080f" }}>
      <StarField />

      {/* Subtle nebula in chat bg */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(88,28,135,0.05) 0%, transparent 60%)" }} />

      {/* Header */}
      <div className="relative z-10 px-6 py-3.5 flex items-center gap-3"
        style={{ background: "rgba(10,11,20,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
        <span className="text-white/20 font-mono text-sm">#</span>
        <div>
          <h2 className="text-white/80 font-semibold text-sm">{activeRoom.name}</h2>
          <p className="text-white/20 text-xs">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-0.5">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center fade-in">
              <p className="text-3xl mb-3">🛸</p>
              <p className="text-white/30 text-sm font-medium">No messages yet</p>
              <p className="text-white/15 text-xs mt-1">Be the first to send a message</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const prev = messages[i - 1];
            const showAvatar = !prev || prev.senderId._id !== msg.senderId._id;
            return (
              <div key={msg._id} className={showAvatar && i !== 0 ? "mt-3" : ""}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
              </div>
            );
          })
        )}

        {typingUser && (
          <div className="flex items-center gap-2.5 mt-3 msg-animate">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white/50 text-xs"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.15)" }}>
              {typingUser[0].toUpperCase()}
            </div>
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="typing-dot w-1.5 h-1.5 bg-violet-400/50 rounded-full inline-block" />
              <span className="typing-dot w-1.5 h-1.5 bg-violet-400/50 rounded-full inline-block" />
              <span className="typing-dot w-1.5 h-1.5 bg-violet-400/50 rounded-full inline-block" />
            </div>
            <span className="text-white/20 text-xs">{typingUser} is typing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 px-6 py-4"
        style={{ background: "rgba(10,11,20,0.6)", borderTop: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white/60 text-xs font-semibold shrink-0"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}>
            {authUser?.username?.[0]?.toUpperCase()}
          </div>

          <div className="flex-1 flex items-center rounded-2xl px-4 py-2.5 gap-3 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            onFocus={() => {}} >
            <input
              value={text}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder={`Transmit to #${activeRoom.name}...`}
              className="flex-1 bg-transparent text-white/70 outline-none placeholder-white/15 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 disabled:opacity-20"
            style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.25)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139,92,246,0.35)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(139,92,246,0.2)"}
          >
            <svg className="w-3.5 h-3.5 text-violet-300 rotate-45" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21L23 12 2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </form>
        <p className="text-white/10 text-xs mt-2 px-1">Enter to send</p>
      </div>
    </div>
  );
};

export default ChatWindow;