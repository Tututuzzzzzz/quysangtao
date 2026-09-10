import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../services/api';
import { 
  Kanban as KanbanIcon, 
  Tag, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Filter,
  MessageSquare,
  DollarSign,
  Building,
  Target,
  Flame
} from 'lucide-react';
import IdeaEvaluationModal from './IdeaEvaluationModal';

const COLUMNS = [
  { id: 'RECEIVED', title: '1. Đã Tiếp Nhận', color: 'border-orange-500 bg-orange-50/70 text-orange-900' },
  { id: 'UNDER_REVIEW', title: '2. Đang Đánh Giá', color: 'border-amber-500 bg-amber-50/70 text-amber-900' },
  { id: 'TESTING', title: '3. Thử Nghiệm', color: 'border-sky-500 bg-sky-50/70 text-sky-900' },
  { id: 'IMPLEMENTED', title: '4. Đã Áp Dụng', color: 'border-emerald-500 bg-emerald-50/70 text-emerald-900' },
  { id: 'REJECTED', title: 'Từ Chối / Ngưng', color: 'border-red-500 bg-red-50/70 text-red-900' },
];

export default function KanbanBoard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluationIdea, setSelectedEvaluationIdea] = useState(null);
  const [filterTag, setFilterTag] = useState('ALL');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/admin/ideas');
      setIdeas(res.data);
    } catch (err) {
      console.error('Error fetching admin ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const ideaId = Number(draggableId);
    const newStatus = destination.droppableId;

    // Optimistic UI update
    setIdeas(prev => prev.map(item => {
      if (item.id === ideaId) {
        return { ...item, status: newStatus };
      }
      return item;
    }));

    try {
      await api.put(`/admin/ideas/${ideaId}/status`, {
        newStatus: newStatus,
        note: `Chuyển trạng thái trên bảng Kanban Admin`
      });
    } catch (err) {
      console.error('Error updating status via Kanban drag-and-drop:', err);
      fetchIdeas(); // revert on error
    }
  };

  const handleSaveEvaluation = (updatedIdea) => {
    setIdeas(prev => prev.map(item => item.id === updatedIdea.id ? updatedIdea : item));
    setSelectedEvaluationIdea(null);
  };

  const filteredIdeas = ideas.filter(i => {
    if (filterTag === 'ALL') return true;
    return i.tagCategory === filterTag;
  });

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-8 space-y-6">
      {/* Admin Kanban Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-orange-50 flex items-center justify-center">
              <KanbanIcon className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-xl font-black text-slate-900">Không Gian Làm Việc Kanban Quản Trị</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kéo - thả thẻ ý tưởng để chuyển giai đoạn xử lý. Nhấn vào thẻ để mở công cụ gắn thẻ, chấm điểm và phản hồi.
          </p>
        </div>

        {/* Filter by Tag */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button
            onClick={() => setFilterTag('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterTag === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Tất cả thẻ
          </button>
          <button
            onClick={() => setFilterTag('BETTER_WORK')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterTag === 'BETTER_WORK' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Better Work
          </button>
          <button
            onClick={() => setFilterTag('BETTER_WORKPLACE')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterTag === 'BETTER_WORKPLACE' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Better Workplace
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Đang tải bảng Kanban...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            {COLUMNS.map((col) => {
              const colIdeas = filteredIdeas.filter(i => i.status === col.id);

              return (
                <div key={col.id} className="bg-slate-100/70 rounded-3xl p-4 border border-slate-200/60 min-h-[600px] flex flex-col">
                  {/* Column Title */}
                  <div className={`p-3 rounded-2xl border ${col.color} mb-4 flex justify-between items-center shadow-xs`}>
                    <span className="font-extrabold text-xs">{col.title}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-slate-900 font-black text-[10px] flex items-center justify-center shadow-xs">
                      {colIdeas.length}
                    </span>
                  </div>

                  {/* Droppable Column */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 space-y-3 transition-colors rounded-2xl p-1 ${
                          snapshot.isDraggingOver ? 'bg-indigo-50/50 border-2 border-dashed border-indigo-300' : ''
                        }`}
                      >
                        {colIdeas.map((idea, index) => (
                          <Draggable key={idea.id} draggableId={String(idea.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedEvaluationIdea(idea)}
                                className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 ${
                                  snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-indigo-500' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                    idea.tagCategory === 'BETTER_WORKPLACE'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {idea.tagCategory === 'BETTER_WORKPLACE' ? 'Better Workplace' : 'Better Work'}
                                  </span>

                                  {idea.score && (
                                    <span className="flex items-center space-x-1 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                      <Star className="w-3 h-3 fill-current" />
                                      <span>{idea.score} pts</span>
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2 leading-snug">{idea.title}</h4>

                                <div className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                                  {idea.proposedSolution}
                                </div>

                                {idea.kpiImpactTags && (
                                  <div className="text-[10px] font-semibold text-indigo-600 line-clamp-1">
                                    {idea.kpiImpactTags}
                                  </div>
                                )}

                                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                                  <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                                    <img
                                      src={idea.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + idea.authorName}
                                      alt="Author"
                                      className="w-4 h-4 rounded-full"
                                    />
                                    <span className="truncate max-w-[85px]">{idea.authorName}</span>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    {idea.attachmentUrl && (
                                      <a
                                        href={idea.attachmentUrl.startsWith('http') ? idea.attachmentUrl : `https://quysangtao-backend.onrender.com${idea.attachmentUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`Xem tệp đính kèm: ${idea.attachmentName || 'Tài liệu'}`}
                                        className="text-orange-500 hover:text-orange-600 font-bold transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        📎
                                      </a>
                                    )}
                                    {idea.estimatedSavings > 0 && (
                                      <span className="font-black text-emerald-600 font-mono">
                                        {Number(idea.estimatedSavings).toLocaleString('vi-VN')} đ
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* Idea Evaluation & Tagging Modal */}
      {selectedEvaluationIdea && (
        <IdeaEvaluationModal
          idea={selectedEvaluationIdea}
          onClose={() => setSelectedEvaluationIdea(null)}
          onSave={handleSaveEvaluation}
        />
      )}
    </div>
  );
}
