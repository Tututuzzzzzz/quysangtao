import React, { useState } from 'react';
import api from '../services/api';
import { X, Award, DollarSign, Tag, Check, AlertCircle } from 'lucide-react';

export default function IdeaEvaluationModal({ idea, onClose, onSave }) {
  const [score, setScore] = useState(idea.score || 85);
  const [tagCategory, setTagCategory] = useState(idea.tagCategory || 'BETTER_WORK');
  const [estimatedSavings, setEstimatedSavings] = useState(idea.estimatedSavings || 50000000);
  const [requiredBudget, setRequiredBudget] = useState(idea.requiredBudget || 10000000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/admin/ideas/${idea.id}/evaluate`, {
        score: parseInt(score, 10),
        tagCategory,
        estimatedSavings: parseFloat(estimatedSavings),
        requiredBudget: parseFloat(requiredBudget)
      });
      onSave();
    } catch (err) {
      console.error(err);
      setError('Không thể lưu thông tin thẩm định. Vui lòng kiểm tra quyền Admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Hội Đồng Thẩm Định LeadsGen</span>
            <h2 className="font-extrabold text-base text-white line-clamp-1">{idea.title}</h2>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Score Range (1 - 100) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Thang điểm sáng tạo (1 - 100)</label>
              <span className="text-sm font-extrabold text-amber-400 font-mono">{score}/100 Điểm</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Tag Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Phân loại Sáng kiến (Tag Category)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTagCategory('BETTER_WORK')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                  tagCategory === 'BETTER_WORK'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                ⚙️ Better Work (Tối ưu Quy trình & AI)
              </button>
              <button
                type="button"
                onClick={() => setTagCategory('BETTER_WORKPLACE')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                  tagCategory === 'BETTER_WORKPLACE'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                🌿 Better Workplace (Môi trường & ESG)
              </button>
            </div>
          </div>

          {/* Savings Financials */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Ước tính chi phí tiết kiệm (VNĐ/năm)</label>
            <input
              type="number"
              value={estimatedSavings}
              onChange={(e) => setEstimatedSavings(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Required Budget */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Vốn đầu tư PoC đề xuất (VNĐ)</label>
            <input
              type="number"
              value={requiredBudget}
              onChange={(e) => setRequiredBudget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Đang lưu...' : 'Lưu Kết Quả Thẩm Định'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
