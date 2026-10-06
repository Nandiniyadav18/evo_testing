import React, { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';

export default function ChatMessage({ message }) {
    const isBot = message.role === 'bot' || message.role === 'assistant';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Format bullet points and bold styling
    const renderFormattedText = (text) => {
        if (!text) return null;
        
        const lines = text.split('\n');
        return lines.map((line, idx) => {
            if (!line.trim()) {
                return <div key={idx} className="h-2" />;
            }

            // Bullet points
            const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
            const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, '') : line;

            // Simple regex parser for **bold**
            const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
            const content = parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            if (isBullet) {
                return (
                    <div key={idx} className="flex items-start gap-2.5 my-1.5 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <span className="text-slate-200 leading-relaxed text-sm">{content}</span>
                    </div>
                );
            }

            return (
                <p key={idx} className="leading-relaxed text-sm my-1 text-slate-200">
                    {content}
                </p>
            );
        });
    };

    return (
        <div className={`flex gap-3 my-4 group ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
            
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                isBot 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border border-emerald-400/30' 
                    : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 border border-slate-600/30'
            }`}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 shadow-lg ${
                isBot
                    ? 'bg-[#092233]/90 text-slate-200 border border-white/10 backdrop-blur-md rounded-tl-sm'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-tr-sm shadow-emerald-950/40'
            }`}>
                
                {/* Header label for Bot */}
                {isBot && (
                    <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-white/5">
                        <span className="text-[11px] font-semibold text-emerald-400 tracking-wide font-['Outfit'] flex items-center gap-1.5">
                            EVO CONCIERGE
                        </span>
                        <button
                            onClick={handleCopy}
                            className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            title="Copy message"
                        >
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                )}

                {/* Formatted Message Body */}
                <div className="space-y-0.5">
                    {renderFormattedText(message.content)}
                </div>

                {/* Timestamp */}
                {message.timestamp && (
                    <div className={`text-[10px] mt-2 text-right ${isBot ? 'text-slate-500' : 'text-emerald-200/80'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </div>
        </div>
    );
}
