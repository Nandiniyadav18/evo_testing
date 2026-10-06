import React, { useState } from 'react';
import { X, User, Building, Mail, Phone, Calendar, Copy, Check, Code, ShieldCheck } from 'lucide-react';

export default function LeadDrawer({ isOpen, onClose, lead, profile, visitorId }) {
    const [copied, setCopied] = useState(false);
    const [viewRawJson, setViewRawJson] = useState(false);

    if (!isOpen) return null;

    const leadData = {
        visitorId,
        profile: profile || {},
        lead: lead || {}
    };

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(leadData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
            <div className="relative w-full max-w-md bg-[#061e2d] border-l border-white/10 h-full p-6 flex flex-col shadow-2xl overflow-y-auto">
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                        <h2 className="text-base font-bold text-white font-['Outfit']">
                            Visitor Intelligence Record
                        </h2>
                        <p className="text-xs text-slate-400">
                            Synchronized with MongoDB Atlas in Realtime
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Score Summary Badge */}
                <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                            Qualification Status
                        </span>
                        <strong className="text-lg font-bold text-white font-['Outfit']">
                            {lead?.status || 'Exploring'}
                        </strong>
                    </div>

                    <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Lead Score</span>
                        <strong className="text-xl font-black text-emerald-400 font-['Outfit']">
                            {lead?.score || 0}/100
                        </strong>
                    </div>
                </div>

                {/* Profile Fields */}
                <div className="space-y-3 flex-1">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Extracted Lead Attributes
                    </h3>

                    <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-2">
                                <User className="w-4 h-4 text-emerald-400" /> Full Name
                            </span>
                            <span className="text-white font-medium">{profile?.name || "—"}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-2">
                                <Building className="w-4 h-4 text-emerald-400" /> Company
                            </span>
                            <span className="text-white font-medium">{profile?.company || "—"}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-400" /> Email Address
                            </span>
                            <span className="text-white font-medium">{profile?.email || "—"}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-400" /> Phone / WhatsApp
                            </span>
                            <span className="text-white font-medium">{profile?.whatsapp || "—"}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-400" /> Consultation Request
                            </span>
                            <span className={`font-semibold ${profile?.appointmentRequested ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {profile?.appointmentRequested ? 'Yes (Requested)' : 'No'}
                            </span>
                        </div>

                        {profile?.intent && (
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                                <span className="text-slate-400 block mb-1">Detected Intent</span>
                                <span className="text-emerald-300 font-medium block">{profile.intent}</span>
                            </div>
                        )}

                        {profile?.requirement && (
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                                <span className="text-slate-400 block mb-1">Business Requirement</span>
                                <span className="text-slate-200 block">{profile.requirement}</span>
                            </div>
                        )}
                    </div>

                    {/* Developer JSON Inspector Toggle */}
                    <div className="pt-4">
                        <button
                            onClick={() => setViewRawJson(!viewRawJson)}
                            className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 font-medium cursor-pointer"
                        >
                            <Code className="w-3.5 h-3.5" />
                            {viewRawJson ? 'Hide MongoDB JSON' : 'Inspect MongoDB JSON'}
                        </button>

                        {viewRawJson && (
                            <div className="mt-2 relative">
                                <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-48">
                                    {JSON.stringify(leadData, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Copy Action */}
                <div className="pt-4 border-t border-white/10 flex gap-2">
                    <button
                        onClick={handleCopyJson}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied Lead Data' : 'Copy Lead Payload'}
                    </button>
                </div>
            </div>
        </div>
    );
}
