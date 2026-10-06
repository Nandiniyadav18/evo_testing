import React, { useState } from 'react';
import { X, MessageSquare, Bot, User, Copy, Check, Calendar, Mail, Phone, Building, Target } from 'lucide-react';

export default function ConversationModal({ lead, onClose }) {
    const [copied, setCopied] = useState(false);
    if (!lead) return null;

    const messages = lead.conversation || [];

    const handleCopyTranscript = () => {
        const transcript = messages
            .map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role.toUpperCase()}: ${m.content}`)
            .join('\n\n');
        navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#061d2b] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-[#072435]/90 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white font-['Outfit']">
                                    {lead.name || "Anonymous Visitor"}
                                </h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    lead.leadStatus === 'Hot' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                    lead.leadStatus === 'Warm' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                    {lead.leadStatus} • {lead.leadScore || 0} pts
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                                Visitor ID: {lead.visitorId}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopyTranscript}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                            title="Copy entire conversation transcript"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy Transcript'}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body: Two Column (Chat History + Visitor Profile) */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    {/* Chat Messages Stream */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#051825]/50">
                        {messages.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-xs">
                                No messages recorded in this session.
                            </div>
                        ) : (
                            messages.map((m, idx) => {
                                const isUser = m.role === 'user';
                                return (
                                    <div
                                        key={idx}
                                        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                                            isUser
                                                ? 'bg-slate-700 text-slate-200'
                                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        }`}>
                                            {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                        </div>

                                        <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                                            isUser
                                                ? 'bg-emerald-600/90 text-white rounded-tr-sm'
                                                : 'bg-[#082232] text-slate-200 border border-white/10 rounded-tl-sm'
                                        }`}>
                                            <div className="whitespace-pre-wrap">{m.content}</div>
                                            {m.timestamp && (
                                                <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-emerald-200' : 'text-slate-400'}`}>
                                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Profile & Context Sidebar */}
                    <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-white/10 bg-[#061d2a] p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-['Outfit']">
                            Lead Metadata
                        </h4>

                        <div className="space-y-2.5">
                            <div>
                                <span className="text-[10px] text-slate-400 block">Company / Organization</span>
                                <span className="text-slate-200 font-medium">{lead.company || "—"}</span>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 block">Email Address</span>
                                <span className="text-slate-200 font-medium break-all">{lead.email || "—"}</span>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 block">WhatsApp / Phone</span>
                                <span className="text-slate-200 font-medium">{lead.whatsapp || "—"}</span>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 block">Consultation Status</span>
                                <span className={`font-semibold ${lead.appointmentRequested ? 'text-emerald-400' : 'text-slate-400'}`}>
                                    {lead.appointmentRequested ? '📅 Scheduled / Requested' : 'None'}
                                </span>
                            </div>

                            {lead.intent && (
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Identified Intent</span>
                                    <span className="text-emerald-300 font-medium">{lead.intent}</span>
                                </div>
                            )}

                            {lead.requirement && (
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Business Problem</span>
                                    <p className="text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-white/5 text-[11px]">
                                        {lead.requirement}
                                    </p>
                                </div>
                            )}

                            <div>
                                <span className="text-[10px] text-slate-400 block">First Recorded</span>
                                <span className="text-slate-400">{new Date(lead.createdAt).toLocaleString()}</span>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 block">Last Active</span>
                                <span className="text-slate-400">{new Date(lead.lastInteraction).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
