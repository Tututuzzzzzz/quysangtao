import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminHeader from './components/AdminHeader';
import KanbanBoard from './components/KanbanBoard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('admin_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('kanban');

  const handleLoginSuccess = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_jwt_token');
    localStorage.removeItem('admin_info');
    setAdmin(null);
  };

  if (!admin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <AdminHeader
        admin={admin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      <footer className="py-4 border-t border-slate-800 text-center text-xs text-slate-500">
        LeadsGen Innovation Hub • Admin Control Panel (Port 5174)
      </footer>
    </div>
  );
}
