import React from 'react';
import { MessageSquare, Trash2, Calendar, Mail, Phone, ExternalLink, User } from 'lucide-react';

export default function LeadsTable({ leads, onViewLead, onDeleteLead }) {
    if (!leads || leads.length === 0) {
        return (
            <div className="rounded-2xl p-12 bg-[#072030]/80 border border-white/10 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white font-['Outfit']">No Leads Found</h4>
                <p className="text-xs text-slate-500">
                    No visitor interactions match your current filter criteria.
                </p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        if (status === 'Hot') {
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Hot
                </span>
            );
        }
        if (status === 'Warm') {
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Warm
                </span>
            );
        }
        return (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Exploring
            </span>
        );
    };

    return (
        <div className="rounded-2xl bg-[#072030]/80 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    
                    {/* Table Head */}
                    <thead className="bg-[#051724]/90 text-[11px] text-slate-400 uppercase tracking-wider font-['Outfit'] border-b border-white/10">
                        <tr>
                            <th className="py-3.5 px-4">Visitor & Status</th>
                            <th className="py-3.5 px-4">Contact Details</th>
                            <th className="py-3.5 px-4">Intent / Service</th>
                            <th className="py-3.5 px-4">Consultation</th>
                            <th className="py-3.5 px-4">Score</th>
                            <th className="py-3.5 px-4">Last Active</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-white/5">
                        {leads.map((l) => (
                            <tr
                                key={l._id || l.visitorId}
                                className="hover:bg-white/[0.02] transition-colors group"
                            >
                                {/* Visitor & Status */}
                                <td className="py-3.5 px-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-white text-xs font-['Outfit']">
                                                {l.name || "Anonymous Visitor"}
                                            </span>
                                            {l.company && (
                                                <span className="text-[11px] text-slate-400">
                                                    @ {l.company}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(l.leadStatus)}
                                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]" title={l.visitorId}>
                                                {l.visitorId}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact Details */}
                                <td className="py-3.5 px-4">
                                    <div className="space-y-0.5">
                                        {l.email ? (
                                            <div className="flex items-center gap-1.5 text-slate-200">
                                                <Mail className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                                <span className="truncate max-w-[160px] font-medium">{l.email}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">No email</span>
                                        )}

                                        {l.whatsapp && (
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <Phone className="w-3 h-3 text-teal-400 flex-shrink-0" />
                                                <span className="truncate max-w-[160px]">{l.whatsapp}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Intent */}
                                <td className="py-3.5 px-4 max-w-[200px]">
                                    <div className="truncate text-slate-200 font-medium" title={l.intent || l.requirement}>
                                        {l.intent || l.requirement || <span className="text-slate-400 italic">General Inquiry</span>}
                                    </div>
                                    {l.interest && (
                                        <span className="text-[10px] text-emerald-400 truncate block">
                                            {l.interest}
                                        </span>
                                    )}
                                </td>

                                {/* Appointment */}
                                <td className="py-3.5 px-4">
                                    {l.appointmentRequested ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            <Calendar className="w-3 h-3" /> Scheduled
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-[11px]">—</span>
                                    )}
                                </td>

                                {/* Score Bar */}
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${
                                                    l.leadScore >= 70 ? 'bg-red-500' :
                                                    l.leadScore >= 40 ? 'bg-amber-400' :
                                                    'bg-emerald-400'
                                                }`}
                                                style={{ width: `${Math.min(Math.max(l.leadScore || 0, 5), 100)}%` }}
                                            />
                                        </div>
                                        <span className="font-bold font-['Outfit'] text-slate-200 text-xs">
                                            {l.leadScore || 0}
                                        </span>
                                    </div>
                                </td>

                                {/* Last Active */}
                                <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                                    {l.lastInteraction ? new Date(l.lastInteraction).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            onClick={() => onViewLead(l)}
                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                                            title="Inspect full conversation"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>Chat ({l.conversation ? l.conversation.length : 0})</span>
                                        </button>

                                        <button
                                            onClick={() => onDeleteLead(l._id || l.visitorId)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                            title="Delete Lead"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
