import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Trophy, 
  Building, 
  Mail, 
  CheckCircle2, 
  KeyRound,
  Sparkles,
  Flame,
  Star,
  X
} from 'lucide-react';

export default function UserProfileModal({ onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('badges');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const BADGES = [
    { title: 'Sáng Kiến Đầu Tiên', desc: 'Đã hoàn thành gửi ý tưởng đầu tiên vào Quỹ Sáng Tạo', icon: Sparkles, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { title: 'Nhà Đổi Mới Vàng', desc: 'Tích lũy trên 200 Điểm Vinh Danh Gamification', icon: Trophy, color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { title: 'Chiến Binh Better Work', desc: 'Có ý tưởng áp dụng thực tế tối ưu quy trình', icon: Flame, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { title: 'Thành Viên Tích Cực', desc: 'Tham gia tương tác Feedback Loop liên tục', icon: Star, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  ];

  const modalContent = (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      style={{ margin: 0, top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200 relative z-[10000] my-auto"
      >
        {/* Profile Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.fullName}
              alt="Avatar"
              className="w-14 h-14 rounded-full border-2 border-blue-500 shadow-md"
            />
            <div>
              <h2 className="text-lg font-black text-slate-900">{user?.fullName}</h2>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              <div className="mt-1 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>{user?.role === 'ROLE_ADMIN' ? 'Ban Quản Trị Admin' : 'Nhân Viên ' + user?.department}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'badges' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'}`}
          >
            Huy Hiệu Vinh Danh ({BADGES.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'info' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600'}`}
          >
            Thông Tin Tài Khoản
          </button>
        </div>

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className={`p-4 rounded-2xl border ${b.color} space-y-2 relative overflow-hidden shadow-xs`}>
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 fill-current" />
                    <span className="font-extrabold text-xs">{b.title}</span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed font-medium">{b.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Account Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tên đăng nhập</span>
                <span className="font-bold text-slate-900">{user?.username}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Phòng ban</span>
                <span className="font-bold text-slate-900">{user?.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Quyền hạn hệ thống</span>
                <span className="font-bold text-blue-600">{user?.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
