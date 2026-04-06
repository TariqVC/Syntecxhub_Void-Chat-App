import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const Sidebar = () => {
  const { rooms, activeRoom, setActiveRoom, createRoom, onlineUsers, isLoadingRooms } = useChatStore();
  const { authUser, logout } = useAuthStore();
  const [newRoomName, setNewRoomName] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setError("");
    const result = await createRoom(newRoomName.trim());
    if (result.success) {
      setNewRoomName("");
      setActiveRoom(result.room);
    } else {
      setError(result.message);
    }
  };

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 flex flex-col h-full shrink-0 relative z-10"
      style={{ background: "rgba(10,11,20,0.7)", borderRight: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>

      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🌌</span>
          <span className="text-white/80 font-semibold text-sm tracking-widest uppercase">Void Chat</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <svg className="w-3.5 h-3.5 text-white/20 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels..."
            className="bg-transparent text-white/60 text-xs outline-none placeholder-white/15 w-full"
          />
        </div>
      </div>

      {/* Create room */}
      <div className="px-4 py-2">
        <form onSubmit={handleCreateRoom} className="flex gap-2">
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="New channel..."
            className="flex-1 text-white/70 text-xs rounded-xl px-3 py-2 outline-none placeholder-white/15 min-w-0 transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.35)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
          />
          <button type="submit"
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 text-white/50 hover:text-white/80"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </form>
        {error && <p className="text-red-300/60 text-xs mt-1.5 px-1">{error}</p>}
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <p className="text-white/20 text-xs uppercase tracking-widest px-2 py-2">
          Channels — {rooms.length}
        </p>

        {isLoadingRooms ? (
          <div className="flex flex-col gap-1.5 px-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 rounded-xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-white/20 text-xs px-2 py-4 text-center">No channels found</p>
        ) : (
          filtered.map((room) => {
            const isActive = activeRoom?._id === room._id;
            return (
              <button
                key={room._id}
                onClick={() => setActiveRoom(room)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all duration-150 mb-0.5 flex items-center gap-2.5 group"
                style={{
                  background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
                  border: isActive ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
                  color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span className="text-white/25 font-mono">#</span>
                <span className="truncate">{room.name}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400/60 shrink-0" />}
              </button>
            );
          })
        )}
      </div>

      {/* User footer */}
      <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white/80 text-xs font-semibold"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.25)" }}>
              {authUser?.username?.[0]?.toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-400/80 rounded-full"
              style={{ border: "1.5px solid rgba(10,11,20,0.9)" }} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-medium truncate">{authUser?.username}</p>
            <p className="text-teal-400/60 text-xs">{onlineUsers.length} online</p>
          </div>

          <button onClick={logout} title="Logout"
            className="text-white/20 hover:text-red-400/60 transition p-1.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;