import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function LeadsFilter({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    appointmentOnly,
    setAppointmentOnly,
    sortBy,
    setSortBy,
    totalCount
}) {
    const tabs = [
        { id: "All", label: "All Leads" },
        { id: "Hot", label: "🔥 Hot", color: "text-red-400" },
        { id: "Warm", label: "⚡ Warm", color: "text-amber-400" },
        { id: "Exploring", label: "🧭 Exploring", color: "text-emerald-400" }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3.5 rounded-2xl bg-[#072030]/80 border border-white/10 backdrop-blur-xl">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, company, email, WhatsApp, or requirement..."
                    className="w-full bg-[#051724] border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => {
                            setStatusFilter(t.id);
                            if (appointmentOnly && t.id !== "All") setAppointmentOnly(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            statusFilter === t.id && !appointmentOnly
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}

                {/* Appointment Filter Tab */}
                <button
                    onClick={() => {
                        setAppointmentOnly(!appointmentOnly);
                        if (!appointmentOnly) setStatusFilter("All");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        appointmentOnly
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                >
                    📅 Consultations Only
                </button>
            </div>

            {/* Sort Dropdown & Count */}
            <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
                    >
                        <option value="newest" className="bg-[#072030] text-slate-200">Newest Activity</option>
                        <option value="score_desc" className="bg-[#072030] text-slate-200">Highest Score</option>
                        <option value="score_asc" className="bg-[#072030] text-slate-200">Lowest Score</option>
                        <option value="oldest" className="bg-[#072030] text-slate-200">Oldest Session</option>
                    </select>
                </div>

                <span className="text-xs text-slate-400 font-['Outfit'] font-semibold hidden sm:inline whitespace-nowrap">
                    {totalCount} leads
                </span>
            </div>
        </div>
    );
}
