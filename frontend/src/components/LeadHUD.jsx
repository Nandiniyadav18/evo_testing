import React from 'react';
import { Target, Zap, CheckCircle2, Calendar, Mail, Phone, Building, User, Award } from 'lucide-react';

export default function LeadHUD({ lead, profile }) {
    const score = lead?.score || 0;
    const status = lead?.status || 'Exploring';
    const isAppointment = Boolean(profile?.appointmentRequested);

    // Dynamic color matching
    const getStatusTheme = () => {
        if (status === 'Hot') {
            return {
                bg: 'bg-red-500/15',
                border: 'border-red-500/30',
                text: 'text-red-400',
                bar: 'from-amber-400 to-red-500',
                label: 'High Buying Intent'
            };
        }
        if (status === 'Warm') {
            return {
                bg: 'bg-amber-500/15',
                border: 'border-amber-500/30',
                text: 'text-amber-400',
                bar: 'from-emerald-400 to-amber-400',
                label: 'Service Interest'
            };
        }
        return {
            bg: 'bg-emerald-500/15',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            bar: 'from-teal-400 to-emerald-500',
            label: 'Exploring Solutions'
        };
    };

    const theme = getStatusTheme();

    return (
        <div className="w-full rounded-2xl bg-[#07202f]/80 border border-white/10 p-5 shadow-xl backdrop-blur-xl space-y-4">
            
            {/* HUD Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-['Outfit']">
                        Visitor Intelligence HUD
                    </span>
                </div>

                {/* Status Badge */}
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${theme.bg} ${theme.border} ${theme.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {status}
                </div>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Lead Qualification Score</span>
                    <span className="text-white font-bold font-['Outfit'] text-sm">{score}/100</span>
                </div>
                <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-700 ease-out shadow-[0_0_10px_rgba(33,168,117,0.5)]`}
                        style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
                    />
                </div>
                <p className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{theme.label}</span>
                    {score >= 70 && <span className="text-red-400 font-medium">Sales Priority</span>}
                </p>
            </div>

            {/* Appointment Alert Card */}
            {isAppointment && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 text-xs shadow-inner">
                    <Calendar className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
                    <div>
                        <strong className="text-emerald-300 block font-semibold font-['Outfit']">
                            Consultation Requested!
                        </strong>
                        <span className="text-[11px] text-slate-300">
                            Evo registered your request for an executive meeting.
                        </span>
                    </div>
                </div>
            )}

            {/* Captured Identity Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                
                {/* Name */}
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                        <span className="text-[10px] text-slate-400 block">Name</span>
                        <span className="font-medium text-slate-200 truncate block">
                            {profile?.name || <span className="text-slate-400 italic">Not shared</span>}
                        </span>
                    </div>
                </div>

                {/* Company */}
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                        <span className="text-[10px] text-slate-400 block">Company</span>
                        <span className="font-medium text-slate-200 truncate block">
                            {profile?.company || <span className="text-slate-400 italic">Not shared</span>}
                        </span>
                    </div>
                </div>

                {/* Email */}
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                        <span className="text-[10px] text-slate-400 block">Email</span>
                        <span className="font-medium text-slate-200 truncate block">
                            {profile?.email || <span className="text-slate-400 italic">Pending</span>}
                        </span>
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <div className="truncate">
                        <span className="text-[10px] text-slate-400 block">WhatsApp</span>
                        <span className="font-medium text-slate-200 truncate block">
                            {profile?.whatsapp || <span className="text-slate-400 italic">Pending</span>}
                        </span>
                    </div>
                </div>
            </div>

            {/* Identified Requirement / Intent */}
            {profile?.intent && (
                <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                        Primary Intent
                    </span>
                    <span className="text-slate-200 font-medium">
                        {profile.intent}
                    </span>
                </div>
            )}
        </div>
    );
}
