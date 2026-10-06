import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../services/adminApi';

export default function AdminLogin({ onLoginSuccess }) {
    const [email, setEmail] = useState('admin@grandevo.com');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginAdmin(email, password);
            if (data.token) {
                onLoginSuccess(data.token, data.admin);
            }
        } catch (err) {
            setError(err.message || 'Invalid administrator credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#051522] text-slate-100 flex items-center justify-center p-4 relative font-['Inter'] selection:bg-emerald-500 selection:text-white overflow-hidden">
            
            {/* Ambient Background Glows & Grid */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div 
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px'
                    }}
                />
                <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-emerald-500/15 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-[130px]" />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#061e2e]/85 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
                
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-xl shadow-emerald-950/60 border border-emerald-300/30 mb-2">
                        <span className="font-black text-white text-xl tracking-wider font-['Outfit']">GE</span>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-white font-['Outfit']">
                        GrandEvo <span className="text-emerald-400">Admin Portal</span>
                    </h2>

                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Authenticate with JWT to access the live conversation & lead monitoring intelligence console.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs animate-shake">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 font-['Outfit']">
                            Administrator Email
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@grandevo.com"
                                className="w-full bg-[#051724] border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 font-['Outfit']">
                            Master Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#051724] border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Demo Hint Box */}
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                        <div>
                            <span className="text-emerald-400 font-semibold block">Configured Credentials:</span>
                            <span className="font-mono text-slate-300">admin@grandevo.com / admin123</span>
                        </div>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                <span>Verifying JWT Credentials...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In to Dashboard</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Back to User Chat */}
                <div className="text-center pt-2">
                    <a
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to Public Assistant Interface</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
