import React from 'react';
import { ShieldCheck, LogOut, LayoutDashboard, Kanban, ExternalLink } from 'lucide-react';

export default function AdminHeader({ admin, activeTab, setActiveTab, onLogout }) {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand logo & Admin indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://static.ybox.vn/2025/7/4/1753954730921-LeadsgenLogo2.png"
              alt="Logo"
              className="h-8 w-auto bg-white p-1 rounded-lg"
            />
            <span className="font-extrabold text-lg text-white tracking-tight">LeadsGen ADMIN</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> PORT 5174
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden md:block" />

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'kanban'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Bảng Thẩm Định (Kanban)</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Báo Cáo Analytics</span>
            </button>
          </nav>
        </div>

        {/* Right: User info & Actions */}
        <div className="flex items-center space-x-4">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>Mở Landing Page (Port 5173)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">{admin?.fullName || 'Ban Quản Trị'}</span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase">{admin?.department || 'Admin Portal'}</span>
            </div>
            <button
              onClick={onLogout}
              title="Đăng xuất Admin"
              className="p-2 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
