import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  TrendingUp, 
  DollarSign, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  PieChart, 
  Award,
  Layers
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Lỗi tải báo cáo Analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm font-semibold">Đang tải báo cáo Analytics...</div>;
  }

  if (!stats) {
    return <div className="py-20 text-center text-slate-400 text-sm font-semibold">Không có dữ liệu báo cáo</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700/80 border-t-4 border-t-orange-500 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Tổng Sáng Kiến</span>
            <Lightbulb className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {(stats.totalIdeas || 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-slate-400">Đã nộp toàn tập đoàn</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700/80 border-t-4 border-t-emerald-500 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Tổng Tiết Kiệm</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {(stats.totalImplementedSavings || 0).toLocaleString('vi-VN')} <span className="text-sm text-emerald-400 font-bold">VNĐ</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">Tối ưu chi phí thực tế</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700/80 border-t-4 border-t-sky-500 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Dự Án Đã Áp Dụng</span>
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {(stats.implementedCount || 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-sky-400 font-bold">Tỷ lệ chuyển đổi: {stats.conversionRate || 0}%</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700/80 border-t-4 border-t-amber-500 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Đang Thử Nghiệm PoC</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {(stats.testingCount || 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-amber-400 font-bold">Đang cấp vốn thử nghiệm</span>
        </div>
      </div>

      {/* Department Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              <span>Phân Bổ Sáng Kiến Theo Phòng Ban</span>
            </h3>
          </div>
          <div className="space-y-3">
            {stats.departmentIdeaCounts && Object.keys(stats.departmentIdeaCounts).length > 0 ? (
              Object.entries(stats.departmentIdeaCounts).map(([dept, count]) => (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{dept}</span>
                    <span className="text-orange-400 font-mono font-bold">{count} sáng kiến</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      style={{ width: `${Math.min((count / (stats.totalIdeas || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">Chưa có dữ liệu phòng ban</p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Giá Trị Tiết Kiệm Theo Phòng Ban</span>
            </h3>
          </div>
          <div className="space-y-3">
            {stats.departmentSavings && Object.keys(stats.departmentSavings).length > 0 ? (
              Object.entries(stats.departmentSavings).map(([dept, savings]) => (
                <div key={dept} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{dept}</span>
                  <span className="font-mono font-bold text-emerald-400">{savings.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">Chưa có dữ liệu tiết kiệm phòng ban</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
