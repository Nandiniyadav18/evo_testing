import React from 'react';
import { Users, Flame, Calendar, Zap, Award } from 'lucide-react';

export default function StatsGrid({ stats }) {
    const s = stats || {
        totalLeads: 0,
        hotLeads: 0,
        warmLeads: 0,
        appointments: 0,
        avgScore: 0
    };

    const cards = [
        {
            title: "Total Captured Leads",
            value: s.totalLeads,
            sub: "All visitor sessions in MongoDB",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            title: "Hot Leads (Priority)",
            value: s.hotLeads,
            sub: "High buying intent (Score >= 70)",
            icon: Flame,
            color: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            badge: s.hotLeads > 0 ? "Sales Ready" : null
        },
        {
            title: "Appointments Requested",
            value: s.appointments,
            sub: "Consultation & demo meetings",
            icon: Calendar,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            highlight: true
        },
        {
            title: "Warm Inquiries",
            value: s.warmLeads,
            sub: "Specific solution interest",
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20"
        },
        {
            title: "Avg Lead Score",
            value: `${s.avgScore}/100`,
            sub: "Algorithmic qualification average",
            icon: Award,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((c, i) => {
                const Icon = c.icon;
                return (
                    <div
                        key={i}
                        className={`relative rounded-2xl p-4.5 bg-[#072030]/80 border ${c.border} backdrop-blur-xl shadow-lg transition-all hover:translate-y-[-2px]`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400 font-['Outfit'] uppercase tracking-wider">
                                {c.title}
                            </span>
                            <div className={`p-2 rounded-xl ${c.bg} ${c.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
                                {c.value}
                            </span>
                            {c.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                    {c.badge}
                                </span>
                            )}
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1">
                            {c.sub}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
