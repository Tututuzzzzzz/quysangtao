import React, { useState, useEffect } from 'react';
import api from '../services/api';
import IdeaEvaluationModal from './IdeaEvaluationModal';
import { formatCompactCurrency } from '../utils/formatCurrency';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sliders,
  TrendingUp,
  Tag,
  UserCheck,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Download
} from 'lucide-react';

export default function KanbanBoard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdeaForEvaluation, setSelectedIdeaForEvaluation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterStatus, itemsPerPage, viewMode]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ideas');
      setIdeas(res.data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách sáng kiến:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ideaId, newStatus) => {
    try {
      await api.put(`/admin/ideas/${ideaId}/status`, {
        newStatus: newStatus,
        note: `Chuyển trạng thái sang ${newStatus} từ Admin Console`
      });
      fetchIdeas();
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
      alert('Không thể cập nhật trạng thái. Vui lòng kiểm tra quyền Admin.');
    }
  };

  const handleEvaluationSaved = () => {
    setSelectedIdeaForEvaluation(null);
    fetchIdeas();
  };

  const handleDeleteIdea = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA hẳn sáng kiến ID #${id} không?`)) {
      try {
        await api.delete(`/ideas/${id}`);
        setIdeas((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa sáng kiến:', err);
        alert('Không thể xóa sáng kiến. Vui lòng kiểm tra quyền Admin.');
      }
    }
  };

  const exportToCSV = () => {
    if (filteredIdeas.length === 0) {
      alert('Không có dữ liệu sáng kiến để xuất!');
      return;
    }

    const headers = ['ID', 'Tên Sáng Kiến', 'Tác Giả', 'Phòng Ban', 'Danh Mục', 'Trạng Thái', 'Điểm Thẩm Định', 'Tiết Kiệm (VNĐ)', 'Ngày Tạo'];
    const rows = filteredIdeas.map(item => [
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
  };

  const statusConfig = {
    RECEIVED: { title: '1. Tiếp Nhận', color: 'border-t-orange-500 bg-orange-500/5', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    UNDER_REVIEW: { title: '2. Thẩm Định', color: 'border-t-amber-500 bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    TESTING: { title: '3. Thử Nghiệm PoC', color: 'border-t-sky-500 bg-sky-500/5', badge: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    IMPLEMENTED: { title: '4. Đã Triển Khai', color: 'border-t-emerald-500 bg-emerald-500/5', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    REJECTED: { title: 'Từ Chối', color: 'border-t-red-500 bg-red-500/5', badge: 'bg-red-500/20 text-red-400 border-red-500/30' }
  };

  const columns = [
    { id: 'RECEIVED', ...statusConfig.RECEIVED },
    { id: 'UNDER_REVIEW', ...statusConfig.UNDER_REVIEW },
    { id: 'TESTING', ...statusConfig.TESTING },
    { id: 'IMPLEMENTED', ...statusConfig.IMPLEMENTED },
    { id: 'REJECTED', ...statusConfig.REJECTED }
  ];

  // Extract unique departments for filter
  const departments = ['ALL', ...new Set(ideas.map(i => i.authorDepartment || i.department).filter(Boolean))];

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = 
      (idea.title && idea.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (idea.authorName && idea.authorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (idea.problemDescription && idea.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (idea.id && idea.id.toString().includes(searchTerm));
    
    const matchesDept = filterDepartment === 'ALL' || idea.authorDepartment === filterDepartment || idea.department === filterDepartment;
    const matchesStatus = filterStatus === 'ALL' || idea.status === filterStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate Pagination
  const totalItems = filteredIdeas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedIdeas = filteredIdeas.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Filter & Toolbar Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left: Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm tên, tác giả, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 font-semibold"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 whitespace-nowrap"
            >
              <option value="ALL">Tất cả Phòng Ban</option>
              {departments.filter(d => d !== 'ALL').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 whitespace-nowrap"
            >
              <option value="ALL">Tất cả Trạng Thái</option>
              <option value="RECEIVED">1. Tiếp Nhận</option>
              <option value="UNDER_REVIEW">2. Thẩm Định</option>
              <option value="TESTING">3. PoC Thử Nghiệm</option>
              <option value="IMPLEMENTED">4. Đã Triển Khai</option>
              <option value="REJECTED">Từ Chối</option>
            </select>
          </div>
        </div>

        {/* Right: View Mode Toggle & Actions */}
        <div className="flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
          <div className="text-xs text-slate-400 whitespace-nowrap">
            Tổng số: <strong className="text-amber-400 font-mono font-bold text-sm">{totalItems}</strong> sáng kiến
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ Bảng Kanban"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ Bảng Danh Sách (Có Phân Trang)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Danh Sách</span>
            </button>
          </div>

          <button
            onClick={exportToCSV}
            title="Xuất báo cáo Excel / CSV"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={fetchIdeas}
            title="Tải lại dữ liệu"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-200 text-sm font-bold">Đang tải danh sách sáng kiến...</div>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-slate-300 font-bold text-sm">Không tìm thấy sáng kiến nào phù hợp</p>
          <p className="text-xs text-slate-500">Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn lọc phòng ban.</p>
        </div>
      ) : viewMode === 'kanban' ? (

        /* ==================== KANBAN BOARD VIEW ==================== */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {columns.map(col => {
            const colIdeas = filteredIdeas.filter(i => i.status === col.id);
            return (
              <div key={col.id} className={`rounded-2xl border border-slate-800 border-t-4 ${col.color} p-3 flex flex-col min-h-[500px]`}>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <h3 className="font-extrabold text-xs text-white uppercase tracking-wider whitespace-nowrap">{col.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-extrabold border ${col.badge} shrink-0`}>
                    {colIdeas.length}
                  </span>
                </div>

                {/* Column Scrollable Content */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
                  {colIdeas.length === 0 ? (
                    <div className="py-12 text-center text-slate-600 text-xs italic">Không có sáng kiến</div>
                  ) : (
                    colIdeas.map(idea => (
                      <div
                        key={idea.id}
                        className="p-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 shadow-md hover:border-amber-500/50 transition-all space-y-2.5 relative group"
                      >
                        {/* Header Tags */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 whitespace-nowrap truncate max-w-[120px]">
                            {idea.categoryName || 'Khác'}
                          </span>
                          {idea.score && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap shrink-0">
                              ⭐ {idea.score}/100
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug break-words">{idea.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed break-words">{idea.problemDescription}</p>

                        {/* Financial Savings badge if exists */}
                        {idea.estimatedSavings > 0 && (
                          <div className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 text-[10px] font-semibold">Tiết kiệm:</span>
                            <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                              {formatCompactCurrency(idea.estimatedSavings).fullString}
                            </span>
                          </div>
                        )}

                        {/* Author & Actions Info */}
                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1 min-w-0">
                            <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="font-semibold text-slate-300 truncate max-w-[90px]" title={idea.authorName}>
                              {idea.authorName || 'Công khai'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {idea.attachmentUrl && (
                              <a
                                href={idea.attachmentUrl.startsWith('http') ? idea.attachmentUrl : `https://quysangtao-backend.onrender.com${idea.attachmentUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Xem file: ${idea.attachmentName || 'Tài liệu'}`}
                                className="text-orange-400 hover:text-orange-300 font-bold transition-colors text-[10px] flex items-center gap-0.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                📎 File
                              </a>
                            )}
                            <span className="text-[10px] text-slate-500 font-mono">#{idea.id}</span>
                            <button
                              onClick={() => handleDeleteIdea(idea.id)}
                              title="Xóa sáng kiến"
                              className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="pt-2 grid grid-cols-2 gap-1.5 border-t border-slate-700/40">
                          <button
                            onClick={() => setSelectedIdeaForEvaluation(idea)}
                            className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px] transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            <Sliders className="w-3 h-3 shrink-0" />
                            <span>Chấm điểm</span>
                          </button>

                          <select
                            value={idea.status}
                            onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-slate-300 text-[10px] font-bold rounded-lg px-1 py-1 focus:outline-none focus:border-amber-500 whitespace-nowrap truncate"
                          >
                            <option value="RECEIVED">1. Tiếp Nhận</option>
                            <option value="UNDER_REVIEW">2. Thẩm Định</option>
                            <option value="TESTING">3. PoC</option>
                            <option value="IMPLEMENTED">4. Áp Dụng</option>
                            <option value="REJECTED">Từ Chối</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (

        /* ==================== PROFESSIONAL TABLE VIEW ==================== */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16">ID</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Tên Sáng Kiến</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Tác Giả & Phòng Ban</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Trạng Thái</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-center">Điểm Số</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-right">Tiết Kiệm Dự Kiến</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-center">Tài Liệu</th>
                  <th className="py-3.5 px-4 whitespace-nowrap text-center">Thao Tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedIdeas.map(idea => {
                  const statusInfo = statusConfig[idea.status] || statusConfig.RECEIVED;
                  return (
                    <tr key={idea.id} className="hover:bg-slate-800/50 transition-colors group">
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                        #{idea.id}
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 text-xs sm:text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {idea.title}
                        </div>
                        <div className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                          {idea.problemDescription}
                        </div>
                      </td>

                      {/* Author & Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">{idea.authorName || 'Công khai'}</div>
                        <div className="text-[10px] text-slate-400">{idea.authorDepartment || idea.department || 'Bộ phận khác'}</div>
                      </td>

                      {/* Status Badge & Select */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${statusInfo.badge} whitespace-nowrap`}>
                            {statusInfo.title}
                          </span>
                          <select
                            value={idea.status}
                            onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-slate-300 text-[10px] font-semibold rounded-lg px-1.5 py-1 focus:outline-none focus:border-amber-500"
                          >
                            <option value="RECEIVED">Chuyển: 1. Tiếp Nhận</option>
                            <option value="UNDER_REVIEW">Chuyển: 2. Thẩm Định</option>
                            <option value="TESTING">Chuyển: 3. PoC</option>
                            <option value="IMPLEMENTED">Chuyển: 4. Áp Dụng</option>
                            <option value="REJECTED">Chuyển: Từ Chối</option>
                          </select>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        {idea.score ? (
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ⭐ {idea.score}/100
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Chưa chấm</span>
                        )}
                      </td>

                      {/* Financial Savings */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono font-bold text-emerald-400">
                        {idea.estimatedSavings > 0 ? (
                          formatCompactCurrency(idea.estimatedSavings).fullString
                        ) : (
                          <span className="text-slate-600 text-[11px] font-normal">--</span>
                        )}
                      </td>

                      {/* File attachment */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        {idea.attachmentUrl ? (
                          <a
                            href={idea.attachmentUrl.startsWith('http') ? idea.attachmentUrl : `https://quysangtao-backend.onrender.com${idea.attachmentUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold text-[10px] transition-colors"
                          >
                            <span>📎 Xem File</span>
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Không có</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedIdeaForEvaluation(idea)}
                            className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Chấm điểm</span>
                          </button>
                          <button
                            onClick={() => handleDeleteIdea(idea.id)}
                            title="Xóa sáng kiến"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== PAGINATION BAR ==================== */}
      {!loading && totalItems > 0 && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Item count summary */}
          <div className="text-xs text-slate-400 font-medium">
            Hiển thị <strong className="text-slate-200">{startIndex + 1}</strong> - <strong className="text-slate-200">{endIndex}</strong> trong tổng số <strong className="text-amber-400 font-mono">{totalItems}</strong> sáng kiến
          </div>

          {/* Items per page selector & Pagination controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Hiển thị:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
              </select>
            </div>

            {/* Page navigation buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={validCurrentPage === 1}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 text-xs font-bold text-amber-400 font-mono">
                Trang {validCurrentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={validCurrentPage === totalPages}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {selectedIdeaForEvaluation && (
        <IdeaEvaluationModal
          idea={selectedIdeaForEvaluation}
          onClose={() => setSelectedIdeaForEvaluation(null)}
          onSave={handleEvaluationSaved}
        />
      )}
    </div>
  );
}
