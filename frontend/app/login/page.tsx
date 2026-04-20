"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "faculty") router.push("/dashboard/faculty");
        else router.push("/dashboard/student");
      } else {
        setError("AUTHENTICATION_FAILED: INVALID_CREDENTIALS");
      }
    } catch (err) {
      setError("SERVER_OFFLINE: CONNECTION_REFUSED");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-[#a11d33]/20 p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
        {/* Subtle Maroon Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#a11d33]/80"></div>

        <header className="mb-10">
          <p className="text-[10px] font-mono text-[#a11d33] mb-2 tracking-widest uppercase">System.Auth v2.0</p>
          <h1 className="text-4xl font-bold tracking-tighter text-[#2d2d2d]">AI Query Portal</h1>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-black/40 uppercase ml-1">Username_</label>
            <input
              type="text"
              placeholder="e.g. student1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/5 border border-black/5 text-[#2d2d2d] placeholder-black/20 outline-none focus:border-[#a11d33]/50 transition-all font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-black/40 uppercase ml-1">Password_</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/5 border border-black/5 text-[#2d2d2d] placeholder-black/20 outline-none focus:border-[#a11d33]/50 transition-all font-sans"
            />
          </div>

          {error && (
            <p className="text-[10px] font-mono text-[#a11d33] bg-[#a11d33]/5 p-3 rounded-lg border border-[#a11d33]/10">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[#2d2d2d] text-white font-mono text-xs tracking-widest rounded-xl hover:bg-black transition-all active:scale-[0.98] mt-4 shadow-lg"
          >
            INITIALIZE_SIGN_IN
          </button>
        </form>

        <footer className="mt-12 pt-6 border-t border-black/5">
          <p className="text-[9px] font-mono text-black/30 text-center uppercase tracking-tighter">
            Secure Terminal Access • Encrypted Connection
          </p>
        </footer>
      </div>
    </div>
  );
}
