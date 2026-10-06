import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import StatsGrid from '../components/admin/StatsGrid';
import LeadsFilter from '../components/admin/LeadsFilter';
import LeadsTable from '../components/admin/LeadsTable';
import ConversationModal from '../components/admin/ConversationModal';
import { fetchStats, fetchLeads, deleteLead } from '../services/adminApi';

export default function AdminDashboard({ onLogout }) {
    const [stats, setStats] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [appointmentOnly, setAppointmentOnly] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    // Selected lead for modal conversation view
    const [selectedLead, setSelectedLead] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const [statsRes, leadsRes] = await Promise.all([
                fetchStats(),
                fetchLeads({
                    search,
                    status: statusFilter,
                    appointment: appointmentOnly ? "true" : "false",
                    sortBy
                })
            ]);

            setStats(statsRes.stats);
            setLeads(leadsRes.leads || []);
        } catch (err) {
            console.error("Admin load error:", err);
            if (err.message && (err.message.includes("log in") || err.message.includes("Authentication required") || err.message.includes("Invalid or expired"))) {
                if (onLogout) onLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, appointmentOnly, sortBy, onLogout]);

    // Initial load and filter change trigger
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Polling interval (every 5 seconds if autoRefresh is active)
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            loadData();
        }, 5000);
        return () => clearInterval(interval);
    }, [autoRefresh, loadData]);

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead record from MongoDB?")) {
            return;
        }
        try {
            await deleteLead(id);
            setLeads(prev => prev.filter(l => l._id !== id && l.visitorId !== id));
            loadData();
        } catch (err) {
            alert("Failed to delete lead: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#051522] text-slate-100 flex flex-col font-['Inter'] selection:bg-emerald-500 selection:text-white">
            
            {/* Header */}
            <AdminHeader
                stats={stats}
                loading={loading}
                onRefresh={loadData}
                autoRefresh={autoRefresh}
                setAutoRefresh={setAutoRefresh}
                onLogout={onLogout}
            />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                
                {/* Stats Metric Cards */}
                <StatsGrid stats={stats} />

                {/* Filter & Search Bar */}
                <LeadsFilter
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    appointmentOnly={appointmentOnly}
                    setAppointmentOnly={setAppointmentOnly}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    totalCount={leads.length}
                />

                {/* Leads Table */}
                <LeadsTable
                    leads={leads}
                    onViewLead={(lead) => setSelectedLead(lead)}
                    onDeleteLead={handleDeleteLead}
                />
            </main>

            {/* Conversation Viewer Modal */}
            <ConversationModal
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
            />
        </div>
    );
}
