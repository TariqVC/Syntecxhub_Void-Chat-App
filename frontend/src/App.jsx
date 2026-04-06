import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSocket } from "./hooks/useSocket";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  useSocket(authUser);

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;