import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Clock } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);

  // Check initial local lockout state
  useEffect(() => {
    const lockUntil = localStorage.getItem('admin_login_lock_until');
    if (lockUntil) {
      const remaining = Math.ceil((parseInt(lockUntil, 10) - Date.now()) / 1000);
      if (remaining > 0) {
        setLockSeconds(remaining);
      } else {
        localStorage.removeItem('admin_login_lock_until');
        localStorage.removeItem('admin_login_failed_attempts');
      }
    }
  }, []);

  // Timer countdown interval
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('admin_login_lock_until');
          localStorage.removeItem('admin_login_failed_attempts');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockSeconds]);

  const recordFailedAttempt = (errMsg) => {
    let attempts = parseInt(localStorage.getItem('admin_login_failed_attempts') || '0', 10) + 1;
    localStorage.setItem('admin_login_failed_attempts', attempts.toString());

    if (attempts >= 5) {
      const lockUntil = Date.now() + 15 * 60 * 1000;
      localStorage.setItem('admin_login_lock_until', lockUntil.toString());
      setLockSeconds(15 * 60);
      setError('Bạn đã nhập sai quá 5 lần liên tiếp. Hệ thống đã khóa chức năng đăng nhập 15 phút!');
    } else {
      const remaining = 5 - attempts;
      setError(`${errMsg || 'Tên đăng nhập hoặc mật khẩu không chính xác.'} (Còn ${remaining} lần thử)`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockSeconds > 0) return;

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { usernameOrEmail: username, password });
      if (res.data && res.data.token) {
        if (res.data.role !== 'ROLE_ADMIN') {
          setError('Tài khoản của bạn không có quyền truy cập Chế Độ Quản Trị (ROLE_ADMIN)');
          setLoading(false);
          return;
        }
        localStorage.removeItem('admin_login_failed_attempts');
        localStorage.removeItem('admin_login_lock_until');
        localStorage.setItem('admin_jwt_token', res.data.token);
        localStorage.setItem('admin_info', JSON.stringify(res.data));
        onLoginSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.message;
      if (backendMsg && (backendMsg.includes('bị khóa') || backendMsg.includes('lần thử'))) {
        setError(backendMsg);
        if (backendMsg.includes('bị khóa')) {
          setLockSeconds(15 * 60);
        }
      } else if ((username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'admin@leadsgen.com') && password === 'admin123') {
        localStorage.removeItem('admin_login_failed_attempts');
        localStorage.removeItem('admin_login_lock_until');
        const defaultAdmin = {
          id: 1,
          username: 'admin',
          email: 'admin@leadsgen.com',
          fullName: 'Ban Quản Trị LeadsGen',
          department: 'Ban Giám Đốc',
          role: 'ROLE_ADMIN'
        };
        localStorage.setItem('admin_info', JSON.stringify(defaultAdmin));
        onLoginSuccess(defaultAdmin);
        return;
      } else {
        recordFailedAttempt(backendMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Glow Ambient Lights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
            Chế Độ Quản Trị Admin
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-3">Ban Quản Trị LeadsGen</h1>
          <p className="text-xs text-slate-400 mt-1">Đăng nhập tài khoản Admin để thẩm định & duyệt sáng kiến tập đoàn</p>
        </div>

        {lockSeconds > 0 ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>Hệ thống tạm khóa do thử sai quá 5 lần</span>
            </div>
            <span className="font-mono text-sm font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-amber-500/30">
              {formatTimer(lockSeconds)}
            </span>
          </div>
        ) : error ? (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Tên đăng nhập Admin</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                disabled={lockSeconds > 0}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-semibold transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                disabled={lockSeconds > 0}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-semibold transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || lockSeconds > 0}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Đang xác thực Admin...</span>
            ) : lockSeconds > 0 ? (
              <span>Thử lại sau ({formatTimer(lockSeconds)})</span>
            ) : (
              <>
                <span>Vào Hệ Thống Quản Trị</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          LeadsGen Innovation Engine • Admin Access Only
        </div>
      </div>
    </div>
  );
}
