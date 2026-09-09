import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LeadsGenLogo from './LeadsGenLogo';
import { ShieldCheck, UserCheck, Sparkles, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function LoginModal({ onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('leadsgen_remembered_user');
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      if (rememberMe) {
        localStorage.setItem('leadsgen_remembered_user', username);
      } else {
        localStorage.removeItem('leadsgen_remembered_user');
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (usr, pwd) => {
    setLoading(true);
    setError('');
    try {
      await login(usr, pwd);
      if (rememberMe) {
        localStorage.setItem('leadsgen_remembered_user', usr);
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError('Đăng nhập nhanh thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200/80 space-y-6">
        {/* Company Official Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <LeadsGenLogo size="lg" />
          <p className="text-xs text-slate-500 font-medium">Hệ thống Đổi Mới & Quản Trị Sáng Kiến Nội Bộ</p>
        </div>

        {/* Demo Quick Login Shortcut Buttons */}
        <div className="bg-orange-50/70 rounded-2xl p-4 border border-orange-200/80 space-y-3">
          <div className="flex items-center space-x-1.5 text-orange-700 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-[#F89824]" />
            <span>Đăng Nhập Trải Nghiệm Demo LeadsGen:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('nvm', '123456')}
              className="px-3 py-2.5 rounded-xl bg-white border border-orange-200 text-slate-800 text-xs font-bold hover:bg-orange-100 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Nhân Viên (nvm)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin (admin)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">Tên đăng nhập / Email</label>
            <div className="relative">
              <input
                type="text"
                placeholder="nvm hoặc admin@leadsgen.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-10 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#F89824] focus:ring-orange-500/20 accent-[#F89824]"
              />
              <span>Ghi nhớ tên đăng nhập</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Vui lòng liên hệ Ban Quản Trị LeadsGen (innovation@leadsgen.com) để được hỗ trợ đặt lại mật khẩu.')}
              className="text-orange-600 hover:text-orange-700 hover:underline font-semibold"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl leadsgen-btn-primary text-white text-xs font-extrabold transition-all disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập Hệ Thống'}
          </button>
        </form>
      </div>
    </div>
  );
}

