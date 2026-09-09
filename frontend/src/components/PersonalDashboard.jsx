import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  Eye, 
  Send, 
  Award, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  AlertCircle
} from 'lucide-react';

export default function PersonalDashboard() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      const res = await api.get('/ideas/my');
      setIdeas(res.data);
    } catch (err) {
      console.error('Error fetching my ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (idea) => {
    setSelectedIdea(idea);
    try {
      const res = await api.get(`/ideas/${idea.id}/feedbacks`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedIdea) return;
    try {
      const res = await api.post(`/ideas/${selectedIdea.id}/feedbacks`, {
        content: newComment,
        type: 'GENERAL'
      });
      setFeedbacks(prev => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'RECEIVED': return 1;
      case 'UNDER_REVIEW': return 2;
      case 'TESTING': return 3;
      case 'IMPLEMENTED': return 4;
      case 'REJECTED': return -1;
      default: return 1;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECEIVED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">1. Đã Tiếp Nhận</span>;
      case 'UNDER_REVIEW':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">2. Đang Đánh Giá</span>;
      case 'TESTING':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">3. Thử Nghiệm</span>;
      case 'IMPLEMENTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">4. Đã Áp Dụng</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">Từ Chối</span>;
      default:
        return null;
    }
  };

  const filteredIdeas = ideas.filter(i => {
    if (filterStatus === 'ALL') return true;
    return i.status === filterStatus;
  });

  const implementedCount = ideas.filter(i => i.status === 'IMPLEMENTED').length;
  const totalSavings = ideas.reduce((acc, curr) => acc + (curr.estimatedSavings || 0), 0);
  const totalScore = implementedCount * 100 + ideas.length * 20;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Sleek Hero Card with User Achievement Level */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-label-sm font-bold uppercase tracking-wider border border-white/30 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-200" />
                <span>Level 3 • Nhà Đổi Mới Vàng</span>
              </span>
              <span className="text-xs text-white/90 font-semibold">• {user?.department || 'Khối Sản Phẩm'}</span>
            </div>

            <h1 className="font-headline-xl text-3xl font-extrabold text-white tracking-tight">
              Xin chào, {user?.fullName || 'Đồng nghiệp'} 👋
            </h1>
            <p className="font-body-md text-white/90 text-sm leading-relaxed">
              Bảng điều khiển cá nhân hóa theo dõi hành trình đóng góp sáng kiến, điểm số tích lũy Gamification và tác động chi phí thực tế cho LeadsGen.
            </p>

            {/* Level progress bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-[11px] font-label-sm font-bold text-amber-100 mb-1">
                <span>Tiến trình lên Level 4 (Chuyên Gia Sáng Tạo)</span>
                <span className="font-mono-metric">{totalScore} / 500 Pts</span>
              </div>
              <div className="h-2.5 w-full bg-black/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-300 via-amber-200 to-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalScore / 500) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              to="/submit"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-orange-600 font-label-md font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4 fill-current text-orange-500" />
              <span>Gửi Sáng Kiến Mới (+50 Pts)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-label-sm font-bold text-slate-400 uppercase tracking-wider">Tổng ý tưởng</span>
          <p className="font-mono-metric text-3xl font-bold text-slate-900">{ideas.length}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-label-sm font-bold text-amber-600 uppercase tracking-wider">Đang xét duyệt</span>
          <p className="font-mono-metric text-3xl font-bold text-amber-600">
            {ideas.filter(i => i.status === 'UNDER_REVIEW' || i.status === 'TESTING').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-label-sm font-bold text-emerald-600 uppercase tracking-wider">Đã chính thức áp dụng</span>
          <p className="font-mono-metric text-3xl font-bold text-emerald-600">{implementedCount}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-label-sm font-bold text-sky-600 uppercase tracking-wider">Giá trị đóng góp dự kiến</span>
          <p className="font-mono-metric text-xl font-bold text-sky-600">
            {totalSavings.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
      </div>

      {/* Ideas Progress Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-headline-md text-lg font-bold text-slate-900">Lịch Sử Ý Tưởng & Tiến Trình Trạng Thái</h2>
            <p className="font-body-sm text-xs text-slate-500 mt-0.5">Thanh tiến trình 4 giai đoạn thể hiện quy trình thẩm định từ ý tưởng đến thực tế.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-label-md font-semibold text-slate-600">
            {['ALL', 'RECEIVED', 'UNDER_REVIEW', 'TESTING', 'IMPLEMENTED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterStatus === status ? 'bg-white text-orange-600 shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                {status === 'ALL' && 'Tất cả'}
                {status === 'RECEIVED' && '1. Tiếp nhận'}
                {status === 'UNDER_REVIEW' && '2. Đánh giá'}
                {status === 'TESTING' && '3. Thử nghiệm'}
                {status === 'IMPLEMENTED' && '4. Áp dụng'}
                {status === 'REJECTED' && 'Từ chối'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-label-md">Đang tải danh sách ý tưởng...</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-500">Chưa có ý tưởng nào trong nhóm này.</p>
            <Link to="/submit" className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 hover:underline font-label-md">
              <span>Gửi sáng kiến mới để tích lũy điểm ngay</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredIdeas.map((idea) => {
              const stepIndex = getStatusStepIndex(idea.status);
              const isRejected = idea.status === 'REJECTED';

              return (
                <div 
                  key={idea.id} 
                  className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200 hover:bg-white hover:shadow-lg transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                          idea.tagCategory === 'BETTER_WORKPLACE'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {idea.tagCategory === 'BETTER_WORKPLACE' ? 'Better Workplace' : 'Better Work'}
                        </span>

                        {idea.kpiImpactTags && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                            {idea.kpiImpactTags.split(',')[0]}
                          </span>
                        )}

                        <span className="text-xs text-slate-400 font-medium">#{idea.id} • {idea.categoryName}</span>
                      </div>
                      <h3 className="font-headline-sm text-base font-bold text-slate-900">{idea.title}</h3>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {getStatusBadge(idea.status)}
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(idea)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-1 shadow-xs transition-colors font-label-md"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Xem Chi Tiết</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Stepper Progress */}
                  {!isRejected ? (
                    <div className="pt-2">
                      <div className="relative">
                        <div className="overflow-hidden h-2.5 mb-3 text-xs flex rounded-full bg-slate-200">
                          <div
                            style={{ width: `${(stepIndex / 4) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-500 via-amber-500 to-sky-500 transition-all duration-700"
                          />
                        </div>
                        <div className="grid grid-cols-4 text-[11px] font-semibold font-label-md">
                          <div className={`text-left ${stepIndex >= 1 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                            1. Đã tiếp nhận
                          </div>
                          <div className={`text-center ${stepIndex >= 2 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                            2. Đang đánh giá
                          </div>
                          <div className={`text-center ${stepIndex >= 3 ? 'text-sky-600 font-bold' : 'text-slate-400'}`}>
                            3. Thử nghiệm
                          </div>
                          <div className={`text-right ${stepIndex >= 4 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                            4. Áp dụng
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Ý tưởng chưa phù hợp giai đoạn này. Nhấn "Xem Chi Tiết" để đọc lý do từ Ban Quản Trị.</span>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-200/60 gap-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ngày gửi: {new Date(idea.createdAt).toLocaleDateString('vi-VN')}</span>
                    </span>

                    {idea.estimatedSavings > 0 && (
                      <span className="font-mono-metric font-bold text-emerald-600 flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Tiết kiệm: {Number(idea.estimatedSavings).toLocaleString('vi-VN')} đ/năm</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      {selectedIdea && createPortal(
        <div 
          onClick={() => setSelectedIdea(null)}
          className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          style={{ margin: 0, top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative z-[10000] my-auto font-sans"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-label-sm font-bold text-orange-600 uppercase tracking-wider">Chi Tiết Sáng Kiến #{selectedIdea.id}</span>
                <h2 className="font-headline-md text-xl font-bold text-slate-900 mt-1">{selectedIdea.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIdea(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-label-sm font-bold uppercase text-slate-400">Phạm vi</span>
                  <p className="font-bold text-slate-800">{selectedIdea.scope || 'Toàn phòng ban'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-label-sm font-bold uppercase text-slate-400">Thời gian triển khai</span>
                  <p className="font-bold text-amber-600">{selectedIdea.estimatedTimeframe || '1 tháng'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-label-sm font-bold text-slate-400 uppercase tracking-wider text-[10px]">1. Vấn đề thực trạng</h4>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-2xl mt-1 leading-relaxed">{selectedIdea.problemDescription}</p>
              </div>

              <div>
                <h4 className="font-label-sm font-bold text-slate-400 uppercase tracking-wider text-[10px]">2. Giải pháp đề xuất</h4>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-2xl mt-1 leading-relaxed">{selectedIdea.proposedSolution}</p>
              </div>

              {selectedIdea.expectedBenefit && (
                <div>
                  <h4 className="font-label-sm font-bold text-slate-400 uppercase tracking-wider text-[10px]">3. Lợi ích mang lại</h4>
                  <p className="text-slate-700 bg-slate-50 p-3.5 rounded-2xl mt-1 leading-relaxed">{selectedIdea.expectedBenefit}</p>
                </div>
              )}
            </div>

            {/* Internal Feedback Loop */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="font-headline-sm text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <span>Trao đổi & Phản hồi Nội bộ (Internal Feedback Loop)</span>
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {feedbacks.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-3">Chưa có ý kiến phản hồi nào.</p>
                ) : (
                  feedbacks.map((fb) => (
                    <div key={fb.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900">{fb.author?.fullName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(fb.createdAt).toLocaleDateString('vi-VN')} {new Date(fb.createdAt).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-slate-700">{fb.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Nhập phản hồi hoặc làm rõ thông tin..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 flex items-center space-x-1 shadow-xs cursor-pointer font-label-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
