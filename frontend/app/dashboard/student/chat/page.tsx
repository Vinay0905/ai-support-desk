"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatPage() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "query";
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) router.push("/login");
        else {
            setUser(JSON.parse(savedUser));
            // Initial AI greeting
            const greeting = mode === "query"
                ? "Hello. I am the Faculty Assistant. How can I help you with your queries today?"
                : "Good day. I am here to assist with your complaint. Please describe the issue you are facing in detail.";
            setMessages([{ role: "assistant", content: greeting }]);
        }
    }, [mode]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: Number(user.id),
                    messages: newMessages,
                    mode: mode
                }),
            });
            const data = await res.json();
            setMessages([...newMessages, { role: "assistant", content: data.response }]);
        } catch (err) {
            setMessages([...newMessages, { role: "assistant", content: "ERROR: Communication line broken. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a] shadow-[inset_0_0_200px_rgba(161,29,51,0.15)] text-white">
            {/* Refined Header */}
            <header className="max-w-5xl w-full mx-auto flex justify-between items-center px-6 py-10 border-b border-white/[0.03]">
                <div>
                    <p className="text-[9px] font-mono text-[#a11d33] mb-1 uppercase tracking-[0.2em]">{mode.toUpperCase()}_INTERVENTON</p>
                    <h1 className="text-xl font-bold tracking-tight">Faculty Assistant_</h1>
                </div>
                <button
                    onClick={() => router.push("/dashboard/student")}
                    className="text-[9px] font-mono border border-white/10 px-6 py-2 rounded-full hover:border-[#a11d33] hover:text-[#a11d33] transition-all bg-white/[0.05]"
                >
                    EXIT_SESSION
                </button>
            </header>

            {/* Chat Area - Card Style with Dark Frame */}
            <div className="flex-1 overflow-hidden max-w-5xl w-full mx-auto px-4 py-4">
                <div
                    ref={scrollRef}
                    className="h-full w-full bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/[0.05] overflow-y-auto p-8 md:p-12 space-y-12 scroll-smooth no-scrollbar shadow-inner"
                >
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`group relative max-w-[80%] md:max-w-[70%] ${m.role === "user" ? "text-right" : "text-left"}`}>
                                {/* Label */}
                                <p className="text-[8px] font-mono mb-3 opacity-30 uppercase tracking-widest px-1">
                                    {m.role === "user" ? user.username : "System.Response"}
                                </p>

                                {/* Bubble */}
                                <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${m.role === "user"
                                        ? "bg-[#a11d33] text-white rounded-tr-none shadow-2xl shadow-[#a11d33]/10"
                                        : "bg-white/[0.07] border border-white/[0.03] text-white/90 rounded-tl-none shadow-sm"
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex gap-1.5 px-4 py-3 bg-white/5 rounded-full border border-white/[0.03]">
                                <span className="w-1.5 h-1.5 bg-[#a11d33] rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-[#a11d33] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-[#a11d33] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Bar - Floating Style */}
            <div className="max-w-5xl w-full mx-auto px-6 pb-12 pt-4">
                <form
                    onSubmit={sendMessage}
                    className="relative flex items-center bg-white/[0.05] rounded-[2rem] border border-white/[0.08] shadow-2xl p-2 focus-within:border-[#a11d33]/50 transition-all backdrop-blur-xl"
                >
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent px-8 py-4 outline-none text-sm text-white placeholder-white/20"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#a11d33] text-white w-14 h-14 rounded-[1.5rem] flex items-center justify-center hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 group shadow-lg shadow-[#a11d33]/20"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
                <p className="text-[8px] text-center mt-6 text-white/10 font-mono tracking-[0.3em] uppercase">
                    AI Intervention Active • Secured Node
                </p>
            </div>
        </div>
    );
}
