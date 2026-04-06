import { useAuthStore } from "../../store/useAuthStore";

const MessageBubble = ({ message, showAvatar }) => {
  const { authUser } = useAuthStore();
  const isOwn = message.senderId._id === authUser._id;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className={`msg-animate flex items-end gap-2.5 group ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`shrink-0 transition-opacity duration-200 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white/70 text-xs font-semibold"
          style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.2)" }}>
          {message.senderId.username?.[0]?.toUpperCase()}
        </div>
      </div>

      <div className={`flex flex-col max-w-xs lg:max-w-sm ${isOwn ? "items-end" : "items-start"}`}>
        {showAvatar && !isOwn && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-white/40 text-xs font-medium">{message.senderId.username}</span>
            <span className="text-white/15 text-xs">{time}</span>
          </div>
        )}

        <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={isOwn ? {
            background: "rgba(139,92,246,0.2)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "rgba(255,255,255,0.85)",
            borderBottomRightRadius: "4px",
          } : {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.75)",
            borderBottomLeftRadius: "4px",
          }}>
          {message.text}
        </div>

        {isOwn && (
          <span className="text-white/15 text-xs mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;