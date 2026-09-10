import React, { useState, useEffect } from 'react';
import api from '../services/api';
import IdeaEvaluationModal from './IdeaEvaluationModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Sliders,
  DollarSign,
  TrendingUp,
  Tag,
  UserCheck,
  Trash2
} from 'lucide-react';

export default function KanbanBoard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdeaForEvaluation, setSelectedIdeaForEvaluation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/ideas');
      setIdeas(res.data);
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
        note: `Chuyển trạng thái sang ${newStatus} từ Kanban Admin Console`
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
    if (window.confirm(`Bạn có chắc chắn muốn XÓA hẳn sáng kiến ID ${id} không?`)) {
      try {
        await api.delete(`/ideas/${id}`);
        setIdeas((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa sáng kiến:', err);
        alert('Không thể xóa sáng kiến. Vui lòng kiểm tra quyền Admin.');
      }
    }
  };

  const columns = [
    { id: 'RECEIVED', title: '1. Tiếp Nhận', color: 'border-t-orange-500 bg-orange-500/5', badge: 'bg-orange-500/20 text-orange-400' },
    { id: 'UNDER_REVIEW', title: '2. Thẩm Định', color: 'border-t-amber-500 bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-400' },
    { id: 'TESTING', title: '3. Thử Nghiệm PoC', color: 'border-t-sky-500 bg-sky-500/5', badge: 'bg-sky-500/20 text-sky-400' },
    { id: 'IMPLEMENTED', title: '4. Đã Triển Khai', color: 'border-t-emerald-500 bg-emerald-500/5', badge: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'REJECTED', title: 'Từ Chối', color: 'border-t-red-500 bg-red-500/5', badge: 'bg-red-500/20 text-red-400' }
  ];

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idea.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idea.problemDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'ALL' || idea.authorDepartment === filterDepartment || idea.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm sáng kiến, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-slate-400 font-bold">
            Tổng cộng: <strong className="text-amber-400 font-mono">{filteredIdeas.length}</strong> sáng kiến
          </span>
          <button
            onClick={fetchIdeas}
            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all"
          >
            Làm mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm font-semibold">Đang tải dữ liệu Kanban Board...</div>
      ) : (
        /* Kanban 5 Column Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
          {columns.map(col => {
            const colIdeas = filteredIdeas.filter(i => i.status === col.id);
            return (
              <div key={col.id} className={`rounded-2xl border border-slate-800 border-t-4 ${col.color} p-3 min-h-[650px] flex flex-col`}>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">{col.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-extrabold ${col.badge}`}>
                    {colIdeas.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colIdeas.length === 0 ? (
                    <div className="py-10 text-center text-slate-600 text-xs italic">Chưa có sáng kiến</div>
                  ) : (
                    colIdeas.map(idea => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 shadow-md hover:border-slate-500 transition-all space-y-3 relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            {idea.categoryName || 'Khác'}
                          </span>
                          {idea.score && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              ⭐ {idea.score}/100
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">{idea.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{idea.problemDescription}</p>

                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-semibold text-slate-200">{idea.authorName || 'Công khai'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {idea.attachmentUrl && (
                              <a
                                href={idea.attachmentUrl.startsWith('http') ? idea.attachmentUrl : `https://quysangtao-backend.onrender.com${idea.attachmentUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Xem file đính kèm: ${idea.attachmentName || 'Tài liệu'}`}
                                className="text-orange-400 hover:text-orange-300 font-bold transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                📎 File
                              </a>
                            )}
                            <span className="text-[10px] text-slate-500 font-mono">#{idea.id}</span>
                            <button
                              onClick={() => handleDeleteIdea(idea.id)}
                              title="Xóa sáng kiến này"
                              className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Admin Actions */}
                        <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-700/40">
                          <button
                            onClick={() => setSelectedIdeaForEvaluation(idea)}
                            className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px] transition-colors flex items-center gap-1"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Chấm điểm & Ngân sách</span>
                          </button>

                          <select
                            value={idea.status}
                            onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold rounded px-1.5 py-1 focus:outline-none focus:border-amber-500"
                          >
                            <option value="RECEIVED">Chuyển: Tiếp Nhận</option>
                            <option value="UNDER_REVIEW">Chuyển: Thẩm Định</option>
                            <option value="TESTING">Chuyển: PoC</option>
                            <option value="IMPLEMENTED">Chuyển: Duyệt Áp Dụng</option>
                            <option value="REJECTED">Chuyển: Từ Chối</option>
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
      )}

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
