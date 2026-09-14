import React, { useState, useRef } from 'react';
import api from '../../services/api';
import { getAttachmentCloudFrontUrl } from '../../utils/s3Uploader';

export default function IdeaBuilderWizard() {
  // Confetti explosion canvas
  const confettiCanvasRef = useRef(null);
  const fireConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#f97316', '#ff6b00', '#fb923c', '#0284c7', '#38bdf8', '#0ea5e9'];

    for (let i = 0; i < 120; i++) {
      confettiPieces.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: Math.random() * 9 + 5,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frames = 0;
    function renderConfetti() {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frames++;

        confettiPieces.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35;
          p.vx *= 0.98;
          p.rotation += p.rotationSpeed;
          p.opacity -= 0.007;

          if (p.opacity > 0) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(p.opacity, 0);
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
          }
        });

        if (frames < 180) {
          requestAnimationFrame(renderConfetti);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      } catch (err) {
        console.warn("Confetti canvas notice:", err);
      }
    }
    renderConfetti();
  };

  // Idea Builder Multi-Step Wizard Controller
  const [wizardStep, setWizardStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Fields State
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submitterPhone, setSubmitterPhone] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [department, setDepartment] = useState("Khối Công nghệ & Sản phẩm");
  const [customDepartment, setCustomDepartment] = useState("");
  const [workingUnit, setWorkingUnit] = useState("Trụ sở chính");

  const [ideaTitle, setIdeaTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Sản phẩm & Công nghệ");
  const [problemText, setProblemText] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Co-authors for CC email list
  const [coauthors, setCoauthors] = useState([]);
  const [coauthorNameInput, setCoauthorNameInput] = useState("");
  const [coauthorEmailInput, setCoauthorEmailInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');

  const stepLabels = {
    1: "Bước 1/5: Người đăng ký (Submitter Info)",
    2: "Bước 2/5: Tên & Lĩnh vực ý tưởng (Idea Title & Category)",
    3: "Bước 3/5: Vấn đề & Giải pháp (Core Solution)",
    4: "Bước 4/5: Đồng tác giả CC & Đính kèm (Team & Media)",
    5: "Bước 5/5: Xem trước & Gửi Quỹ Sáng Tạo (Preview & Launch)",
    6: "Hoàn tất: Đã gửi tới Ban Quản trị Quỹ Sáng Tạo!"
  };

  const stepPercents = {
    1: "20%",
    2: "40%",
    3: "60%",
    4: "80%",
    5: "100%",
    6: "100%"
  };

  const handleFormatText = (type) => {
    const textarea = document.getElementById('input-solution');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = solutionText.substring(start, end);
    let replacement = '';
    let cursorOffset = 0;

    switch (type) {
      case 'B':
        if (selectedText) {
          replacement = `**${selectedText}**`;
          cursorOffset = replacement.length;
        } else {
          replacement = '**Văn bản in đậm**';
          cursorOffset = replacement.length - 2;
        }
        break;
      case 'I':
        if (selectedText) {
          replacement = `*${selectedText}*`;
          cursorOffset = replacement.length;
        } else {
          replacement = '*Văn bản in nghiêng*';
          cursorOffset = replacement.length - 1;
        }
        break;
      case 'list':
        if (selectedText) {
          replacement = selectedText.split('\n').map(line => line.startsWith('- ') ? line : `- ${line}`).join('\n');
          cursorOffset = replacement.length;
        } else {
          replacement = '\n- Ý thứ nhất\n- Ý thứ hai\n';
          cursorOffset = replacement.length;
        }
        break;
      case 'link':
        if (selectedText) {
          replacement = `[${selectedText}](https://...)`;
          cursorOffset = replacement.length;
        } else {
          replacement = '[Tiêu đề link](https://...)';
          cursorOffset = replacement.length;
        }
        break;
      default:
        return;
    }

    const newText = solutionText.substring(0, start) + replacement + solutionText.substring(end);
    setSolutionText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 50);
  };

  const goToStep = (targetStep) => {
    setErrorMessage("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    // Validation when advancing from step 1
    if (targetStep > 1 && wizardStep === 1) {
      if (!submitterName.trim()) {
        setErrorMessage("Lỗi nhập liệu ở Bước 1: Vui lòng nhập Họ và tên người đăng ký!");
        return;
      }
      if (!submitterEmail.trim()) {
        setErrorMessage("Lỗi nhập liệu ở Bước 1: Vui lòng nhập Email liên hệ!");
        return;
      } else if (!emailRegex.test(submitterEmail.trim())) {
        setErrorMessage("Lỗi định dạng ở Bước 1: Địa chỉ Email không đúng định dạng! (Ví dụ hợp lệ: name@leadsgen.com)");
        return;
      }
      if (!submitterPhone.trim()) {
        setErrorMessage("Lỗi nhập liệu ở Bước 1: Vui lòng nhập Số điện thoại liên hệ!");
        return;
      } else if (!phoneRegex.test(submitterPhone.trim())) {
        setErrorMessage("Lỗi định dạng ở Bước 1: Số điện thoại không đúng định dạng Việt Nam! (Ví dụ hợp lệ: 0912345678)");
        return;
      }
      if (!employeeCode.trim()) {
        setErrorMessage("Lỗi nhập liệu ở Bước 1: Vui lòng nhập Mã nhân viên (Ví dụ: NV0123)!");
        return;
      }
    }

    // Validation when advancing from step 2
    if (targetStep > 2 && (wizardStep === 2 || (targetStep > wizardStep && wizardStep < 2))) {
      if (!ideaTitle.trim()) {
        setErrorMessage("Lỗi nhập liệu ở Bước 2: Vui lòng nhập Tên ý tưởng đề xuất!");
        return;
      }
    }

    // Validation when advancing from step 3
    if (targetStep > 3 && (wizardStep === 3 || (targetStep > wizardStep && wizardStep < 3))) {
      if (!problemText.trim()) {
        setErrorMessage("Lỗi nhập liệu ở Bước 3: Vui lòng nhập Vấn đề thực tế cần khắc phục!");
        return;
      }
      if (!solutionText.trim()) {
        setErrorMessage("Lỗi nhập liệu ở Bước 3: Vui lòng nhập Phương án thực thi & Giải pháp đề xuất!");
        return;
      }
    }

    setWizardStep(targetStep);

    const builderSection = document.getElementById('idea-builder');
    if (builderSection) {
      builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Co-author handlers
  const addCoauthor = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!coauthorNameInput.trim()) {
      setErrorMessage("Vui lòng nhập Họ tên thành viên đồng tác giả!");
      return;
    }
    if (!coauthorEmailInput.trim() || !emailRegex.test(coauthorEmailInput.trim())) {
      setErrorMessage("Vui lòng nhập Email đồng tác giả đúng định dạng! (Ví dụ: nam.tran@leadsgen.com)");
      return;
    }
    setErrorMessage("");
    setCoauthors((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: coauthorNameInput.trim(),
        email: coauthorEmailInput.trim()
      }
    ]);
    setCoauthorNameInput('');
    setCoauthorEmailInput('');
  };

  const removeCoauthor = (id) => {
    setCoauthors((prev) => prev.filter((c) => c.id !== id));
  };

  // Submit idea handler
  const handleLaunchIdea = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    if (!submitterName.trim()) {
      setErrorMessage("Lỗi ở Bước 1: Vui lòng nhập Họ và tên người đăng ký!");
      goToStep(1);
      return;
    }
    if (!submitterEmail.trim() || !emailRegex.test(submitterEmail.trim())) {
      setErrorMessage("Lỗi ở Bước 1: Email không đúng định dạng (Ví dụ: name@leadsgen.com)!");
      goToStep(1);
      return;
    }
    if (!submitterPhone.trim() || !phoneRegex.test(submitterPhone.trim())) {
      setErrorMessage("Lỗi ở Bước 1: Số điện thoại không đúng định dạng (Ví dụ: 0912345678)!");
      goToStep(1);
      return;
    }
    if (!employeeCode.trim()) {
      setErrorMessage("Lỗi ở Bước 1: Vui lòng nhập Mã nhân viên (Ví dụ: NV0123)!");
      goToStep(1);
      return;
    }
    if (!ideaTitle.trim()) {
      setErrorMessage("Lỗi ở Bước 2: Vui lòng nhập Tên ý tưởng!");
      goToStep(2);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    const finalDept = department === 'Khác' ? (customDepartment.trim() || 'Phòng ban khác') : department;
    const coauthorEmailsList = coauthors.map((c) => c.email).filter(Boolean);

    let backendAttachmentUrl = null;
    let backendAttachmentName = null;

    if (uploadedFile) {
      try {
        backendAttachmentUrl = await getAttachmentCloudFrontUrl(uploadedFile, api);
        if (backendAttachmentUrl) {
          backendAttachmentName = uploadedFile.name;
        }
      } catch (err) {
        console.warn("Upload S3/CloudFront notice:", err);
      }
    }

    const ideaData = {
      title: ideaTitle,
      categoryId: 1,
      problemDescription: problemText.trim() || 'Tối ưu hoá quy trình làm việc và giải quyết vướng mắc thực tế tại đơn vị.',
      proposedSolution: solutionText.trim() || 'Triển khai giải pháp ứng dụng công nghệ và chuẩn hoá các bước thực thi.',
      expectedBenefit: "Tối ưu thời gian phê duyệt và nâng cao năng suất",
      department: finalDept,
      submitterName: submitterName,
      submitterEmail: submitterEmail,
      submitterPhone: submitterPhone,
      employeeCode: employeeCode.trim().toUpperCase(),
      workingUnit: workingUnit,
      coauthorEmails: coauthorEmailsList.join(','),
      attachmentUrl: backendAttachmentUrl,
      attachmentName: backendAttachmentName
    };

    const formData = new FormData();
    formData.append("_subject", `[Quỹ Sáng Tạo LeadsGen] Đề xuất sáng kiến mới: ${ideaTitle}`);
    formData.append("_template", "table");
    formData.append("_captcha", "false");
    formData.append("1. Họ tên người đăng ký", submitterName);
    formData.append("2. Email liên hệ", submitterEmail);
    formData.append("3. Mã nhân viên", employeeCode.trim().toUpperCase());
    formData.append("3. Số điện thoại", submitterPhone);
    formData.append("4. Phòng ban công tác", finalDept);
    formData.append("5. Đơn vị / Chi nhánh", workingUnit);
    formData.append("6. Tên sáng kiến", ideaTitle);
    formData.append("7. Lĩnh vực trọng tâm", selectedCategory);
    formData.append("8. Vấn đề giải quyết", problemText || "(Chưa nhập)");
    formData.append("9. Phương án thực thi", solutionText || "(Chưa nhập)");
    formData.append("10. Đồng tác giả CC", coauthorEmailsList.join(', ') || "Nộp cá nhân");

    if (coauthorEmailsList.length > 0) {
      formData.append("_cc", coauthorEmailsList.join(','));
    }

    if (backendAttachmentUrl) {
      formData.append("11. Link xem/tải ảnh đính kèm (CloudFront CDN)", backendAttachmentUrl);
    } else if (uploadedFile) {
      formData.append("11. Tên file đính kèm", uploadedFile.name);
    }

    // Dispatch requests concurrently
    Promise.allSettled([
      api.post('/ideas', ideaData, { timeout: 15000 }).catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          console.warn("Backend validation response:", err.response.data.message);
        }
      }),
      fetch("https://formsubmit.co/ajax/hoangthotudev@gmail.com", {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: formData
      }).catch(err => console.warn("FormSubmit notice:", err))
    ]);

    setTimeout(() => {
      const code = '#LEADSGEN-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedCode(code);
      setIsSubmitting(false);
      setWizardStep(6);
      fireConfetti();
    }, 600);
  };

  return (
    <>
      {/* FLOATING CENTER-SCREEN POPUP WARNING MODAL (Soft & Gentle Theme) */}
      {errorMessage && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="bg-white text-slate-800 w-full max-w-md p-6 rounded-3xl border border-orange-200/80 shadow-2xl shadow-slate-900/15 relative flex flex-col gap-4 animate-scale-up">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center text-xl shrink-0">
                  ⚠️
                </div>
                <div>
                  <h4 className="font-bold text-xs text-orange-600 uppercase tracking-wider">
                    Lưu ý nhập liệu
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  const builder = document.getElementById('idea-builder');
                  if (builder) builder.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Đã hiểu & Sửa thông tin</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFETTI CANVAS */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      />

      {/* IDEA BUILDER SECTION */}
      <section id="idea-builder" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-xl p-4 sm:p-8 md:p-12 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* Wizard Top Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-label-sm text-xs font-semibold border border-orange-200">
                <span className="material-symbols-outlined text-[16px]">rocket</span>
                <span>LEADSGEN IDEA BUILDER • BIỂU MẪU ĐÓNG GÓP SÁNG KIẾN</span>
              </div>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Gửi trực tiếp tới Ban Quản trị Quỹ Sáng Tạo</h2>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 relative z-10">
            <div className="flex items-center justify-between text-xs font-label-md mb-2">
              <span className="font-bold text-orange-600 transition-all duration-300">
                {stepLabels[wizardStep] || stepLabels[5]}
              </span>
              <span className="text-slate-500 font-mono-metric font-semibold transition-all duration-300">
                {stepPercents[wizardStep] || "100%"} Hoàn thành
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-sky-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: stepPercents[wizardStep] || "100%" }}
              />
            </div>

            {/* Step Navigation Dots */}
            <div className="grid grid-cols-5 gap-1.5 mt-3 text-center">
              {[
                { num: 1, label: 'Đăng ký' },
                { num: 2, label: 'Ý tưởng' },
                { num: 3, label: 'Giải pháp' },
                { num: 4, label: 'Đồng tác giả' },
                { num: 5, label: 'Xem & Gửi' }
              ].map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => goToStep(s.num)}
                  className={`flex flex-col items-center gap-1 group focus:outline-none ${
                    wizardStep === 6 || s.num <= wizardStep ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      wizardStep === 6 || s.num <= wizardStep
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold hidden sm:inline transition-colors ${
                      wizardStep === 6 || s.num <= wizardStep ? 'text-orange-600' : 'text-slate-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* WIZARD SLIDER CONTAINER (CLEAN 100% CONTAINER PER SLIDE) */}
          <div className="relative w-full overflow-hidden min-h-[420px]">
            <div
              className="wizard-slider-track"
              style={{ transform: `translateX(${(wizardStep - 1) * -100}%)` }}
            >
              {/* SLIDE 1: BƯỚC 1: THÔNG TIN NGƯỜI ĐĂNG KÝ */}
              <div className="wizard-slide px-1">
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-headline-md text-lg font-bold text-slate-900">
                      Bước 1: Thông tin người đăng ký sáng kiến
                    </h3>
                    <p className="font-body-sm text-xs text-slate-500 mt-0.5">
                      Nhập thông tin cá nhân/đại diện để Ban Quản trị Quỹ liên hệ và phản hồi kết quả sơ loại.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="submitter-name">
                        Họ và tên người đăng ký <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">person</span>
                        <input
                          id="submitter-name"
                          type="text"
                          value={submitterName}
                          onChange={(e) => setSubmitterName(e.target.value)}
                          placeholder="VD: Nguyễn Văn Anh"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Employee Code */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="employee-code">
                        Mã nhân viên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">badge</span>
                        <input
                          id="employee-code"
                          type="text"
                          value={employeeCode}
                          onChange={(e) => setEmployeeCode(e.target.value)}
                          placeholder="VD: NV01234"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium uppercase"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="submitter-email">
                        Email liên hệ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">mail</span>
                        <input
                          id="submitter-email"
                          type="email"
                          value={submitterEmail}
                          onChange={(e) => setSubmitterEmail(e.target.value)}
                          placeholder="VD: anh.nguyen@leadsgen.com"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="submitter-phone">
                        Số điện thoại liên hệ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">call</span>
                        <input
                          id="submitter-phone"
                          type="tel"
                          value={submitterPhone}
                          onChange={(e) => setSubmitterPhone(e.target.value)}
                          placeholder="VD: 0987654321"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="submitter-department">
                        Phòng ban / Khối làm việc <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">domain</span>
                        <select
                          id="submitter-department"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium bg-white"
                        >
                          <option value="Khối Công nghệ & Sản phẩm">Khối Công nghệ & Sản phẩm</option>
                          <option value="Khối Vận hành & Cung ứng">Khối Vận hành & Cung ứng</option>
                          <option value="Khối Kinh doanh & Marketing">Khối Kinh doanh & Marketing</option>
                          <option value="Khối Phân tích Dữ liệu">Khối Phân tích Dữ liệu</option>
                          <option value="Khối Tài chính & Nhân sự">Khối Tài chính & Nhân sự</option>
                          <option value="Khác">Khác (Nhập chi tiết bên dưới)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Write-in Department if "Khác" selected */}
                  {department === 'Khác' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="custom-dept">
                        Tên phòng ban / bộ phận cụ thể:
                      </label>
                      <input
                        id="custom-dept"
                        type="text"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        placeholder="Gõ tên phòng ban của bạn..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
                      />
                    </div>
                  )}

                  {/* Working Unit */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1" htmlFor="working-unit">
                      Đơn vị công tác / Chi nhánh:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">location_city</span>
                      <input
                        id="working-unit"
                        type="text"
                        value={workingUnit}
                        onChange={(e) => setWorkingUnit(e.target.value)}
                        placeholder="VD: Trụ sở Hà Nội, Chi nhánh TP.HCM, LeadsGen Tech Hub..."
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-label-md font-bold shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
                    >
                      <span>Tiếp tục: Nhập ý tưởng</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 2: BƯỚC 2: TÊN & LĨNH VỰC Ý TƯỞNG */}
              <div className="wizard-slide px-1">
                <div className="space-y-6">
                  <div>
                    <label className="block font-headline-md text-base sm:text-lg font-bold text-slate-900 mb-2" htmlFor="input-idea-title">
                      Tên gọi sáng kiến / ý tưởng đề xuất: <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-orange-500 text-[22px]">lightbulb</span>
                      <input
                        id="input-idea-title"
                        type="text"
                        value={ideaTitle}
                        onChange={(e) => setIdeaTitle(e.target.value)}
                        placeholder="VD: Hệ thống Phê duyệt Hóa đơn Tự động bằng AI OCR & Chatbot..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-base font-bold text-slate-900 bg-orange-50/10 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-headline-md text-sm font-bold text-slate-800 mb-3">
                      Lĩnh vực ứng dụng chính: <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Sản phẩm & Công nghệ', icon: 'precision_manufacturing', desc: 'Phần mềm, AI, Tự động hóa' },
                        { title: 'Vận hành & Quy trình', icon: 'settings_suggest', desc: 'Tối ưu hóa các bước công việc' },
                        { title: 'Kinh doanh & Marketing', icon: 'trending_up', desc: 'Tăng trưởng doanh thu & KH' },
                        { title: 'Văn hóa & Môi trường', icon: 'diversity_3', desc: 'Môi trường làm việc & Đời sống' },
                        { title: 'Tiết kiệm Chi phí', icon: 'savings', desc: 'Cắt giảm lãng phí tài nguyên' },
                        { title: 'Khác', icon: 'more_horiz', desc: 'Ý tưởng đột phá khác' }
                      ].map((cat) => {
                        const isSelected = selectedCategory === cat.title;
                        return (
                          <button
                            key={cat.title}
                            type="button"
                            onClick={() => setSelectedCategory(cat.title)}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cat-card ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/30 text-orange-950 font-bold shadow-sm'
                                : 'border-slate-200 hover:border-orange-300 bg-white text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className={`material-symbols-outlined text-[24px] ${isSelected ? 'text-orange-600' : 'text-slate-400'}`}>
                                {cat.icon}
                              </span>
                              {isSelected && (
                                <span className="material-symbols-outlined text-orange-500 text-[18px]">check_circle</span>
                              )}
                            </div>
                            <div>
                              <span className="block text-xs font-bold">{cat.title}</span>
                              <span className="block text-[10px] text-slate-600 font-normal mt-0.5 leading-tight">{cat.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-label-md text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Quay lại Bước 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-label-md font-bold shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
                    >
                      <span>Tiếp tục: Nhập giải pháp</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 3: BƯỚC 3: VẤN ĐỀ & GIẢI PHÁP */}
              <div className="wizard-slide px-1">
                <div className="space-y-5">
                  <div>
                    <label className="block font-headline-md text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-problem">
                      Vấn đề/Bất cập thực tế cần giải quyết: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="input-problem"
                      rows={3}
                      value={problemText}
                      onChange={(e) => setProblemText(e.target.value)}
                      placeholder="Mô tả cụ thể vướng mắc hiện tại, thời gian bị lãng phí, chi phí bị rò rỉ hoặc rào cản nhân sự gặp phải..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-headline-md text-sm font-bold text-slate-800" htmlFor="input-solution">
                        Phương án & Giải pháp đề xuất: <span className="text-red-500">*</span>
                      </label>
                      {/* Rich Formatting Helper Toolbar */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleFormatText('B')}
                          className="px-2 py-0.5 rounded hover:bg-white text-slate-700 font-bold text-xs"
                          title="In đậm văn bản"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('I')}
                          className="px-2 py-0.5 rounded hover:bg-white text-slate-700 italic text-xs font-serif"
                          title="In nghiêng văn bản"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('list')}
                          className="px-2 py-0.5 rounded hover:bg-white text-slate-700 text-xs font-mono"
                          title="Tạo gạch đầu dòng"
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatText('link')}
                          className="px-2 py-0.5 rounded hover:bg-white text-slate-700 text-xs"
                          title="Tạo liên kết Link"
                        >
                          🔗 Link
                        </button>
                      </div>
                    </div>

                    <textarea
                      id="input-solution"
                      rows={5}
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                      placeholder="Trình bày các bước thực hiện, công nghệ ứng dụng, tài nguyên cần hỗ trợ và hiệu quả dự kiến..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm font-medium font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-label-md text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Quay lại Bước 2</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-label-md font-bold shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
                    >
                      <span>Tiếp tục: Đồng tác giả & Tải file</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 4: BƯỚC 4: ĐỒNG TÁC GIẢ CC & FILE ĐÍNH KÈM */}
              <div className="wizard-slide px-1">
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-headline-md text-lg font-bold text-slate-900">
                      Bước 4: Thành viên đồng tác giả (CC) & Đính kèm
                    </h3>
                    <p className="font-body-sm text-xs text-slate-500 mt-0.5">
                      Thêm email thành viên cùng thực hiện để hệ thống tự động CC thông báo và ghi nhận quyền sở hữu chung.
                    </p>
                  </div>

                  {/* Add Co-author Box */}
                  <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/60 space-y-3">
                    <span className="block text-xs font-bold text-orange-950 uppercase tracking-wider">
                      Thêm đồng tác giả / Thành viên nhóm:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={coauthorNameInput}
                        onChange={(e) => setCoauthorNameInput(e.target.value)}
                        placeholder="Họ tên đồng tác giả"
                        className="sm:col-span-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                      />
                      <input
                        type="email"
                        value={coauthorEmailInput}
                        onChange={(e) => setCoauthorEmailInput(e.target.value)}
                        placeholder="Email (VD: nam.tran@leadsgen.com)"
                        className="sm:col-span-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                      />
                      <button
                        type="button"
                        onClick={addCoauthor}
                        className="w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        + Thêm CC
                      </button>
                    </div>

                    {/* Co-authors List Chips */}
                    {coauthors.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {coauthors.map((c) => (
                          <div
                            key={c.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-orange-200 text-xs text-slate-800 shadow-xs"
                          >
                            <span className="font-bold text-orange-600">{c.name}</span>
                            <span className="text-slate-400 font-mono text-[11px]">({c.email})</span>
                            <button
                              type="button"
                              onClick={() => removeCoauthor(c.id)}
                              className="text-slate-400 hover:text-red-500 font-bold ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* File Attachment Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Đính kèm File/Sơ đồ minh họa (Hình ảnh, PDF, Slide pitch desk):
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-5 text-center transition-colors bg-slate-50/50 relative">
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                        onChange={(e) => setUploadedFile(e.target.files[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                        <span className="material-symbols-outlined text-orange-500 text-[32px]">cloud_upload</span>
                        {uploadedFile ? (
                          <div className="text-xs font-bold text-slate-900">
                            📎 Đã chọn: <span className="text-orange-600">{uploadedFile.name}</span> ({Math.round(uploadedFile.size / 1024)} KB)
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-slate-700">Kéo thả file vào đây hoặc bấm để tải lên</span>
                            <span className="text-[10px] text-slate-600">Hỗ trợ PNG, JPG, PDF, DOCX, PPTX (Tối đa 25MB)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-label-md text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Quay lại Bước 3</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(5)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-label-md font-bold shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
                    >
                      <span>Xem trước & Gửi Quỹ</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 5: BƯỚC 5: XEM TRƯỚC & NỘP Ý TƯỞNG */}
              <div className="wizard-slide px-1">
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-headline-md text-lg font-bold text-slate-900 flex items-center justify-between">
                      <span>Bước 5: Xác nhận nội dung & Gửi tới Ban Quản trị Quỹ</span>
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-mono font-bold">
                        ĐÃ SẴN SÀNG NỘP
                      </span>
                    </h3>
                    <p className="font-body-sm text-xs text-slate-500 mt-0.5">
                      Vui lòng rà soát lại thông tin trước khi nhấn nút chính thức khởi tạo ý tưởng.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 border-b border-slate-200/80">
                      <div>
                        <span className="text-slate-400 block font-medium">Họ tên người đăng ký:</span>
                        <span className="font-bold text-slate-900">{submitterName || "Chưa nhập"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Mã nhân viên:</span>
                        <span className="font-bold text-slate-900 uppercase">{employeeCode || "Chưa nhập"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Email liên hệ:</span>
                        <span className="font-bold text-slate-900">{submitterEmail || "Chưa nhập"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Số điện thoại:</span>
                        <span className="font-bold text-slate-900">{submitterPhone || "Chưa nhập"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Phòng ban & Đơn vị:</span>
                        <span className="font-bold text-slate-900">{department === 'Khác' ? customDepartment : department} ({workingUnit})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Đồng tác giả CC:</span>
                        <span className="font-bold text-orange-600">
                          {coauthors.length > 0 ? coauthors.map(c => c.name).join(', ') : "Nộp cá nhân"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Tên ý tưởng đề xuất:</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-0.5">{ideaTitle || "Chưa nhập tên"}</h4>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Lĩnh vực trọng tâm:</span>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-[11px]">
                        {selectedCategory}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Vấn đề cần giải quyết:</span>
                      <p className="text-slate-800 mt-0.5 line-clamp-3 leading-relaxed">{problemText || "(Chưa nhập)"}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Phương án thực thi:</span>
                      <p className="text-slate-800 mt-0.5 line-clamp-3 leading-relaxed">{solutionText || "(Chưa nhập)"}</p>
                    </div>

                    {uploadedFile && (
                      <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 text-slate-700">
                        <span className="material-symbols-outlined text-orange-500 text-[18px]">attachment</span>
                        <span>File đính kèm: <strong className="text-slate-900">{uploadedFile.name}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-label-md text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Chỉnh sửa nội dung</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleLaunchIdea}
                      className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-label-lg font-extrabold text-base shadow-xl shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang nộp sáng kiến...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                          <span>XÁC NHẬN NỘP SÁNG KIẾN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 6: HOÀN TẤT THÀNH CÔNG */}
              <div className="wizard-slide px-1">
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-lg border border-emerald-200">
                    🎉
                  </div>
                  <h3 className="font-headline-xl text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Gửi Ý Tưởng Thành Công!
                  </h3>
                  <p className="font-body-md text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    Sáng kiến của bạn đã được chuyển trực tiếp tới Ban Quản trị Quỹ Sáng Tạo LeadsGen. Bạn sẽ nhận được phản hồi kết quả sơ loại trong 48h.
                  </p>

                  <div className="inline-block p-4 rounded-2xl bg-orange-50 border border-orange-200 my-2">
                    <span className="block text-xs font-bold text-orange-800 uppercase tracking-wider">Mã tra cứu sáng kiến:</span>
                    <span className="font-mono-metric font-black text-xl text-orange-600 mt-1 block">{submittedCode}</span>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setWizardStep(1);
                        setIdeaTitle('');
                        setProblemText('');
                        setSolutionText('');
                        setUploadedFile(null);
                        setCoauthors([]);
                      }}
                      className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-md"
                    >
                      + Nộp thêm ý tưởng mới
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
