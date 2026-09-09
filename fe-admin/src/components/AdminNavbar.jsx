import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LeadsGenLogo from './LeadsGenLogo';
import UserProfileModal from './UserProfileModal';
import { 
  Kanban, 
  BarChart3, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  User, 
  ArrowLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/unread-count')
      ]);
      setNotifications(listRes.data);
      setUnreadCount(countRes.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50">
      {/* Top Banner Indicator Bar */}
      <div className="bg-gradient-to-r from-[#020836] via-[#081B7A] to-[#00D285] text-white text-[11px] font-black py-1.5 px-4 border-b border-emerald-500/30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-ping" />
            <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
            <span className="tracking-wider uppercase">PORTAL BAN QUẢN TRỊ & HỘI ĐỒNG THẨM ĐỊNH • LEADSGEN GROUP</span>
          </div>
          <a
            href="http://localhost:5173"
            className="text-xs text-emerald-300 hover:text-white font-extrabold flex items-center space-x-1 underline transition-colors"
          >
            <span>Portal Nhân Viên (localhost:5173)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <nav className="bg-[#020836]/95 backdrop-blur-md text-white border-b border-emerald-500/30 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Admin Badge */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center cursor-pointer">
                <LeadsGenLogo size="md" dark={true} />
              </Link>
              <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-[#00FF9D] border border-emerald-500/40 uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF9D]" />
                <span>ADMIN WORKSPACE</span>
              </span>
            </div>

            {/* Admin Menu Links */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isActive('/')
                    ? 'bg-emerald-500/20 text-[#00FF9D] border border-emerald-500/50 shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Kanban className="w-4 h-4 text-[#00FF9D] shrink-0" />
                <span>Bảng Thẩm Định Kanban</span>
              </Link>

              <Link
                to="/analytics"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isActive('/analytics')
                    ? 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span>Thống Kê Analytics</span>
              </Link>
            </div>

            {/* Profile & Notification Right Actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications Dropdown */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowProfileMenu(false);
                      }}
                      className="p-2.5 rounded-full relative text-slate-300 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <Bell className="w-5 h-5 text-emerald-300" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-[#020836] rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#040C40] text-slate-100 rounded-3xl shadow-2xl border border-emerald-500/30 py-3 z-50">
                        <div className="px-4 py-2 border-b border-emerald-500/20 flex justify-between items-center">
                          <h3 className="font-extrabold text-xs text-[#00FF9D] uppercase tracking-wider">Thông báo thẩm định</h3>
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">{notifications.length} tin</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto divide-y divide-emerald-900/30">
                          {notifications.length === 0 ? (
                            <p className="p-4 text-center text-xs text-slate-400">Không có thông báo mới</p>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="p-3 hover:bg-white/5 text-xs transition-colors">
                                <p className="font-bold text-white">{n.title}</p>
                                <p className="text-slate-300 text-[11px] mt-0.5">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Menu */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => {
                        setShowProfileMenu(!showProfileMenu);
                        setShowNotifications(false);
                      }}
                      className="flex items-center space-x-2 p-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-emerald-500/30 transition-all"
                    >
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                        alt={user.fullName}
                        className="w-7 h-7 rounded-xl object-cover ring-2 ring-[#00FF9D]/40"
                      />
                      <span className="text-xs font-black text-white hidden sm:inline-block max-w-[120px] truncate">
                        {user.fullName}
                      </span>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-[#040C40] text-slate-100 rounded-3xl shadow-2xl border border-emerald-500/30 py-2 z-50">
                        <div className="px-4 py-3 border-b border-emerald-500/20">
                          <p className="text-xs font-black text-white">{user.fullName}</p>
                          <p className="text-[10px] text-[#00FF9D] font-bold uppercase">{user.role}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-200 hover:bg-white/10 flex items-center space-x-2"
                        >
                          <User className="w-4 h-4 text-[#00FF9D]" />
                          <span>Hồ Sơ Cá Nhân</span>
                        </button>
                        <button
                          onClick={logout}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-400 hover:bg-rose-500/20 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng Xuất Admin</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <a
                  href="http://localhost:5173"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-[#020836] font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,157,0.4)] hover:bg-[#00FF9D]"
                >
                  Đăng Nhập Portal Nhân Viên
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showProfileModal && <UserProfileModal onClose={() => setShowProfileModal(false)} />}
    </header>
  );
}
