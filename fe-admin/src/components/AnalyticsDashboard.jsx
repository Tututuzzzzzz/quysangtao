import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  Building2, 
  DollarSign, 
  CheckCircle2,
  Percent,
  Flame
} from 'lucide-react';

const COLORS = ['#F89824', '#F57C00', '#1C8CB5', '#10b981', '#ef4444'];

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-slate-400">Đang tải biểu đồ phân tích dữ liệu...</div>;
  }

  if (!stats) return null;

  // Status breakdown chart data
  const statusChartData = [
    { name: 'Đã Tiếp Nhận', value: stats.receivedCount },
    { name: 'Đang Đánh Giá', value: stats.reviewCount },
    { name: 'Thử Nghiệm', value: stats.testingCount },
    { name: 'Đã Áp Dụng', value: stats.implementedCount },
    { name: 'Từ Chối', value: stats.rejectedCount },
  ];

  // Department counts chart data
  const deptCountData = Object.entries(stats.departmentIdeaCounts || {}).map(([dept, count]) => ({
    department: dept,
    count: count
  }));

  // Department savings chart data
  const deptSavingsData = Object.entries(stats.departmentSavings || {}).map(([dept, savings]) => ({
    department: dept,
    savings: Number(savings) / 1000000 // In Million VND
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600">
            <BarChart3 className="w-6 h-6" />
            <h1 className="text-xl font-extrabold text-slate-900">Báo Cáo & Phân Tích Đổi Mới LeadsGen</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trực quan hóa tỷ lệ chuyển đổi ý tưởng, hiệu suất phòng ban và tác động tiết kiệm ngân sách thực tế.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tổng số ý tưởng thu thập</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalIdeas}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600">Sáng kiến đã áp dụng thực tế</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{stats.implementedCount}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-blue-600">Tỷ lệ chuyển đổi thành công</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <p className="text-3xl font-black text-blue-600">{stats.conversionRate}</p>
            <span className="text-sm font-bold text-blue-600">%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-indigo-600">Tổng giá trị tiết kiệm thực tế</span>
          <p className="text-xl font-extrabold text-indigo-600 mt-1">
            {Number(stats.totalImplementedSavings || 0).toLocaleString('vi-VN')} đ
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-blue-600" />
            <span>Phân Bổ Trạng Thái Vòng Đời Ý Tưởng</span>
          </h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ý tưởng`, 'Số lượng']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Contribution Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Hiệu Suất Đóng Góp Theo Phòng Ban</span>
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptCountData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} ý tưởng`, 'Tổng gửi']} />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} name="Số lượng ý tưởng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Impact & Savings Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Tác Động Ngân Sách - Chi Phí Tiết Kiệm (Triệu VNĐ) Theo Phòng Ban</span>
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSavingsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis formatter={(val) => `${val} Tr`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} Triệu VNĐ`, 'Tiết kiệm']} />
                <Bar dataKey="savings" fill="#10b981" radius={[8, 8, 0, 0]} name="Tiết kiệm dự kiến (Triệu VNĐ)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
