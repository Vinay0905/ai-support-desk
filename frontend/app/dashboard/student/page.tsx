"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) router.push("/login");
    else setUser(JSON.parse(savedUser));
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col justify-center">
      <header className="mb-16">
        <p className="text-[10px] font-mono text-[#a11d33] mb-2 tracking-widest uppercase">Portal.Dashboard v2.0</p>
        <h1 className="text-5xl font-bold tracking-tighter text-[#2d2d2d]">Welcome, {user.username}</h1>
      </header>

      <section className="bg-white/70 backdrop-blur-xl border border-black/5 p-12 rounded-[2.5rem] shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#a11d33]/80"></div>

        <div>
          <h2 className="text-sm font-mono text-[#a11d33] mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-[#a11d33]"></span> RULES_OF_ENGAGEMENT
          </h2>
          <ul className="space-y-4 text-[#4a4a4a] leading-relaxed">
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">01.</span>
              <p className="text-sm">Be specific. Provide concrete details instead of vague statements for faster resolution.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">02.</span>
              <p className="text-sm">Include exact locations such as Room Number, Block, or Department names.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">03.</span>
              <p className="text-sm">Identify involved personnel (Faculty/Staff) by their full names or designations.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">04.</span>
              <p className="text-sm">Mention precise timestamps (Date and Time) when the incident occurred.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">05.</span>
              <p className="text-sm">Maintain professional conduct. The AI Assistant follows academic standards.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">06.</span>
              <p className="text-sm">Answer all questions. The AI will "interview" you to gather sufficient context.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">07.</span>
              <p className="text-sm">Confidentiality is prioritized. Data is routed directly to protected dashboards.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">08.</span>
              <p className="text-sm">One issue per session. For multiple problems, please start separate chats.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">09.</span>
              <p className="text-sm">Evidence readiness. Be prepared to describe photos or documents if available.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[#a11d33]/50 text-xs">10.</span>
              <p className="text-sm">Accuracy requirement. Misleading info may lead to institutional disciplinary action.</p>
            </li>
          </ul>
        </div>

        <div className="pt-10 border-t border-black/5 flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => router.push("/dashboard/student/chat?mode=query")}
            className="flex-1 py-5 bg-[#2d2d2d] text-white font-mono text-xs tracking-widest rounded-2xl hover:bg-black transition-all active:scale-[0.98] shadow-lg"
          >
            INITIALIZE_FAQ_QUERY
          </button>
          <button
            onClick={() => router.push("/dashboard/student/chat?mode=complaint")}
            className="flex-1 py-5 border border-[#a11d33] text-[#a11d33] font-mono text-xs tracking-widest rounded-2xl hover:bg-[#a11d33] hover:text-white transition-all active:scale-[0.98]"
          >
            START_NEW_COMPLAINT
          </button>
        </div>
      </section>

      <footer className="mt-12 flex justify-between items-center px-4">
        <p className="text-[9px] font-mono text-black/30 uppercase tracking-tighter">Session_ID: 0x{user.id}FF</p>
        <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-[10px] font-mono text-[#a11d33] hover:underline">TERMINATE_SESSION</button>
      </footer>
    </div>
  );
}
