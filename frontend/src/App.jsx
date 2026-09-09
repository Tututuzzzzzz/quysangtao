import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import PersonalDashboard from './components/PersonalDashboard';
import InteractiveIdeaForm from './components/InteractiveIdeaForm';
import LeaderboardView from './components/LeaderboardView';
import LoginModal from './components/LoginModal';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-700 font-bold font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Đang kết nối Cổng Quỹ Sáng Tạo LeadsGen...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Main Landing Page as Root */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Login Page */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginModal />} />

          {/* Protected Employee Routes */}
          <Route path="/dashboard" element={user ? <PersonalDashboard /> : <LoginModal />} />
          <Route path="/submit" element={user ? <InteractiveIdeaForm /> : <LoginModal />} />
          <Route path="/leaderboard" element={user ? <LeaderboardView /> : <LoginModal />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
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
