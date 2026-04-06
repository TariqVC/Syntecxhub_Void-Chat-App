import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

const ChatPage = () => {
  const { fetchRooms } = useChatStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex h-screen bg-[#1a1d2e] overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;