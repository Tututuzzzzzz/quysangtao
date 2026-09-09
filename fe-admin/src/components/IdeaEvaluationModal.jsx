import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { 
  Star, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Send, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  Building,
  X
} from 'lucide-react';

export default function IdeaEvaluationModal({ idea, onClose, onSave }) {
  const [tagCategory, setTagCategory] = useState(idea.tagCategory || 'BETTER_WORK');
  const [score, setScore] = useState(idea.score || 85);
  const [saving, setSaving] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState('GENERAL');

  useEffect(() => {
    fetchFeedbacks();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idea, onClose]);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get(`/ideas/${idea.id}/feedbacks`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEvaluation = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/admin/ideas/${idea.id}/evaluate`, {
        tagCategory,
        score: Number(score)
      });
      onSave(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (newStatus, defaultNote) => {
    setSaving(true);
    try {
      const res = await api.put(`/admin/ideas/${idea.id}/status`, {
        newStatus,
        note: defaultNote
      });
      onSave(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/ideas/${idea.id}/feedbacks`, {
        content: comment,
        type: commentType
      });
      setFeedbacks(prev => [...prev, res.data]);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const modalContent = (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      style={{ margin: 0, top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200 relative z-[10000] my-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black text-[#0052FF] uppercase tracking-wider">Đánh Giá & Gắn Thẻ Sáng Kiến #{idea.id}</span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">{idea.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Tác giả: <span className="font-bold text-slate-800">{idea.authorName}</span> ({idea.authorDepartment})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Phạm vi</span>
            <span className="font-extrabold text-slate-800">{idea.scope || 'Toàn phòng ban'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Thời gian</span>
            <span className="font-extrabold text-amber-600">{idea.estimatedTimeframe || '1 tháng'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Tiết kiệm dự kiến</span>
            <span className="font-extrabold text-emerald-600">
              {idea.estimatedSavings ? Number(idea.estimatedSavings).toLocaleString('vi-VN') + ' đ' : 'Chưa nhập'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Đầu tư ban đầu</span>
            <span className="font-extrabold text-slate-700">
              {idea.requiredBudget ? Number(idea.requiredBudget).toLocaleString('vi-VN') + ' đ' : '0 đ'}
            </span>
          </div>
        </div>

        {/* Content detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">1. Bất cập / Thực trạng</span>
            <p className="text-slate-700 leading-relaxed font-medium">{idea.problemDescription}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">2. Giải pháp đề xuất</span>
            <p className="text-slate-700 leading-relaxed font-medium">{idea.proposedSolution}</p>
          </div>
        </div>

        {/* Tagging & Scoring Section */}
        <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 space-y-4">
          <div className="flex items-center space-x-2 text-[#0052FF] font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Công Cụ Đánh Giá & Gắn Thẻ Phân Loại</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tagging */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Phân loại (Tagging)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTagCategory('BETTER_WORK')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tagCategory === 'BETTER_WORK'
                      ? 'leadsgen-btn-primary shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Better Work
                </button>
                <button
                  type="button"
                  onClick={() => setTagCategory('BETTER_WORKPLACE')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tagCategory === 'BETTER_WORKPLACE'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Better Workplace
                </button>
              </div>
            </div>

            {/* Scoring Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Chấm điểm chất lượng (1-100)</label>
                <span className="text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {score} pts
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus('IMPLEMENTED', 'Ý tưởng xuất sắc! Duyệt đưa vào áp dụng thực tế.')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Duyệt Áp Dụng</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('REJECTED', 'Cần bổ sung tính khả thi trước khi xem xét lại.')}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Từ Chối</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveEvaluation}
              disabled={saving}
              className="px-5 py-2 rounded-xl leadsgen-btn-primary font-bold text-xs shadow-xs cursor-pointer"
            >
              {saving ? 'Đang lưu...' : 'Lưu Điểm & Thẻ'}
            </button>
          </div>
        </div>

        {/* Feedback Loop Comments */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-[#0052FF]" />
            <span>Luồng Phản Hồi Nội Bộ (Internal Feedback Loop)</span>
          </h3>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {feedbacks.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-2">Chưa có bình luận trao đổi nào.</p>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
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

          <form onSubmit={handleAddFeedback} className="space-y-2 pt-1">
            <div className="flex gap-2">
              <select
                value={commentType}
                onChange={(e) => setCommentType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none"
              >
                <option value="GENERAL">Trao đổi chung</option>
                <option value="CLARIFICATION_REQUEST">Yêu cầu làm rõ thông tin</option>
                <option value="APPROVAL_NOTE">Lý do duyệt</option>
                <option value="REJECTION_REASON">Lý do từ chối</option>
              </select>

              <input
                type="text"
                placeholder="Nhập nội dung phản hồi gửi tới nhân viên..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl leadsgen-btn-primary font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
