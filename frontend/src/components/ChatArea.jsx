import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, ArrowUp } from 'lucide-react';
import ChatMessage from './ChatMessage';

const SUGGESTIONS = [
    "What services does GrandEvo offer?",
    "I want to book an appointment demo",
    "Tell me about 24/7 AI Voice Agents",
    "How does GrandEvo automate CRM & workflows?",
    "Pricing and implementation roadmap"
];

export default function ChatArea({ messages, onSendMessage, isTyping }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isTyping) return;
        onSendMessage(trimmed);
        setInput('');
    };

    const handleSuggestionClick = (suggestion) => {
        if (isTyping) return;
        onSendMessage(suggestion);
    };

    return (
        <div className="flex flex-col h-full rounded-2xl bg-[#061e2d]/80 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
            
            {/* Chat Header Bar */}
            <div className="px-5 py-3.5 border-b border-white/10 bg-[#072435]/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                        <h2 className="text-sm font-bold text-white font-['Outfit'] tracking-wide">
                            Live Conversation Session
                        </h2>
                        <span className="text-[11px] text-slate-400">
                            Active with GrandEvo Evo AI
                        </span>
                    </div>
                </div>

                <div className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium font-['Outfit']">
                    Enterprise Concierge
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-white font-['Outfit']">
                            Start a Conversation with Evo
                        </h3>
                        <p className="text-xs max-w-sm text-slate-400">
                            Ask questions about GrandEvo AI agents, request solutions for your business bottlenecks, or schedule a priority consultation.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex items-center gap-3 my-4">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="bg-[#092233]/90 rounded-2xl px-4 py-3 border border-white/10 shadow-lg flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="text-xs text-slate-400 ml-2">Evo is typing...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#051a26]/40 flex gap-2 overflow-x-auto no-scrollbar">
                {SUGGESTIONS.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSuggestionClick(item)}
                        disabled={isTyping}
                        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30 border border-white/10 text-slate-300 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 border-t border-white/10 bg-[#061b27]/80">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Evo about capabilities, workflows, or book a consultation..."
                        disabled={isTyping}
                        className="w-full bg-[#082333] border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-3.5 pr-14 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-emerald-500/20"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2.5 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md shadow-emerald-500/20"
                        title="Send Message"
                    >
                        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </form>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                    <span>Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">Enter</kbd> to send</span>
                    <span>GrandEvo AI Concierge Engine</span>
                </div>
            </div>
        </div>
    );
}
