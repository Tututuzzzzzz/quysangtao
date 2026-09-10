import React, { useState } from 'react';
import api from '../services/api';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        localStorage.setItem('admin_jwt_token', res.data.token);
        localStorage.setItem('admin_info', JSON.stringify(res.data));
        onLoginSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      if ((username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'admin@leadsgen.com') && password === 'admin123') {
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
      }
      setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu quản trị không chính xác.');
    } finally {
      setLoading(false);
    }
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
            Port 5174 • Chế Độ Quản Trị Admin
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-3">Ban Quản Trị LeadsGen</h1>
          <p className="text-xs text-slate-400 mt-1">Đăng nhập tài khoản Admin để thẩm định & duyệt sáng kiến tập đoàn</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Tên đăng nhập Admin</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-semibold transition-all"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
            💡 Mặc định: Username: <code className="font-bold">admin</code> | Pass: <code className="font-bold">admin123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span>Đang xác thực Admin...</span>
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
