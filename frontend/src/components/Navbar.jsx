import React from 'react';
import { Sparkles, RefreshCw, Database, Bot, UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar({ health, lead, onResetChat, onToggleDrawer }) {
    const isOnline = health?.status === 'online';
    const isMongoConnected = health?.mongodb === 'connected';

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#051724]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                
                {/* Brand Logo & Name */}
                <div className="flex items-center gap-3.5">
                    <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg shadow-emerald-950/50 border border-emerald-300/30">
                        <span className="font-extrabold text-white text-base tracking-wider font-['Outfit']">GE</span>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#051724]"></span>
                        </span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold tracking-tight text-white font-['Outfit']">
                                GrandEvo <span className="text-emerald-400">Evo</span>
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Sparkles className="w-2.5 h-2.5" /> 24/7 AI Concierge
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            "Your Business Never Sleeps"
                        </p>
                    </div>
                </div>

                {/* Right Status Indicators & Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                    
                    {/* Live System Diagnostics Pill */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            {isOnline ? 'Online' : 'Reconnecting...'}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400" title={`MongoDB: ${health?.mongodb || 'unknown'}`}>
                            <Database className={`w-3 h-3 ${isMongoConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
                            Atlas
                        </span>
                    </div>

                    {/* Lead Intelligence Button */}
                    <button
                        onClick={onToggleDrawer}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 transition-all cursor-pointer shadow-sm"
                        title="View Realtime Visitor Intelligence"
                    >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Lead Intelligence</span>
                        <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                            lead?.status === 'Hot' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            lead?.status === 'Warm' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                            {lead?.score || 0} pts
                        </span>
                    </button>

                    {/* Reset Session Button */}
                    <button
                        onClick={onResetChat}
                        className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 transition-all cursor-pointer"
                        title="Reset Conversation"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
