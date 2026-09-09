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
  { id: 'RECEIVED', title: '1. Đã Tiếp Nhận', color: 'border-orange-500/50 bg-orange-950/40 text-orange-300' },
  { id: 'UNDER_REVIEW', title: '2. Đang Đánh Giá', color: 'border-amber-500/50 bg-amber-950/40 text-amber-300' },
  { id: 'TESTING', title: '3. Thử Nghiệm', color: 'border-cyan-500/50 bg-cyan-950/40 text-[#00E5FF]' },
  { id: 'IMPLEMENTED', title: '4. Đã Áp Dụng', color: 'border-emerald-500/50 bg-emerald-950/40 text-[#00FF9D]' },
  { id: 'REJECTED', title: 'Từ Chối / Ngưng', color: 'border-rose-500/50 bg-rose-950/40 text-rose-300' },
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
      <div className="glass-card-summit rounded-3xl p-6 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
              <KanbanIcon className="w-5 h-5 text-[#00FF9D]" />
            </div>
            <h1 className="text-xl font-black text-white">Không Gian Làm Việc Kanban Quản Trị</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Kéo - thả thẻ ý tưởng để chuyển giai đoạn xử lý. Nhấn vào thẻ để mở công cụ gắn thẻ, chấm điểm và phản hồi.
          </p>
        </div>

        {/* Filter by Tag */}
        <div className="flex items-center space-x-2 bg-[#020836] p-1.5 rounded-2xl text-xs font-bold border border-emerald-500/30">
          <Filter className="w-3.5 h-3.5 text-emerald-400 ml-2" />
          <button
            onClick={() => setFilterTag('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterTag === 'ALL' ? 'bg-[#00FF9D] text-[#020836] shadow-xs font-black' : 'text-slate-300 hover:text-white'}`}
          >
            Tất cả thẻ
          </button>
          <button
            onClick={() => setFilterTag('BETTER_WORK')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterTag === 'BETTER_WORK' ? 'bg-[#00E5FF] text-[#020836] shadow-xs font-black' : 'text-slate-300 hover:text-white'}`}
          >
            Better Work
          </button>
          <button
            onClick={() => setFilterTag('BETTER_WORKPLACE')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterTag === 'BETTER_WORKPLACE' ? 'bg-cyan-400 text-[#020836] shadow-xs font-black' : 'text-slate-300 hover:text-white'}`}
          >
            Better Workplace
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-emerald-400 font-bold">Đang tải bảng Kanban AI Summit Admin...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            {COLUMNS.map((col) => {
              const colIdeas = filteredIdeas.filter(i => i.status === col.id);

              return (
                <div key={col.id} className="bg-[#051040]/80 rounded-3xl p-4 border border-emerald-500/20 min-h-[600px] flex flex-col shadow-lg">
                  {/* Column Title */}
                  <div className={`p-3 rounded-2xl border ${col.color} mb-4 flex justify-between items-center shadow-xs backdrop-blur-md`}>
                    <span className="font-black text-xs uppercase tracking-wider">{col.title}</span>
                    <span className="w-5 h-5 rounded-full bg-[#020836] text-[#00FF9D] font-black text-[10px] flex items-center justify-center border border-emerald-500/40">
                      {colIdeas.length}
                    </span>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 rounded-2xl p-1 transition-colors ${
                          snapshot.isDraggingOver ? 'bg-emerald-950/40 border border-dashed border-[#00FF9D]' : ''
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
                                className={`bg-[#040C40] p-4 rounded-2xl border border-emerald-500/20 mb-3 hover:border-[#00FF9D]/60 transition-all cursor-pointer shadow-md space-y-3 relative group ${
                                  snapshot.isDragging ? 'shadow-2xl border-[#00FF9D] scale-102 bg-[#081B7A]' : ''
                                }`}
                              >
                                {/* Category Badge */}
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                                    {idea.categoryName || 'Sáng Kiến'}
                                  </span>
                                  {idea.score > 0 && (
                                    <span className="text-[10px] font-extrabold text-[#00FF9D] bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-500/40">
                                      <Star className="w-3 h-3 fill-[#00FF9D]" />
                                      <span>{idea.score}đ</span>
                                    </span>
                                  )}
                                </div>

                                {/* Title */}
                                <h3 className="text-xs font-black text-white leading-snug group-hover:text-[#00FF9D] transition-colors line-clamp-2">
                                  {idea.title}
                                </h3>

                                {/* Tag Pill */}
                                {idea.tagCategory && (
                                  <div>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider ${
                                      idea.tagCategory === 'BETTER_WORK'
                                        ? 'bg-emerald-500/20 text-[#00FF9D] border border-emerald-500/40'
                                        : 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/40'
                                    }`}>
                                      {idea.tagCategory === 'BETTER_WORK' ? '⚡ Better Work' : '🌱 Better Workplace'}
                                    </span>
                                  </div>
                                )}

                                {/* Author & Stats Footer */}
                                <div className="pt-2 border-t border-emerald-900/30 flex items-center justify-between text-[11px] text-slate-400">
                                  <div className="flex items-center space-x-1.5">
                                    <img
                                      src={idea.authorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                                      alt={idea.authorName}
                                      className="w-4 h-4 rounded-full object-cover ring-1 ring-emerald-500/30"
                                    />
                                    <span className="truncate max-w-[90px] font-medium text-slate-300">{idea.authorName}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                                    <span className="flex items-center space-x-0.5">
                                      <Flame className="w-3 h-3 text-emerald-400" />
                                      <span>{idea.likeCount}</span>
                                    </span>
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

      {/* Modal Evaluation & Score Details */}
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
