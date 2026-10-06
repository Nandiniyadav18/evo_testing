import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

export default function EvoHologram({ isTyping, lead }) {
    const getMoodText = () => {
        if (isTyping) return "Formulating response...";
        if (lead?.appointmentRequested) return "Priority Consultation Scheduled";
        if (lead?.status === "Hot") return "High-Intent Business Lead";
        if (lead?.status === "Warm") return "Exploring GrandEvo Capabilities";
        return "Standing by 24/7 for Enquiries";
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-6 select-none overflow-hidden">
            
            {/* Ambient Radial Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

            {/* Orbital Rings Container */}
            <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center">
                
                {/* Orbit 1 */}
                <div className="absolute inset-2 border border-emerald-500/20 rounded-full animate-orbit-1 border-dashed">
                    <span className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                </div>

                {/* Orbit 2 */}
                <div className="absolute inset-8 border border-teal-400/25 rounded-full animate-orbit-2">
                    <span className="absolute top-1/3 -right-1 w-2.5 h-2.5 rounded-full bg-teal-300 shadow-[0_0_10px_#5eead4]" />
                </div>

                {/* Orbit 3 */}
                <div className="absolute inset-14 border border-emerald-300/15 rounded-full animate-orbit-3 border-dotted">
                    <span className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-emerald-200 shadow-[0_0_8px_#a7f3d0]" />
                </div>

                {/* Central Evo Hologram Character */}
                <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center animate-float">
                    <img
                        src="/assets/evo-professional.png"
                        alt="Evo — GrandEvo AI Concierge"
                        className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(4,120,87,0.45)] transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </div>

            {/* Live Holographic Status Card */}
            <div className="mt-2 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#082231]/90 border border-emerald-500/30 text-xs text-slate-200 shadow-xl backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium text-emerald-300 font-['Outfit']">
                    {getMoodText()}
                </span>
            </div>
        </div>
    );
}
