"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function FacultyDashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/get-complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  }, []);

  // Grouping complaints by student name
  const students = Array.from(new Set(complaints.map(c => c.username)));

  // Helper for Sentiment Colors
  const getSentimentColor = (s: string) => {
    if (s === "Urgent") return "text-red-500 bg-red-500/10 border-red-500/20";
    if (s === "Moderate") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-green-500 bg-green-500/10 border-green-500/20";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white shadow-[inset_0_0_200px_rgba(161,29,51,0.05)] pb-24">
      <div className="p-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div>
            <p className="text-[10px] font-mono text-[#a11d33] mb-1 tracking-[0.2em]">ADMIN_PORTAL v3.0</p>
            <h1 className="text-4xl font-bold tracking-tighter">Welcome, Faculty_</h1>
          </div>
          <button onClick={() => router.push("/login")} className="text-[10px] font-mono border border-white/10 px-6 py-2 rounded-full hover:border-[#a11d33] hover:text-[#a11d33] transition-all bg-white/[0.05]">TERMINATE_SESSION</button>
        </header>

        {/* Navigation Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
            <h3 className="text-[#a11d33] font-mono text-[10px] mb-3 uppercase tracking-widest">Tip 01. STUDENT_LIST</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">Select a student from the sidebar to view their specific reports and AI-generated insights.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
            <h3 className="text-[#a11d33] font-mono text-[10px] mb-3 uppercase tracking-widest">Tip 02. STRESS_METER</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">Watch for Red indicators. These mark high-urgency or high-frustration sessions needing immediate action.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
            <h3 className="text-[#a11d33] font-mono text-[10px] mb-3 uppercase tracking-widest">Tip 03. DECRYPT_LOGS</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">Click on a report summary to expand the full session transcript and see the AI-Student interview.</p>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Student Sidebar */}
          <div className="w-80 space-y-4">
            <h2 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-8">SUBMITTED_BY</h2>
            {students.length === 0 ? (
              <p className="font-mono text-[10px] text-white/20 italic">No reports found...</p>
            ) : students.map(student => (
              <button
                key={student}
                onClick={() => setSelectedStudent(student)}
                className={`w-full text-left p-6 rounded-2xl border transition-all flex justify-between items-center group ${selectedStudent === student ? 'bg-[#a11d33] border-[#a11d33]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
              >
                <div>
                  <p className="text-xs font-bold tracking-tight">{student}</p>
                  <p className={`text-[9px] font-mono mt-1 ${selectedStudent === student ? 'text-white/60' : 'text-white/20'}`}>
                    {complaints.filter(c => c.username === student).length} REPORTS_FOUND
                  </p>
                </div>
                <span className={`text-xs transition-transform group-hover:translate-x-1 ${selectedStudent === student ? 'text-white' : 'text-white/20'}`}>→</span>
              </button>
            ))}
          </div>

          {/* Complaints View */}
          <div className="flex-1">
            {selectedStudent ? (
              <div className="space-y-12">
                <header className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold tracking-tighter">Reporting Logs: {selectedStudent}</h2>
                  <button onClick={() => setSelectedStudent(null)} className="text-[9px] font-mono text-white/30 hover:text-white uppercase tracking-widest">Close_Dashboard ×</button>
                </header>

                <div className="grid grid-cols-1 gap-6">
                  {complaints.filter(c => c.username === selectedStudent).map(c => (
                    <div key={c.id} className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl group relative overflow-hidden">
                      {/* Stress Meter Indicator */}
                      <div className={`absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-10 ${c.sentiment === 'Urgent' ? 'bg-red-500' : c.sentiment === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>

                      <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-3">
                          <span className="text-[9px] font-mono bg-white/5 px-3 py-1 rounded-full text-white/40 uppercase">ID_{c.id}</span>
                          <span className="text-[9px] font-mono bg-white/5 px-3 py-1 rounded-full text-white/40 uppercase font-bold tracking-widest">{c.category}</span>
                        </div>
                        <div className={`text-[9px] font-mono uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${getSentimentColor(c.sentiment)}`}>
                          {c.sentiment || 'MODERATE'}_PRIORITY
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-[9px] font-mono text-[#a11d33] uppercase tracking-widest mb-3">AI_EXECUTIVE_SUMMARY_</p>
                          <p className="text-lg font-bold tracking-tight text-white/90 leading-snug">
                            {c.summary || c.description}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="w-full py-4 mt-4 bg-white/5 hover:bg-[#a11d33] transition-all rounded-xl font-mono text-[9px] tracking-widest uppercase flex items-center justify-center gap-3 group"
                        >
                          ACCESS_FULL_TRANSCRIPT <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 border border-dashed border-white/5 rounded-[3rem]">
                <div className="w-16 h-16 bg-[#a11d33]/10 text-[#a11d33] rounded-full flex items-center justify-center text-xl mb-6 mb animate-pulse">!</div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Awaiting Selection</h3>
                <p className="text-xs text-white/20 font-mono tracking-widest uppercase">Select a student log to begin intelligence review</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail & Transcript Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden text-white">
            <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#a11d33]/10 border border-[#a11d33]/20 rounded-2xl flex items-center justify-center text-[#a11d33] font-bold">
                   {selectedComplaint.id}
                </div>
                <div>
                  <p className="text-[9px] font-mono text-[#a11d33] uppercase tracking-[0.2em] mb-1">
                    SECURE_REPORT_DECRYPTION // NODE_ACTIVE
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight">Intelligence Report: {selectedComplaint.username}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#a11d33] hover:border-[#a11d33] transition-all text-white/40 hover:text-white"
              >
                ✕
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
              {/* Top Intelligence Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">CATEGORY_LOG</p>
                    <p className="text-sm font-bold text-[#a11d33] uppercase">{selectedComplaint.category}</p>
                 </div>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">TIMESTAMP</p>
                    <p className="text-sm font-bold">{new Date(selectedComplaint.created_at).toLocaleString()}</p>
                 </div>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">URGENCY_LEVEL</p>
                    <p className={`text-sm font-bold uppercase ${
                      selectedComplaint.sentiment === 'Urgent' ? 'text-red-500' : 
                      selectedComplaint.sentiment === 'Moderate' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {selectedComplaint.sentiment || 'MODERATE'}
                    </p>
                 </div>
              </div>

              {/* AI Insights (Summarization) */}
              <div className="p-8 bg-[#a11d33]/5 border border-[#a11d33]/20 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#a11d33]/10 blur-[60px] translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>
                 <p className="text-[9px] font-mono text-[#a11d33] uppercase tracking-widest mb-4 flex items-center gap-2 relative">
                    <span className="w-1.5 h-1.5 bg-[#a11d33] rounded-full animate-pulse"></span> AI_EXECUTIVE_SUMMARY_
                 </p>
                 <p className="text-lg font-bold leading-snug tracking-tight italic relative">
                   "{selectedComplaint.summary || "Evaluation pending... (Old system report)"}"
                 </p>
              </div>

              {/* Original Concern */}
              <div className="space-y-4">
                 <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">ORIGINAL_REPORT_DESCRIPTION_</p>
                 <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl text-sm leading-relaxed text-white/70 font-light italic whitespace-pre-wrap">
                    {selectedComplaint.description}
                 </div>
              </div>

              {/* Interaction Details (Transcript) */}
              <div className="space-y-8">
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-4">DETAILED_INTERACTION_STREAM</p>
                {selectedComplaint.conversation_log ? (
                  (() => {
                    try {
                      const logs = typeof selectedComplaint.conversation_log === 'string' 
                        ? JSON.parse(selectedComplaint.conversation_log) 
                        : selectedComplaint.conversation_log;
                      return logs.map((msg: any, i: number) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <span className="text-[8px] font-mono uppercase text-white/20 mb-2 tracking-widest">
                            {msg.role === 'user' ? 'Student' : 'Assistant_Node'}
                          </span>
                          <div className={`p-5 rounded-2xl text-[13px] leading-relaxed max-w-[85%] ${
                            msg.role === 'user' 
                            ? 'bg-[#a11d33]/10 text-[#a11d33] border border-[#a11d33]/20 rounded-tr-none' 
                            : 'bg-white/5 text-white/70 border border-white/5 rounded-tl-none'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ));
                    } catch(e) {
                      return <p className="text-xs text-white/20 italic font-mono">[LOG_DECRYPTION_ERROR]</p>;
                    }
                  })()
                ) : (
                  <div className="p-10 border border-dashed border-white/5 rounded-3xl text-center">
                     <p className="text-xs text-white/10 font-mono italic uppercase">NO_CONVERSATION_STREAM_RECORDED_FOR_THIS_NODE</p>
                  </div>
                )}
              </div>
            </div>
            
            <footer className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-center">
              <p className="text-[8px] font-mono text-white/10 uppercase tracking-[0.3em] w-full items-center justify-center flex gap-4">
                 <span className="w-1 h-1 bg-[#a11d33] rounded-full"></span>
                 END_OF_INTELLIGENCE_STREAM
                 <span className="w-1 h-1 bg-[#a11d33] rounded-full"></span>
              </p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
