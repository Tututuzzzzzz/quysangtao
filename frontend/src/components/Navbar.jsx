import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import UserProfileModal from './UserProfileModal';
import { 
  Bell, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2,
  RefreshCw,
  User,
  Award
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, switchAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userScore, setUserScore] = useState(0);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUserScore();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUserScore = async () => {
    try {
      const res = await api.get('/analytics/leaderboard');
      if (res.data && Array.isArray(res.data)) {
        const found = res.data.find(item => item.userId === user.id || item.fullName === user.fullName);
        if (found) {
          setUserScore(found.totalScore || 0);
          return;
        }
      }
      setUserScore(user.points || user.totalScore || 0);
    } catch {
      setUserScore(user.points || user.totalScore || 0);
    }
  };

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

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchAccount = async () => {
    const nextRole = user?.role === 'ROLE_ADMIN' ? 'ROLE_EMPLOYEE' : 'ROLE_ADMIN';
    await switchAccount(nextRole);
    navigate('/');
  };

  const handleNavAnchor = (e, hash) => {
    if (location.pathname === '/landing' || location.pathname === '/') {
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/' + hash);
    }
  };

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition-all duration-300">
      <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo & Slogan */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="h-11 px-2.5 py-1 rounded-xl bg-white ring-1 ring-orange-500/30 group-hover:ring-orange-500/70 shadow-sm flex items-center justify-center transition-all shrink-0">
            <img
              alt="LeadsGen Logo"
              className="h-7 w-auto object-contain"
              src="https://static.ybox.vn/2025/7/4/1753954730921-LeadsgenLogo2.png"
            />
          </div>
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-base md:text-lg tracking-tight font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors whitespace-nowrap">
                LeadsGen
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-label-sm text-[10px] uppercase tracking-wider font-bold border border-orange-200 whitespace-nowrap">
                INNOVATION HUB
              </span>
            </div>
            <span className="font-body-sm text-xs text-slate-500 hidden sm:inline whitespace-nowrap">
              Quỹ Đổi mới & Ươm mầm Sáng kiến
            </span>
          </div>
        </Link>

        {/* Center: Smooth Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 font-label-md text-sm font-semibold shrink-0">
          <a
            href="#why-what"
            onClick={(e) => handleNavAnchor(e, '#why-what')}
            className="text-slate-600 hover:text-orange-600 transition-colors py-1.5 whitespace-nowrap"
          >
            Về Quỹ
          </a>
          <a
            href="#criteria"
            onClick={(e) => handleNavAnchor(e, '#criteria')}
            className="text-slate-600 hover:text-orange-600 transition-colors py-1.5 whitespace-nowrap"
          >
            Tiêu chí
          </a>
          <a
            href="#leaderboard"
            onClick={(e) => handleNavAnchor(e, '#leaderboard')}
            className="text-slate-600 hover:text-orange-600 transition-colors py-1.5 whitespace-nowrap"
          >
            Bảng vàng
          </a>
          <a
            href="#faqs"
            onClick={(e) => handleNavAnchor(e, '#faqs')}
            className="text-slate-600 hover:text-orange-600 transition-colors py-1.5 whitespace-nowrap"
          >
            Câu hỏi thường gặp
          </a>
        </nav>
      </div>
    </header>
  );
}
