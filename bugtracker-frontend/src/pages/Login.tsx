import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bug } from "lucide-react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      const token = typeof data === "string" ? data : data?.token || data?.accessToken;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      if (data?.name !== undefined) {
        const userInfo = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role || "USER",
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: string } }).response?.data || "Login failed"
        : "Login failed. Check credentials and backend.";
      setError(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-6 md:p-8 shadow-slate-900/50 transition-all duration-300 hover:border-white/15">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 animate-float">
              <Bug className="w-8 h-8 text-blue-400" strokeWidth={2} />
            </div>
            <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white tracking-tight">BugTracker</h1>
            <p className="mt-1 text-slate-400 text-sm">Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm animate-fade-in">
                {error}
              </div>
            )}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
            <div className="animate-fade-in-up pt-1" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-slate-400 text-sm animate-fade-in" style={{ animationDelay: "0.25s", animationFillMode: "both" }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline-offset-2 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
