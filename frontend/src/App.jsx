import React, { useState, useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { getAuthToken, verifyAuthToken, removeAuthToken } from './services/adminApi';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // Listen for browser navigation changes
    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Check if currently stored JWT token is valid on load
    useEffect(() => {
        async function checkAuth() {
            const token = getAuthToken();
            if (!token) {
                setIsAuthenticated(false);
                setIsCheckingAuth(false);
                return;
            }

            try {
                const res = await verifyAuthToken();
                if (res.success) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsCheckingAuth(false);
            }
        }
        checkAuth();
    }, []);

    const handleLoginSuccess = (token, admin) => {
        setIsAuthenticated(true);
        window.history.pushState({}, '', '/admin');
        setCurrentPath('/admin');
    };

    const handleLogout = () => {
        removeAuthToken();
        setIsAuthenticated(false);
        window.history.pushState({}, '', '/admin/login');
        setCurrentPath('/admin/login');
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-[#051522] flex items-center justify-center text-slate-400">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-['Outfit'] font-semibold tracking-wider text-slate-300">
                        Verifying Admin Security Clearance...
                    </span>
                </div>
            </div>
        );
    }

    // If on /admin/login or not authenticated, render Login Page
    if (!isAuthenticated || currentPath === '/admin/login') {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    // Otherwise render Admin Dashboard
    return <AdminDashboard onLogout={handleLogout} />;
}
