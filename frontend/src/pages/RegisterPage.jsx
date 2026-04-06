import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import StarField from "../components/ui/StarField";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(form);
    if (result.success) navigate("/");
    else setError(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080f] relative overflow-hidden">
      <StarField />

      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(15,118,110,0.1) 0%, transparent 70%)", top: "-10%", right: "-10%" }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(88,28,135,0.12) 0%, transparent 70%)", bottom: "-5%", left: "-5%" }} />

      <div className="fade-in relative z-10 glass-strong rounded-3xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="float w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}>
            🌌
          </div>
          <span className="text-white text-xl font-semibold" style={{ letterSpacing: "0.15em" }}>
            VOID CHAT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-white/90 text-center mb-1">Create account</h1>
        <p className="text-white/30 text-sm text-center mb-7">Join the cosmic conversation</p>

        {error && (
          <div className="text-red-300/80 text-sm text-center mb-5 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Username", key: "username", type: "text", placeholder: "cosmic_explorer" },
            { label: "Email", key: "email", type: "email", placeholder: "you@cosmos.dev" },
            { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                required
                className="w-full text-white/80 text-sm rounded-2xl px-4 py-3 outline-none placeholder-white/15 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.4)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white/90 font-medium py-3 rounded-2xl transition-all duration-200 mt-2 tracking-wide disabled:opacity-40"
            style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.35)" }}
            onMouseEnter={(e) => e.target.style.background = "rgba(139,92,246,0.35)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(139,92,246,0.25)"}
          >
            {isLoading ? "Launching..." : "Launch into void"}
          </button>
        </form>

        <p className="text-center text-white/25 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-400/70 hover:text-violet-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;