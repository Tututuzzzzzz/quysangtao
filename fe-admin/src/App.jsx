import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminNavbar from './components/AdminNavbar';
import KanbanBoard from './components/KanbanBoard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import LoginModal from './components/LoginModal';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020836] flex items-center justify-center text-xs text-[#00FF9D] font-bold">
        Đang khởi tạo Admin Portal Quỹ Sáng Tạo LeadsGen...
      </div>
    );
  }

  // Require login & Admin role check
  if (!user) {
    return <LoginModal isOpen={true} onClose={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#020836] text-slate-100 flex flex-col justify-between">
      <AdminNavbar />
      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={<KanbanBoard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="py-6 bg-[#040C40] border-t border-emerald-500/20 text-center text-xs text-slate-400 font-medium">
        LeadsGen Group © 2026 Admin Portal • AI Innovation Summit Theme
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
