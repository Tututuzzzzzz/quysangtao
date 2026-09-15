import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCompactCurrency } from '../utils/formatCurrency';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  PieChart as PieIcon, 
  Award,
  Layers,
  Download,
  Building2
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

  const exportToCSV = async () => {
    try {
      const res = await api.get('/ideas');
      const data = res.data || [];
      if (data.length === 0) {
        alert('Không có dữ liệu sáng kiến để xuất!');
        return;
      }

      const headers = ['ID', 'Tên Sáng Kiến', 'Tác Giả', 'Phòng Ban', 'Danh Mục', 'Trạng Thái', 'Điểm Thẩm Định', 'Tiết Kiệm (VNĐ)', 'Ngày Tạo'];
      const rows = data.map(item => [
        item.id,
        `"${(item.title || '').replace(/"/g, '""')}"`,
        `"${(item.authorName || '').replace(/"/g, '""')}"`,
        `"${(item.authorDepartment || item.department || '').replace(/"/g, '""')}"`,
        `"${(item.categoryName || item.tagCategory || '').replace(/"/g, '""')}"`,
        `"${item.status || ''}"`,
        item.score || 0,
        item.estimatedSavings || 0,
        `"${item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `LeadsGen_Innovation_Hub_Report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Lỗi xuất báo cáo CSV:', err);
      alert('Không thể xuất báo cáo CSV.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-slate-300 text-sm font-bold">Đang tải báo cáo phân tích Analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return <div className="py-20 text-center text-slate-400 text-sm font-semibold">Không có dữ liệu báo cáo</div>;
  }

  const COLORS = ['#f97316', '#0284c7', '#10b981', '#a855f7', '#ec4899', '#eab308', '#06b6d4', '#6366f1'];

  // Status Pie Data
  const statusPieData = [
    { name: '1. Tiếp Nhận', value: stats.receivedCount || 0, color: '#f97316' },
    { name: '2. Thẩm Định', value: stats.underReviewCount || 0, color: '#f59e0b' },
    { name: '3. PoC Thử Nghiệm', value: stats.testingCount || 0, color: '#0284c7' },
    { name: '4. Đã Triển Khai', value: stats.implementedCount || 0, color: '#10b981' },
    { name: 'Từ Chối', value: stats.rejectedCount || 0, color: '#ef4444' }
  ].filter(d => d.value > 0);

  // Department Ideas Pie Data
  const deptIdeasPieData = Object.entries(stats.departmentIdeaCounts || {}).map(([dept, count], idx) => ({
    name: dept,
    value: Number(count),
    color: COLORS[idx % COLORS.length]
  }));

  // Department Savings Pie Data
  const deptSavingsPieData = Object.entries(stats.departmentSavings || {}).map(([dept, savings], idx) => ({
    name: dept,
    value: Number(savings),
    color: COLORS[idx % COLORS.length]
  }));

  const totalIdeasCount = stats.totalIdeas || 1;

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color || data.color }} />
            <span>{data.name}</span>
          </p>
          <p className="text-slate-300 font-mono font-bold">
            {typeof data.value === 'number' && data.value > 10000
              ? formatCompactCurrency(data.value).fullString
              : `${data.value} ${data.name.includes('Tiết') ? 'VNĐ' : 'sáng kiến'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Bar with Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <PieIcon className="w-6 h-6 text-amber-400" />
            <span>Dashboard Báo Cáo Phân Tích & Tác Động Sáng Tạo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Biểu đồ tròn trực quan tỷ lệ phân bổ vòng đời ý tưởng, đóng góp phòng ban và giá trị ngân sách tiết kiệm
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Báo Cáo Excel/CSV</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 border-t-4 border-t-orange-500 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Tổng Sáng Kiến</span>
            <Lightbulb className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {(stats.totalIdeas || 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-slate-400">Đã nộp toàn tập đoàn</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 border-t-4 border-t-emerald-500 space-y-2 whitespace-nowrap min-w-0 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Tổng Tiết Kiệm</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white truncate">
            {formatCompactCurrency(stats.totalImplementedSavings || 0).value}{' '}
            <span className="text-sm text-emerald-400 font-bold">{formatCompactCurrency(stats.totalImplementedSavings || 0).unit}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold">Tối ưu chi phí thực tế</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 border-t-4 border-t-sky-500 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Dự Án Đã Áp Dụng</span>
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {(stats.implementedCount || 0).toLocaleString('vi-VN')}
          </div>
          <span className="text-[11px] text-sky-400 font-bold">Tỷ lệ chuyển đổi: {stats.conversionRate || 0}%</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 border-t-4 border-t-amber-500 space-y-2 shadow-lg">
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

      {/* Professional Pie / Doughnut Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart 1: Status Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-orange-400" />
              <span>Phân Bổ Trạng Thái Vòng Đời Ý Tưởng</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400 font-mono">Doughnut Chart</span>
          </div>

          {statusPieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
                {/* Center Stats Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black font-mono text-white">{stats.totalIdeas || 0}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Ý Tưởng</span>
                </div>
              </div>

              {/* Custom Legend Box */}
              <div className="w-full sm:w-56 space-y-2 shrink-0">
                {statusPieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-semibold truncate text-[11px]">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white text-xs shrink-0 ml-2">
                      {item.value} ({Math.round((item.value / totalIdeasCount) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-12 text-center">Chưa có dữ liệu trạng thái ý tưởng</p>
          )}
        </div>

        {/* Pie Chart 2: Department Ideas Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Tỷ Lệ Đóng Góp Ý Tưởng Theo Phòng Ban</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400 font-mono">Doughnut Chart</span>
          </div>

          {deptIdeasPieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={deptIdeasPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {deptIdeasPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
                {/* Center Stats Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black font-mono text-sky-400">{deptIdeasPieData.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Phòng Ban</span>
                </div>
              </div>

              {/* Custom Legend Box */}
              <div className="w-full sm:w-56 space-y-2 shrink-0 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {deptIdeasPieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-semibold truncate text-[11px]" title={item.name}>{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-sky-400 text-xs shrink-0 ml-2">
                      {item.value} ý tưởng
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-12 text-center">Chưa có dữ liệu phòng ban</p>
          )}
        </div>
      </div>

      {/* Pie Chart 3: Department Financial Savings Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Phân Bổ Giá Trị Tiết Kiệm Chi Phí Theo Phòng Ban</span>
          </h3>
          <span className="text-[11px] font-bold text-emerald-400 font-mono">Financial Breakdown</span>
        </div>

        {deptSavingsPieData.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <div className="w-full lg:w-1/2 h-72 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={deptSavingsPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deptSavingsPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Tổng Ngân Sách</span>
                <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">
                  {formatCompactCurrency(stats.totalImplementedSavings || 0).fullString}
                </span>
              </div>
            </div>

            {/* Detailed Financial Breakdown Cards */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deptSavingsPieData.map((item) => (
                <div key={item.name} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-slate-200 truncate">{item.name}</span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-400 text-xs shrink-0 ml-2">
                    {formatCompactCurrency(item.value).fullString}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-10 text-center">Chưa có dữ liệu tiết kiệm ngân sách phòng ban</p>
        )}
      </div>
    </div>
  );
}
