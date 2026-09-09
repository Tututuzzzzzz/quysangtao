import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lightbulb, 
  DollarSign, 
  FolderKanban, 
  FileText,
  Zap,
  TrendingUp,
  Target,
  Clock,
  Paperclip,
  ShieldCheck,
  Building,
  Users,
  User,
  Flame,
  Award,
  UploadCloud,
  Check
} from 'lucide-react';

const SCOPES = [
  { id: 'PERSONAL', title: 'Cá nhân / Nhóm nhỏ', desc: 'Tối ưu công việc hàng ngày của nhóm', icon: User },
  { id: 'DEPARTMENT', title: 'Toàn Phòng Ban', desc: 'Cải tiến quy trình làm việc cấp bộ phận', icon: Users },
  { id: 'COMPANY', title: 'Toàn Công Ty', desc: 'Sáng kiến quy mô áp dụng toàn LeadsGen', icon: Building },
];

const EFFORTS = [
  { id: 'EASY', title: 'Dễ thực hiện', desc: 'Áp dụng ngay trong 1-2 tuần', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'MEDIUM', title: 'Mức Trung bình', desc: 'Cần phối hợp 1 tháng', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'HIGH', title: 'Mức Phức tạp', desc: 'Triển khai 2-3 tháng', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'STRATEGIC', title: 'Tầm Chiến lược', desc: 'Dự án lớn 3-6 tháng', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

const KPI_TAGS = [
  'Tối ưu quy trình & Năng suất',
  'Tiết kiệm chi phí & Ngân sách',
  'Ứng dụng AI & Công nghệ mới',
  'Môi trường làm việc xanh & Tiện ích',
  'Trải nghiệm Nhân sự & Gắn kết',
  'Tăng doanh thu & Chuyển đổi Sales',
  'An toàn thông tin & Bảo mật'
];

export default function InteractiveIdeaForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    scope: 'DEPARTMENT',
    problemDescription: '',
    proposedSolution: '',
    expectedBenefit: '',
    estimatedSavings: '',
    requiredBudget: '',
    implementationEffort: 'MEDIUM',
    estimatedTimeframe: '1 tháng',
    requiredResources: '',
    selectedKpis: ['Tối ưu quy trình & Năng suất'],
    files: []
  });

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleKpiTag = (tag) => {
    setFormData(prev => {
      const exists = prev.selectedKpis.includes(tag);
      if (exists) {
        return { ...prev, selectedKpis: prev.selectedKpis.filter(t => t !== tag) };
      } else {
        return { ...prev, selectedKpis: [...prev.selectedKpis, tag] };
      }
    });
  };

  const handleSimulatedFileUpload = (e) => {
    const uploaded = Array.from(e.target.files).map(f => f.name);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...uploaded] }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.title.trim() || !formData.categoryId)) {
      setError('Vui lòng điền Tiêu đề và chọn Danh mục cải tiến.');
      return;
    }
    if (step === 2 && (!formData.problemDescription.trim() || !formData.proposedSolution.trim())) {
      setError('Vui lòng mô tả Thực trạng và Giải pháp cụ thể.');
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        categoryId: Number(formData.categoryId),
        scope: formData.scope,
        problemDescription: formData.problemDescription,
        proposedSolution: formData.proposedSolution,
        expectedBenefit: formData.expectedBenefit,
        estimatedSavings: formData.estimatedSavings ? Number(formData.estimatedSavings) : 0,
        requiredBudget: formData.requiredBudget ? Number(formData.requiredBudget) : 0,
        implementationEffort: formData.implementationEffort,
        estimatedTimeframe: formData.estimatedTimeframe,
        requiredResources: formData.requiredResources,
        kpiImpactTags: formData.selectedKpis.join(', '),
      };

      await api.post('/ideas', payload);
      setShowCelebration(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi ý tưởng. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Celebration Modal Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-amber-200 animate-bounce-short">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/30">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Chúc Mừng Bạn! 🎉</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ý tưởng <span className="font-bold text-blue-600">"{formData.title}"</span> đã được ghi nhận vào Quỹ Sáng Tạo LeadsGen. Bạn vừa nhận thêm <span className="font-bold text-amber-600">+50 Điểm Vinh Danh</span>!
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400">Đang chuyển hướng về Bảng Điều Khiển...</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F89824]" />
              <span>Bước {step} / 5 • Conversational Form</span>
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Đóng Góp Sáng Kiến Đổi Mới LeadsGen</h1>
          </div>
          <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-700">
            <Flame className="w-4 h-4 text-amber-500 fill-current" />
            <span>Thưởng +50 Pts khi hoàn thành</span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-6">
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#F89824] via-[#F57C00] to-[#1C8CB5] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-5 text-[11px] font-semibold text-slate-400 mt-2.5 text-center">
            <span className={step >= 1 ? 'text-[#F89824] font-extrabold' : ''}>1. Tổng quan</span>
            <span className={step >= 2 ? 'text-[#F89824] font-extrabold' : ''}>2. Giải pháp</span>
            <span className={step >= 3 ? 'text-[#F89824] font-extrabold' : ''}>3. Thẻ KPI</span>
            <span className={step >= 4 ? 'text-[#F89824] font-extrabold' : ''}>4. Ngân sách</span>
            <span className={step >= 5 ? 'text-[#F89824] font-extrabold' : ''}>5. Xác nhận</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Wizard Form Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80">
        
        {/* STEP 1: General Info & Scope */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-[#F89824]">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-[#F89824]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bước 1: Tên Sáng Kiến & Lĩnh Vực Cải Tiến</h2>
                <p className="text-xs text-slate-500">Hãy đặt tên tiêu đề rõ ràng và chọn phạm vi ảnh hưởng của ý tưởng.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Tiêu đề sáng kiến *</label>
              <input
                type="text"
                placeholder="Ví dụ: Tự động hóa gửi báo cáo doanh số hàng ngày qua Chatbot Telegram..."
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Phân loại nhóm Lĩnh Vực *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleChange('categoryId', cat.id)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      String(formData.categoryId) === String(cat.id)
                        ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <FolderKanban className={`w-5 h-5 mb-2 ${String(formData.categoryId) === String(cat.id) ? 'text-[#F89824]' : 'text-slate-400'}`} />
                    <p className="font-bold text-xs text-slate-900">{cat.name}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Phạm vi tác động dự kiến (Scope)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SCOPES.map((s) => {
                  const Icon = s.icon;
                  const selected = formData.scope === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleChange('scope', s.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selected 
                          ? 'border-[#1C8CB5] bg-sky-50/70 ring-2 ring-sky-500/20 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${selected ? 'text-[#1C8CB5]' : 'text-slate-400'}`} />
                      <p className="font-bold text-xs text-slate-900">{s.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Problem & Detailed Solution */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-indigo-600">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bước 2: Mô Tả Thực Trạng & Giải Pháp Đề Xuất</h2>
                <p className="text-xs text-slate-500">Mô tả rõ bài toán hiện tại và cách thức ý tưởng của bạn giải quyết triệt để.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">1. Vấn đề / Bất cập hiện tại là gì? *</label>
              <textarea
                rows={3}
                placeholder="Mô tả cụ thể thời gian lãng phí, thao tác thủ công, chi phí phát sinh hoặc khó khăn nhân sự..."
                value={formData.problemDescription}
                onChange={(e) => handleChange('problemDescription', e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium text-slate-900 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">2. Giải pháp sáng tạo chi tiết của bạn? *</label>
              <textarea
                rows={4}
                placeholder="Nêu rõ các bước cải tiến, công cụ áp dụng, luồng vận hành mới..."
                value={formData.proposedSolution}
                onChange={(e) => handleChange('proposedSolution', e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium text-slate-900 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">3. Lợi ích cụ thể kỳ vọng mang lại</label>
              <textarea
                rows={2}
                placeholder="Tăng năng suất 30%, tiết kiệm 2 giờ làm việc mỗi ngày, giảm sai sót..."
                value={formData.expectedBenefit}
                onChange={(e) => handleChange('expectedBenefit', e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium text-slate-900 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 3: KPI Tags & Effort Level */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-purple-600">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bước 3: Gắn Thẻ KPI & Mức Độ Công Sức</h2>
                <p className="text-xs text-slate-500">Chọn các chỉ số KPI mà ý tưởng tác động tích cực nhất.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Chọn các Thẻ KPI Tác Động (Chọn nhiều)</label>
              <div className="flex flex-wrap gap-2.5">
                {KPI_TAGS.map((tag) => {
                  const active = formData.selectedKpis.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleKpiTag(tag)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                        active 
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Đánh giá Mức độ Công sức thực hiện</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EFFORTS.map((ef) => {
                  const selected = formData.implementationEffort === ef.id;
                  return (
                    <button
                      key={ef.id}
                      type="button"
                      onClick={() => handleChange('implementationEffort', ef.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selected 
                          ? `${ef.color} ring-2 ring-purple-500/20 font-bold shadow-xs` 
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">{ef.title}</p>
                      <p className="text-[11px] opacity-80 mt-1">{ef.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Budget, Timeline & Attachments */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-emerald-600">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bước 4: Ngân Sách, Lộ Trình & Tài Liệu Đính Kèm</h2>
                <p className="text-xs text-slate-500">Ước tính số tiền tiết kiệm và nguồn lực cần thiết để triển khai.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Tiết kiệm dự kiến (VNĐ / năm)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ví dụ: 100000000 (100 triệu)"
                    value={formData.estimatedSavings}
                    onChange={(e) => handleChange('estimatedSavings', e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-2xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Kinh phí đầu tư ban đầu (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ví dụ: 10000000 (10 triệu) hoặc 0"
                    value={formData.requiredBudget}
                    onChange={(e) => handleChange('requiredBudget', e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-2xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Thời gian hoàn thành dự kiến</label>
              <select
                value={formData.estimatedTimeframe}
                onChange={(e) => handleChange('estimatedTimeframe', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="1-2 tuần">1-2 tuần (Thực hiện nhanh)</option>
                <option value="1 tháng">1 tháng (Trung bình)</option>
                <option value="3-6 tháng">3-6 tháng (Dự án lớn)</option>
                <option value="> 6 tháng">&gt; 6 tháng (Quy mô chiến lược dài hạn)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Nguồn lực & Đội ngũ cần hỗ trợ</label>
              <input
                type="text"
                placeholder="Ví dụ: Cần 1 Nhân sự IT hỗ trợ tạo API + Đội Marketing duyệt nội dung"
                value={formData.requiredResources}
                onChange={(e) => handleChange('requiredResources', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* File Upload Simulation */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Tài liệu đính kèm (Sơ đồ, File Excel, Mockup PDF)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 bg-slate-50/50 transition-all relative">
                <input
                  type="file"
                  multiple
                  onChange={handleSimulatedFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Kéo & Thả tài liệu hoặc Click để tải tệp lên</p>
                <p className="text-[10px] text-slate-400 mt-1">Hỗ trợ PNG, JPG, PDF, XLSX (Tối đa 25MB)</p>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.files.map((file, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center space-x-1">
                      <Paperclip className="w-3 h-3" />
                      <span>{file}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Visual Confirmation Preview */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bước 5: Trực Quan Hóa & Xác Nhận Gửi</h2>
                <p className="text-xs text-slate-500">Kiểm tra lại toàn bộ thẻ sáng kiến trước khi gửi vào Quỹ Sáng Tạo.</p>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-4 border border-indigo-900/60">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider">
                  PREVIEW SÁNG KIẾN
                </span>
                <span className="text-xs text-indigo-300 font-medium">
                  Phạm vi: {SCOPES.find(s => s.id === formData.scope)?.title}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{formData.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.selectedKpis.map((kpi, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-white/15 text-indigo-200 text-[10px] font-semibold">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tiết kiệm dự kiến</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {formData.estimatedSavings ? Number(formData.estimatedSavings).toLocaleString('vi-VN') + ' đ/năm' : 'Chưa nhập'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời gian thực hiện</span>
                  <span className="font-bold text-amber-300 text-sm">{formData.estimatedTimeframe}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-xs space-y-2 text-slate-300">
                <div>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase block">Bài toán thực trạng</span>
                  <p className="line-clamp-2 text-slate-200 text-[11px] mt-0.5">{formData.problemDescription}</p>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase block">Giải pháp đề xuất</span>
                  <p className="line-clamp-2 text-slate-200 text-[11px] mt-0.5">{formData.proposedSolution}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Nav */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold leadsgen-btn-primary flex items-center space-x-2 transition-all ml-auto"
            >
              <span>Tiếp tục (Bước {step + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 flex items-center space-x-2 shadow-xl shadow-amber-500/25 transition-all disabled:opacity-50 ml-auto scale-105"
            >
              {submitting ? (
                <span>Đang gửi sáng kiến...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Xác Nhận & Nộp Bài Ngay (+50 Pts)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
