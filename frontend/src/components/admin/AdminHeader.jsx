import React from 'react';
import { Database, RefreshCw, Download, ExternalLink, LogOut, Activity } from 'lucide-react';
import { getExportUrl } from '../../services/adminApi';

export default function AdminHeader({ stats, loading, onRefresh, autoRefresh, setAutoRefresh, onLogout }) {
    const isMongoConnected = stats?.mongodbStatus === 'connected';

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#061927]/90 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                
                {/* Brand & Console Title */}
                <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg shadow-emerald-950/60 border border-emerald-300/30">
                        <span className="font-black text-white text-base tracking-wider font-['Outfit']">GE</span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold tracking-tight text-white font-['Outfit']">
                                GrandEvo <span className="text-emerald-400">Admin Console</span>
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                <Activity className="w-2.5 h-2.5" /> LIVE MONITOR
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Realtime AI Lead Qualification & Conversation Intelligence
                        </p>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    
                    {/* Database Health Pill */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-white/5 text-xs text-slate-300">
                        <Database className={`w-3.5 h-3.5 ${isMongoConnected ? 'text-emerald-400' : 'text-red-400'}`} />
                        <span>MongoDB Atlas:</span>
                        <span className={`font-semibold ${isMongoConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isMongoConnected ? 'Connected' : 'Offline'}
                        </span>
                    </div>

                    {/* Auto-Refresh Toggle */}
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            autoRefresh
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-slate-200'
                        }`}
                        title="Toggle 5-second automatic data polling"
                    >
                        <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        Auto-Sync {autoRefresh ? 'ON' : 'OFF'}
                    </button>

                    {/* Manual Refresh */}
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 transition-all cursor-pointer disabled:opacity-50"
                        title="Refresh now"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                    </button>

                    {/* Export CSV */}
                    <a
                        href={getExportUrl()}
                        download="grandevo_leads.csv"
                        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                        title="Download Leads CSV"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                    </a>

                    {/* Open User Interface */}
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 transition-all cursor-pointer"
                        title="Open User Chat Interface in New Tab"
                    >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">User Chat</span>
                    </a>

                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
                        title="Sign Out of Admin Console"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
