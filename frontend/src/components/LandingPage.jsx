import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LandingPage() {
  const { user } = useAuth();

  // Typewriter effect state
  const typingText = "Kiến tạo tương lai từ một ý tưởng nhỏ.";
  const [displayText, setDisplayText] = useState('');
  const [typeIdx, setTypeIdx] = useState(0);

  useEffect(() => {
    if (typeIdx < typingText.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + typingText.charAt(typeIdx));
        setTypeIdx((prev) => prev + 1);
      }, 55);
      return () => clearTimeout(timer);
    }
  }, [typeIdx, typingText]);

  // Particle background canvas on Hero section
  const particleCanvasRef = useRef(null);
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(249, 115, 22, 0.45)' : 'rgba(2, 132, 199, 0.4)'
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Confetti explosion canvas
  const confettiCanvasRef = useRef(null);
  const fireConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
    }
    renderConfetti();
  };

  // Carousel Slider State & Handlers
  const carouselTrackRef = useRef(null);
  const [activeCarouselDot, setActiveCarouselDot] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  const slideCarousel = (direction) => {
    if (carouselTrackRef.current) {
      const itemWidth = 360 + 24;
      carouselTrackRef.current.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
    }
  };

  const scrollCarouselToIndex = (index) => {
    if (carouselTrackRef.current) {
      const itemWidth = 360 + 24;
      carouselTrackRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    }
  };

  const handleCarouselScroll = () => {
    if (carouselTrackRef.current) {
      const itemWidth = 360 + 24;
      const index = Math.round(carouselTrackRef.current.scrollLeft / itemWidth);
      setActiveCarouselDot(Math.min(Math.max(index, 0), 3));
    }
  };

  // Auto-scroll Carousel effect (every 3 seconds)
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      if (carouselTrackRef.current) {
        const itemWidth = 360 + 24;
        const maxIndex = 3;
        const nextIndex = activeCarouselDot >= maxIndex ? 0 : activeCarouselDot + 1;
        carouselTrackRef.current.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCarouselDot, isCarouselHovered]);

  // Dashboard Stats & Leaderboard API state
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalImplementedSavings: 0,
    implementedCount: 0
  });
  const [leaderboardItems, setLeaderboardItems] = useState([]);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch((err) => console.warn('Không thể tải thống kê dashboard:', err));

    api.get('/analytics/leaderboard')
      .then((res) => {
        if (res.data && Array.isArray(res.data)) setLeaderboardItems(res.data);
      })
      .catch((err) => console.warn('Không thể tải bảng xếp hạng:', err));
  }, []);

  // Idea Builder Multi-Step Wizard Controller
  const [wizardStep, setWizardStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Fields State
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submitterPhone, setSubmitterPhone] = useState("");
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

  const goToStep = (targetStep) => {
    setErrorMessage("");
    // Validation when advancing from step 1
    if (targetStep > 1 && wizardStep === 1) {
      if (!submitterName.trim() || !submitterEmail.trim() || !submitterPhone.trim()) {
        setErrorMessage("Vui lòng nhập đầy đủ Họ và tên, Email và Số điện thoại người đăng ký!");
        return;
      }
    }
    // Validation when advancing from step 2
    if (targetStep > 2 && (wizardStep === 2 || (targetStep > wizardStep && wizardStep < 2))) {
      if (!ideaTitle.trim()) {
        setErrorMessage("Vui lòng nhập Tên ý tưởng đề xuất!");
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
    if (!coauthorNameInput.trim() || !coauthorEmailInput.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ Họ tên và Email người cùng tham gia!");
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

  // Rich Text Mock Helper
  const handleMockFormat = (type) => {
    if (type === 'B') setSolutionText((prev) => prev + " **in đậm**");
    else if (type === 'I') setSolutionText((prev) => prev + " *in nghiêng*");
    else if (type === 'list') setSolutionText((prev) => prev + "\n- Ý 1\n- Ý 2");
    else if (type === 'link') setSolutionText((prev) => prev + " [liên kết](https://...)");
  };

  // Submit idea handler (Optimized for instant UX response)
  const handleLaunchIdea = async () => {
    if (!submitterName.trim() || !submitterEmail.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ Tên và Email người đăng ký!");
      goToStep(1);
      return;
    }
    if (!ideaTitle.trim()) {
      setErrorMessage("Vui lòng nhập Tên ý tưởng!");
      goToStep(2);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    const finalDept = department === 'Khác' ? (customDepartment.trim() || 'Phòng ban khác') : department;
    const coauthorEmailsList = coauthors.map((c) => c.email).filter(Boolean);

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
      workingUnit: workingUnit,
      coauthorEmails: coauthorEmailsList.join(',')
    };

    const emailPayload = {
      _subject: `[Quỹ Sáng Tạo LeadsGen] Đề xuất sáng kiến mới: ${ideaTitle}`,
      _template: "table",
      _captcha: "false",
      "1. Họ tên người đăng ký": submitterName,
      "2. Email liên hệ": submitterEmail,
      "3. Số điện thoại": submitterPhone,
      "4. Phòng ban công tác": finalDept,
      "5. Đơn vị / Chi nhánh": workingUnit,
      "6. Tên sáng kiến": ideaTitle,
      "7. Lĩnh vực trọng tâm": selectedCategory,
      "8. Vấn đề giải quyết": problemText || "(Chưa nhập)",
      "9. Phương án thực thi": solutionText || "(Chưa nhập)",
      "10. Đồng tác giả CC": coauthorEmailsList.join(', ') || "Nộp cá nhân"
    };

    if (coauthorEmailsList.length > 0) {
      emailPayload._cc = coauthorEmailsList.join(',');
    }

    // 1. Dispatch both Backend PostgreSQL DB save & FormSubmit email concurrently in background
    Promise.allSettled([
      api.post('/ideas', ideaData, { timeout: 15000 }).catch(err => console.warn("Backend submit notice:", err)),
      fetch("https://formsubmit.co/ajax/hoangthotudev@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(emailPayload)
      }).catch(err => console.warn("Frontend direct email dispatch notice:", err))
    ]);

    // 2. Instantly show success screen after smooth 600ms transition
    setTimeout(() => {
      const code = '#LEADSGEN-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedCode(code);
      setIsSubmitting(false);
      setWizardStep(6);
      fireConfetti();
    }, 600);
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full relative bg-slate-50 text-slate-900">
      {/* CONFETTI CANVAS */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      />

      {/* 2. HERO SECTION */}
      <section
        id="hero"
        className="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-orange-50/20"
      >
        {/* Particle & Network Interactive Canvas Background */}
        <canvas
          ref={particleCanvasRef}
          className="absolute inset-0 w-full h-full -z-10 opacity-40 pointer-events-none"
        />

        {/* Ambient Glow Lights */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-44 right-1/4 w-96 h-96 bg-sky-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[34rem] h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center z-10">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-orange-200 shadow-sm backdrop-blur-md mb-6 animate-pulse">
            <span className="material-symbols-outlined text-orange-500 text-[18px]">auto_awesome</span>
            <span className="font-label-sm text-xs uppercase tracking-widest text-orange-600 font-bold">
              LeadsGen Innovation Engine 2025 • Mở Đợt Cấp Vốn Q2
            </span>
          </div>

          {/* Headline with Typewriter Effect */}
          <h1 className="font-display-hero text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.15]">
            <span className="typing-cursor text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-sky-600">
              {displayText}
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="font-body-lg text-lg md:text-xl text-slate-600 mt-4 max-w-2xl font-normal leading-relaxed">
            Nơi mọi sáng kiến của thành viên LeadsGen đều được lắng nghe và biến thành hiện thực. Tài trợ vốn hạt giống lên tới{' '}
            <span className="text-orange-600 font-bold">200 Triệu VNĐ</span>, hỗ trợ nguồn lực kỹ thuật và bảo hộ quyền lợi tác giả sáng lập.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href="#idea-builder"
              className="relative group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-label-lg text-base font-bold shadow-lg shadow-orange-500/35 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">rocket_launch</span>
              <span>Khởi tạo ý tưởng ngay</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#why-what"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-sky-700 border border-slate-200 hover:border-sky-300 font-label-md text-sm font-semibold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sky-600 text-[20px]">explore</span>
              <span>Khám phá cơ chế quỹ</span>
            </a>
          </div>

          {/* Realtime Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl mt-16">
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center glow-hover border-t-4 border-t-orange-500">
              <span className="material-symbols-outlined text-orange-500 text-[32px] mb-1">lightbulb</span>
              <span className="font-mono-metric text-2xl sm:text-3xl font-bold text-slate-900">
                {(stats.totalIdeas || 0).toLocaleString('vi-VN')}
              </span>
              <span className="font-label-sm text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Sáng kiến đã nộp</span>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center glow-hover border-t-4 border-t-amber-500">
              <span className="material-symbols-outlined text-amber-500 text-[32px] mb-1">payments</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono-metric text-2xl sm:text-3xl font-bold text-slate-900">
                  {stats.totalImplementedSavings && stats.totalImplementedSavings >= 1000000000
                    ? (stats.totalImplementedSavings / 1000000000).toFixed(1)
                    : (stats.totalImplementedSavings || 0).toLocaleString('vi-VN')}
                </span>
                <span className="font-mono-metric text-lg text-amber-600 font-bold">
                  {stats.totalImplementedSavings && stats.totalImplementedSavings >= 1000000000 ? 'Tỷ' : 'VNĐ'}
                </span>
              </div>
              <span className="font-label-sm text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Tiết kiệm / Giải ngân</span>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center glow-hover border-t-4 border-t-sky-500">
              <span className="material-symbols-outlined text-sky-500 text-[32px] mb-1">rocket</span>
              <span className="font-mono-metric text-2xl sm:text-3xl font-bold text-sky-600">
                {(stats.implementedCount || 0).toLocaleString('vi-VN')}
              </span>
              <span className="font-label-sm text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Dự án áp dụng</span>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center glow-hover border-t-4 border-t-orange-400">
              <span className="material-symbols-outlined text-orange-500 text-[32px] mb-1">speed</span>
              <div className="flex items-baseline gap-0.5">
                <span className="font-mono-metric text-2xl sm:text-3xl font-bold text-slate-900">48</span>
                <span className="font-mono-metric text-base text-slate-900 font-bold">h</span>
              </div>
              <span className="font-label-sm text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Phản hồi sơ loại</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INFORMATION & LEADERBOARD SECTION */}
      <section id="why-what" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-label-sm text-xs uppercase tracking-widest text-orange-600 font-bold">Quy Chuẩn & Giá Trị Cốt Lõi LeadsGen</span>
          <h2 className="font-headline-xl text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
            Bệ Phóng Toàn Diện Cho Tinh Thần Đổi Mới
          </h2>
          <p className="font-body-md text-slate-600 mt-2 leading-relaxed">
            Không lý thuyết suông. Quỹ LeadsGen cung cấp nguồn lực tài chính, khung đánh giá minh bạch <br />và quy trình thử nghiệm tinh gọn nhất.
          </p>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Quyền lợi */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-hover flex flex-col justify-between border-t-4 border-t-orange-500">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">award_star</span>
              </div>
              <span className="font-label-sm text-xs font-bold text-orange-600 uppercase tracking-wider">Gói Tài Trợ & Quyền Lợi</span>
              <h3 className="font-headline-md text-xl font-bold text-slate-900 mt-1">Vốn Hạt Giống & Thưởng Nóng</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-orange-500 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Tài trợ vốn từ <strong className="text-slate-900 font-semibold">50.000.000đ – 200.000.000đ</strong> triển khai PoC.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-orange-500 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Thưởng nóng <strong className="text-orange-600 font-bold">5.000.000 VNĐ tiền mặt</strong> ngay khi vượt qua vòng sơ loại 48h.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-orange-500 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span>Fast-track bổ nhiệm <strong className="text-slate-900 font-semibold">Product Owner độc lập</strong>, tự chủ đội ngũ & ngân sách.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-orange-600 font-semibold font-label-md">
              <span>Chính sách giải ngân theo Sprint</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>

          {/* Card 2: Tiêu chí duyệt */}
          <div id="criteria" className="glass-panel p-6 sm:p-8 rounded-2xl glow-hover flex flex-col justify-between border-t-4 border-t-sky-500">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <span className="font-label-sm text-xs font-bold text-sky-600 uppercase tracking-wider">Thang Đo Xét Duyệt</span>
              <h3 className="font-headline-md text-xl font-bold text-slate-900 mt-1">Minh Bạch & Đa Chiều</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-medium">Tính Đột phá & Sáng tạo</span>
                    <span className="text-sky-600 font-mono-metric font-bold">30%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-medium">Tác động Kinh doanh & Vận hành</span>
                    <span className="text-orange-600 font-mono-metric font-bold">30%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-medium">Khả thi Kỹ thuật (PoC 4-8 tuần)</span>
                    <span className="text-amber-600 font-mono-metric font-bold">25%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-medium">Tinh thần Tinh gọn (Lean Mindset)</span>
                    <span className="text-sky-500 font-mono-metric font-bold">15%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold font-label-md">
              <span>Cam kết phản hồi trong 48 giờ</span>
              <span className="material-symbols-outlined text-[16px]">schedule</span>
            </div>
          </div>

          {/* Card 3: Quy trình thực thi */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl glow-hover flex flex-col justify-between border-t-4 border-t-amber-500">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">route</span>
              </div>
              <span className="font-label-sm text-xs font-bold text-amber-600 uppercase tracking-wider">Lộ Trình Ươm Mầm</span>
              <h3 className="font-headline-md text-xl font-bold text-slate-900 mt-1">4 Bước Tới Hiện Thực Hóa</h3>
              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <span><strong className="text-slate-900">Nộp ý tưởng:</strong> Điền Idea Builder trực tuyến gửi tới Ban Quản trị Quỹ Sáng Tạo.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold text-[10px] shrink-0">2</span>
                  <span><strong className="text-slate-900">Thẩm định 48h:</strong> Ban Quản trị Quỹ phản hồi & giải ngân thưởng 5M.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] shrink-0">3</span>
                  <span><strong className="text-slate-900">Cấp vốn & PoC:</strong> Nhận vốn tới 200M và cố vấn từ Ban Quản trị & C-Level.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] shrink-0">4</span>
                  <span><strong className="text-slate-900">Thương mại hóa:</strong> Triển khai quy mô toàn tập đoàn & chia sẻ lợi nhuận.</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold font-label-md">
              <span>Đồng hành cùng Leader Anh Tú & Tech Lead LeadsGen</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* HALL OF FAME: SLIDER CAROUSEL */}
        <div
          id="leaderboard"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
          className="glass-panel p-6 sm:p-8 md:p-10 rounded-3xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-label-sm font-bold uppercase tracking-wider mb-1 border border-orange-200">
                <span className="material-symbols-outlined text-[16px]">military_tech</span> Bảng Vàng Vinh Danh LeadsGen
              </div>
              <h3 className="font-headline-lg text-2xl font-bold text-slate-900">Ý Tưởng Tiêu Biểu & Tinh Anh Tháng Này</h3>
            </div>

            {/* Carousel Controls & Indicators */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                {[0, 1, 2, 3].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    aria-label={`Đến trang ${dotIdx + 1}`}
                    onClick={() => scrollCarouselToIndex(dotIdx)}
                    className={
                      dotIdx === activeCarouselDot
                        ? "carousel-dot h-2.5 w-6 rounded-full bg-orange-600 transition-all duration-300"
                        : "carousel-dot h-2.5 w-2.5 rounded-full bg-slate-200 hover:bg-orange-300 transition-all duration-300"
                    }
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Slide trước"
                  type="button"
                  onClick={() => slideCarousel(-1)}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 flex items-center justify-center transition-all border border-slate-200 shadow-sm hover:border-orange-400 active:scale-95"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  aria-label="Slide tiếp theo"
                  type="button"
                  onClick={() => slideCarousel(1)}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 flex items-center justify-center transition-all border border-slate-200 shadow-sm hover:border-orange-400 active:scale-95"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Slider Container */}
          <div
            ref={carouselTrackRef}
            onScroll={handleCarouselScroll}
            className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
          >
            {leaderboardItems.length > 0 ? (
              leaderboardItems.map((item, idx) => (
                <div
                  key={item.userId || idx}
                  className="min-w-[320px] md:min-w-[360px] max-w-[380px] p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shrink-0 hover:border-orange-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-label-sm font-semibold border border-sky-200">
                        {item.department || 'Phòng Ban LeadsGen'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-mono-metric font-bold border border-amber-200">
                        <span className="material-symbols-outlined text-[14px]">military_tech</span> Top #{item.rank || idx + 1}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-base font-bold text-slate-900 line-clamp-2">
                      {item.fullName}
                    </h4>
                    <p className="font-body-sm text-xs text-slate-600 mt-2 line-clamp-3">
                      Đã đóng góp {item.totalIdeas || 0} sáng kiến và triển khai thành công {item.implementedIdeas || 0} dự án cho tập đoàn.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.fullName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-orange-400"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-[11px]">
                          {item.fullName ? item.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800">{item.fullName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-mono-metric font-bold text-[11px] border border-orange-200">
                      {(item.totalScore || 0).toLocaleString('vi-VN')} Đóng góp
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm w-full bg-white rounded-2xl border border-slate-200">
                Chưa có dữ liệu vinh danh. Hãy nộp sáng kiến đầu tiên để lên bảng vàng!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. IDEA BUILDER: TRÁI TIM CỦA LANDING PAGE */}
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
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-label-sm text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Hệ thống sẵn sàng</span>
              </span>
            </div>
          </div>

          {/* Error / Alert Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700 relative z-10 animate-shake">
              <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0 mt-0.5">error</span>
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                ×
              </button>
            </div>
          )}

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
                        placeholder="VD: Tự động hóa phê duyệt đơn từ bằng AI Assistant..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-slate-900 text-base font-semibold placeholder:text-slate-400 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* 6 Category Cards */}
                  <div>
                    <label className="block font-headline-sm text-sm font-bold text-slate-900 mb-1">Lĩnh vực trọng tâm:</label>
                    <p className="font-body-sm text-xs text-slate-500 mb-4">Hệ thống sẽ điều phối Hội đồng chuyên môn thuộc mảng tương ứng tới thẩm định.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { title: 'Cải tiến quy trình', icon: 'settings', desc: 'Tối ưu Lean, giảm lãng phí thời gian & thủ tục' },
                        { title: 'Sản phẩm & Công nghệ', icon: 'memory', desc: 'GenAI, Automation, nền tảng công nghệ số' },
                        { title: 'Trải nghiệm nhân sự & Văn hóa', icon: 'groups', desc: 'Gắn kết đội ngũ, đãi ngộ thông minh' },
                        { title: 'Phát triển bền vững & Xanh', icon: 'eco', desc: 'Net Zero, tiết kiệm năng lượng, ESG' },
                        { title: 'Tăng trưởng doanh thu', icon: 'trending_up', desc: 'Mô hình kinh doanh mới, kênh bán mới' },
                        { title: 'An toàn & Bảo mật dữ liệu', icon: 'security', desc: 'Bảo vệ thông tin bí mật & an ninh phòng vệ' }
                      ].map((cat) => {
                        const isSelected = selectedCategory === cat.title;
                        return (
                          <button
                            key={cat.title}
                            type="button"
                            onClick={() => setSelectedCategory(cat.title)}
                            className={`cat-card p-3.5 rounded-2xl text-left transition-all flex flex-col gap-1.5 relative group ${
                              isSelected
                                ? 'bg-orange-50/90 border-2 border-orange-500 shadow-sm ring-2 ring-orange-500/20'
                                : 'bg-slate-50/70 border border-slate-200 hover:border-orange-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`material-symbols-outlined text-[24px] ${isSelected ? 'text-orange-600' : 'text-slate-600'}`}>
                                {cat.icon}
                              </span>
                              <span className={`material-symbols-outlined text-orange-600 text-[18px] ${isSelected ? 'block' : 'hidden'}`}>
                                check_circle
                              </span>
                            </div>
                            <span className={`font-headline-sm text-xs sm:text-sm font-bold ${isSelected ? 'text-orange-950' : 'text-slate-900'}`}>
                              {cat.title}
                            </span>
                            <span className="font-body-sm text-[11px] text-slate-500">{cat.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-label-md text-xs sm:text-sm font-semibold transition-all border border-slate-200 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Quay lại</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-label-md font-bold shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
                    >
                      <span>Tiếp tục: Nội dung giải pháp</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 3: BƯỚC 3: VẤN ĐỀ & GIẢI PHÁP */}
              <div className="wizard-slide px-1">
                <div className="space-y-5">
                  {/* Problem Question */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-headline-sm text-xs sm:text-sm font-bold text-slate-900" htmlFor="input-problem">
                        1. Vấn đề thực tế cần khắc phục:
                      </label>
                      <span className="text-[11px] font-mono-metric text-slate-500 font-semibold">
                        {problemText.length}/500
                      </span>
                    </div>
                    <textarea
                      id="input-problem"
                      rows={3}
                      maxLength={500}
                      value={problemText}
                      onChange={(e) => setProblemText(e.target.value)}
                      placeholder="Mô tả cụ thể vấn đề hoặc điểm nghẽn hiện tại..."
                      className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-slate-900 text-xs sm:text-sm font-normal placeholder:text-slate-400 shadow-sm"
                    />
                  </div>

                  {/* Solution Question */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-headline-sm text-xs sm:text-sm font-bold text-slate-900" htmlFor="input-solution">
                        2. Phương án thực thi & Giải pháp đề xuất:
                      </label>
                      <span className="text-[11px] font-mono-metric text-slate-500 font-semibold">
                        {solutionText.length}/800
                      </span>
                    </div>

                    {/* Rich text toolbar */}
                    <div className="flex items-center gap-1 p-1.5 rounded-t-xl bg-slate-100 border-x border-t border-slate-200">
                      <button type="button" onClick={() => handleFormatText('B')} title="Bôi đậm (**text**)" className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 transition-colors">B</button>
                      <button type="button" onClick={() => handleFormatText('I')} title="In nghiêng (*text*)" className="p-1.5 rounded hover:bg-slate-200 text-slate-700 italic text-xs px-2.5 transition-colors">I</button>
                      <span className="h-4 w-[1px] bg-slate-300 mx-1"></span>
                      <button type="button" onClick={() => handleFormatText('list')} title="Tạo danh sách (- ý)" className="p-1.5 rounded hover:bg-slate-200 text-slate-700 flex items-center px-2 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                      </button>
                      <button type="button" onClick={() => handleFormatText('link')} title="Chèn liên kết ([link](url))" className="p-1.5 rounded hover:bg-slate-200 text-slate-700 flex items-center px-2 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">link</span>
                      </button>
                    </div>
                    <textarea
                      id="input-solution"
                      rows={4}
                      maxLength={800}
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                      placeholder="Trình bày các bước triển khai ý tưởng..."
                      className="w-full p-3.5 rounded-b-2xl bg-white border-x border-b border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-slate-900 text-xs sm:text-sm font-normal placeholder:text-slate-400 -mt-[1px] shadow-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-label-md text-xs sm:text-sm font-semibold transition-all border border-slate-200 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Quay lại</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-label-md font-bold shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
                    >
                      <span>Tiếp tục: Đồng tác giả & Đính kèm</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 4: BƯỚC 4: ĐỒNG TÁC GIẢ CC & FILE ĐÍNH KÈM */}
              <div className="wizard-slide px-1">
                <div className="space-y-6">
                  {/* Co-authors Email CC Section */}
                  <div>
                    <label className="block font-headline-sm text-xs sm:text-sm font-bold text-slate-900 mb-1">
                      Thành viên cùng tham gia (Email đồng gửi CC):
                    </label>
                    <p className="font-body-sm text-xs text-slate-500 mb-3">
                      Nhập thông tin đồng nghiệp cùng thực hiện dự án. Email thông báo sẽ đồng gửi CC cho các thành viên này.
                    </p>

                    {/* Inputs to add co-author */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3">
                      <input
                        type="text"
                        value={coauthorNameInput}
                        onChange={(e) => setCoauthorNameInput(e.target.value)}
                        placeholder="Họ tên thành viên..."
                        className="sm:col-span-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-orange-500 outline-none"
                      />
                      <input
                        type="email"
                        value={coauthorEmailInput}
                        onChange={(e) => setCoauthorEmailInput(e.target.value)}
                        placeholder="Email (VD: nam.tran@leadsgen.com)..."
                        className="sm:col-span-2 p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-orange-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCoauthor}
                        className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Thêm CC</span>
                      </button>
                    </div>

                    {/* Added co-authors list */}
                    {coauthors.length > 0 ? (
                      <div className="space-y-2">
                        {coauthors.map((c) => (
                          <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-orange-600 text-[18px]">person</span>
                              <span className="font-bold text-slate-900">{c.name}</span>
                              <span className="text-slate-500">({c.email})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCoauthor(c.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              title="Xóa thành viên"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        Chưa có đồng tác giả được thêm. Có thể bỏ qua nếu nộp cá nhân.
                      </div>
                    )}
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block font-headline-sm text-xs sm:text-sm font-bold text-slate-900 mb-1">
                      Đính kèm tài liệu phác thảo / Proposal (Tùy chọn):
                    </label>
                    <p className="font-body-sm text-xs text-slate-500 mb-3">Hỗ trợ PDF, PNG, JPG, PPTX, Figma link (tối đa 25MB).</p>
                    <label className="border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-2xl p-5 text-center bg-orange-50/20 hover:bg-orange-50/50 transition-all cursor-pointer block">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedFile(e.target.files[0].name);
                          }
                        }}
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-orange-500 text-[32px]">cloud_upload</span>
                        <span className="font-label-md text-xs text-slate-800 font-bold">
                          Kéo thả tài liệu vào đây hoặc <span className="text-orange-600 underline">chọn tệp từ máy tính</span>
                        </span>
                      </div>
                    </label>

                    {uploadedFile && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-orange-600 text-[20px]">description</span>
                          <span className="font-bold text-slate-800">{uploadedFile}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-label-md text-xs sm:text-sm font-semibold transition-all border border-slate-200 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Quay lại</span>
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-label-md text-xs sm:text-sm font-bold transition-all border border-slate-300 active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-orange-600 text-[18px]">visibility</span>
                        <span>Xem Trước (Preview)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => goToStep(5)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-label-md font-bold shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95 text-xs sm:text-sm"
                      >
                        <span>Tiếp tục: Xem lại & Gửi Quỹ Sáng Tạo</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SLIDE 5: BƯỚC 5: XEM TRƯỚC & GỬI QUỸ SÁNG TẠO */}
              <div className="wizard-slide px-1">
                <div className="space-y-4">
                  {/* Preview Alert Banner */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 shadow-sm flex-wrap sm:flex-nowrap">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-amber-600 text-[22px] shrink-0 mt-0.5">preview</span>
                      <div className="text-xs text-amber-900 leading-relaxed">
                        <strong>Xem trước & Rà soát thông tin:</strong> Vui lòng kiểm tra lại toàn bộ thông tin đề xuất bên dưới trước khi bấm gửi chính thức. Nếu phát hiện sai sót, bạn có thể nhấn nút <span className="underline font-bold">Chỉnh sửa</span> tương ứng ở từng mục.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Mở Cửa Sổ Xem Trước</span>
                    </button>
                  </div>

                  {/* Section 1: Submitter Info */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm hover:border-orange-200 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">1</span>
                        <span className="font-label-sm text-xs uppercase tracking-wider text-slate-800 font-bold">
                          Thông tin người nộp hồ sơ
                        </span>
                      </div>
                      <button type="button" onClick={() => goToStep(1)} className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Sửa</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Họ tên người đăng ký:</span>
                        <span className="font-bold text-slate-900">{submitterName || "Chưa nhập"}</span>
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
                        <span className="font-bold text-slate-900">
                          {department === 'Khác' ? (customDepartment || 'Phòng ban khác') : department} ({workingUnit})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Idea Core & Category */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm hover:border-orange-200 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">2</span>
                        <span className="font-label-sm text-xs uppercase tracking-wider text-slate-800 font-bold">
                          Tên ý tưởng & Lĩnh vực
                        </span>
                      </div>
                      <button type="button" onClick={() => goToStep(2)} className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Sửa</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Tên sáng kiến:</span>
                        <h4 className="font-headline-md text-base font-bold text-slate-900">{ideaTitle || "Chưa đặt tên"}</h4>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Lĩnh vực trọng tâm:</span>
                        <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                          {selectedCategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Problem Description */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm hover:border-orange-200 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">3</span>
                        <span className="font-label-sm text-xs uppercase tracking-wider text-slate-800 font-bold">
                          Vấn đề giải quyết
                        </span>
                      </div>
                      <button type="button" onClick={() => goToStep(3)} className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Sửa</span>
                      </button>
                    </div>

                    <div className="text-xs">
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">{problemText || "(Chưa nhập thông tin vấn đề)"}</p>
                    </div>
                  </div>

                  {/* Section 4: Solution & Team */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm hover:border-orange-200 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">4</span>
                        <span className="font-label-sm text-xs uppercase tracking-wider text-slate-800 font-bold">
                          Phương án thực thi & Đồng tác giả
                        </span>
                      </div>
                      <button type="button" onClick={() => goToStep(4)} className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Sửa</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium mb-0.5">Phương án thực thi:</span>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{solutionText || "(Chưa nhập phương án)"}</p>
                      </div>
                      {coauthors.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-slate-400 block font-medium mb-1">Đồng tác giả CC:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {coauthors.map((c, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200">
                                {c.name} ({c.email})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quỹ Sáng Tạo Notice Banner */}
                  <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3 shadow-sm">
                    <span className="material-symbols-outlined text-orange-600 text-[22px] shrink-0 mt-0.5">verified_user</span>
                    <div className="text-xs text-slate-700 leading-relaxed">
                      Thông tin sáng kiến sẽ được gửi trực tiếp tới <strong className="text-slate-900 font-bold">Ban Quản trị Quỹ Sáng Tạo LeadsGen</strong> và đồng gửi CC cho các thành viên tham gia dự án.
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-label-md text-xs sm:text-sm font-semibold transition-all border border-slate-200 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Quay lại bước 4</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleLaunchIdea}
                      className="relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-label-lg text-sm sm:text-base font-bold shadow-lg shadow-orange-500/35 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Đang gửi tới Quỹ Sáng Tạo...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                          <span>Xác Nhận & Gửi Quỹ Sáng Tạo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE 6: SUCCESS STATE */}
              <div className="wizard-slide px-1">
                <div className="text-center py-6 sm:py-10 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 animate-bounce">
                    <span className="material-symbols-outlined text-[44px]">check_circle</span>
                  </div>
                  <div className="space-y-2 max-w-lg mx-auto">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-mono-metric font-bold uppercase tracking-wider border border-orange-200">
                      Mã Hồ Sơ: {submittedCode}
                    </span>
                    <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-slate-900">
                      Tuyệt vời! Ý tưởng của bạn đã được gửi thành công.
                    </h3>
                    <p className="font-body-md text-sm text-slate-600 leading-relaxed">
                      Email thông báo đã được gửi trực tiếp tới <strong className="text-slate-900">Ban Quản trị Quỹ Sáng Tạo LeadsGen</strong> và các đồng tác giả. Ban Quản trị Quỹ sẽ phản hồi tới email của bạn trong vòng <strong className="text-sky-600">48 giờ làm việc</strong>.
                    </p>
                  </div>
                  <div className="p-4 max-w-md mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-around text-xs shadow-sm">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-orange-500 text-[22px]">verified</span>
                      <span className="text-slate-800 mt-1 font-semibold">Đã gửi mail</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-amber-500 text-[22px]">timer</span>
                      <span className="text-slate-800 mt-1 font-semibold">Sơ duyệt 48h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-sky-600 text-[22px]">payments</span>
                      <span className="text-slate-800 mt-1 font-semibold">Thưởng nóng 5M</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIdeaTitle('');
                        setProblemText('');
                        setSolutionText('');
                        setCoauthors([]);
                        goToStep(1);
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-label-md text-xs sm:text-sm font-semibold transition-all shadow-md shadow-orange-500/25 active:scale-95"
                    >
                      Gửi ý tưởng mới
                    </button>
                    <a
                      href="#leaderboard"
                      className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-label-md text-xs sm:text-sm font-semibold transition-all border border-slate-200 shadow-sm"
                    >
                      Xem Bảng vàng vinh danh
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION SECTION */}
      <section id="faqs" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-label-sm text-xs uppercase tracking-widest text-orange-600 font-bold">Giải Đáp Thắc Mắc</span>
            <h2 className="font-headline-xl text-3xl font-extrabold text-slate-900 mt-2">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="font-body-md text-slate-600 text-sm mt-1">
              Mọi thông tin về quyền tác giả, thẩm định và cơ chế tài trợ nội bộ LeadsGen.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Tôi làm khối Vận hành / Nhân sự và không biết lập trình thì có tham gia được không?",
                a: "Hoàn toàn được và rất được khuyến khích! Hơn 40% các sáng kiến thành công nhất đến từ tối ưu quy trình hành chính, nhân sự, chuỗi cung ứng thương mại điện tử và chăm sóc khách hàng. Khi ý tưởng qua vòng sơ loại, Leader Anh Tú và Quỹ LeadsGen sẽ cấp kỹ sư công nghệ và thiết kế nội bộ hỗ trợ bạn xây dựng sản phẩm từ A đến Z."
              },
              {
                q: "Bản quyền sở hữu trí tuệ của ý tưởng sẽ thuộc về ai?",
                a: "Ý tưởng phát triển bằng nguồn lực LeadsGen sẽ thuộc quyền sở hữu của tập đoàn. Tuy nhiên, tác giả và các cộng sự được vinh danh vĩnh viễn là Tác Giả Sáng Chế (Inventor), nhận thưởng nóng 5.000.000 VNĐ, nhận % phân chia doanh thu thương mại hóa và ưu tiên giữ vai trò Product Owner của dự án."
              },
              {
                q: "Nếu thử nghiệm PoC thất bại thì có bị ảnh hưởng đến đánh giá công việc không?",
                a: "Tuyệt đối không! Quỹ Đổi mới LeadsGen vận hành theo văn hóa Zero-Blame Culture (Văn hóa không đổ lỗi). Thất bại sớm trong giai đoạn thử nghiệm là bài học vô giá. Toàn bộ nỗ lực đề xuất và thử nghiệm đều được ghi nhận đóng góp tích cực trong kỳ đánh giá nhân sự."
              },
              {
                q: "Tôi muốn thêm các đồng nghiệp khác đồng nhận thông tin mail thì làm như thế nào?",
                a: "Ngay tại Bước 4 của Idea Builder, bạn có thể điền Tên và Email của các đồng tác giả. Hệ thống sẽ tự động đồng gửi CC thông báo cho tất cả các thành viên khi bạn bấm gửi cho Ban Quản trị Quỹ Sáng Tạo."
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-headline-sm text-sm sm:text-base font-bold text-slate-900 hover:text-orange-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span
                      className="material-symbols-outlined text-orange-500 transition-transform duration-300"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL IDEA PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">visibility</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-slate-900">Xem Trước Hồ Sơ Đề Xuất Sáng Kiến</h3>
                  <p className="text-xs text-slate-500">Rà soát lại toàn bộ thông tin đã điền trước khi gửi tới Quỹ Sáng Tạo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body: Proposal Summary */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {/* 1. Submitter */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-orange-600 uppercase tracking-wider text-[11px]">1. THÔNG TIN NGƯỜI ĐĂNG KÝ</span>
                  <button
                    type="button"
                    onClick={() => { setShowPreviewModal(false); goToStep(1); }}
                    className="text-orange-600 hover:underline font-semibold"
                  >
                    Chỉnh sửa (Bước 1)
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div><span className="text-slate-500">Họ tên:</span> <strong className="text-slate-900">{submitterName || "Chưa nhập"}</strong></div>
                  <div><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{submitterEmail || "Chưa nhập"}</strong></div>
                  <div><span className="text-slate-500">Số điện thoại:</span> <strong className="text-slate-900">{submitterPhone || "Chưa nhập"}</strong></div>
                  <div><span className="text-slate-500">Phòng ban & Đơn vị:</span> <strong className="text-slate-900">{department === 'Khác' ? customDepartment : department} ({workingUnit})</strong></div>
                </div>
              </div>

              {/* 2. Idea core */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-amber-600 uppercase tracking-wider text-[11px]">2. TÊN & LĨNH VỰC SÁNG KIẾN</span>
                  <button
                    type="button"
                    onClick={() => { setShowPreviewModal(false); goToStep(2); }}
                    className="text-orange-600 hover:underline font-semibold"
                  >
                    Chỉnh sửa (Bước 2)
                  </button>
                </div>
                <div className="space-y-1 pt-1">
                  <div><span className="text-slate-500">Tên sáng kiến:</span> <strong className="text-slate-900 text-sm block font-headline-md mt-0.5">{ideaTitle || "Chưa đặt tên"}</strong></div>
                  <div><span className="text-slate-500">Lĩnh vực trọng tâm:</span> <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold ml-1">{selectedCategory}</span></div>
                </div>
              </div>

              {/* 3. Problem */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-sky-600 uppercase tracking-wider text-[11px]">3. VẤN ĐỀ THỰC TẾ CẦN KHẮC PHỤC</span>
                  <button
                    type="button"
                    onClick={() => { setShowPreviewModal(false); goToStep(3); }}
                    className="text-orange-600 hover:underline font-semibold"
                  >
                    Chỉnh sửa (Bước 3)
                  </button>
                </div>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line pt-1">{problemText || "(Chưa nhập vấn đề)"}</p>
              </div>

              {/* 4. Solution */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-emerald-600 uppercase tracking-wider text-[11px]">4. PHƯƠNG ÁN THỰC THI & GIẢI PHÁP ĐỀ XUẤT</span>
                  <button
                    type="button"
                    onClick={() => { setShowPreviewModal(false); goToStep(4); }}
                    className="text-orange-600 hover:underline font-semibold"
                  >
                    Chỉnh sửa (Bước 4)
                  </button>
                </div>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line pt-1">{solutionText || "(Chưa nhập giải pháp)"}</p>
                {coauthors.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1">Đồng tác giả CC:</span>
                    <div className="flex flex-wrap gap-1">
                      {coauthors.map((c) => (
                        <span key={c.id} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium">
                          {c.name} ({c.email})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                Đóng xem trước
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  if (wizardStep !== 5) {
                    goToStep(5);
                  } else {
                    handleLaunchIdea();
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                <span>{wizardStep === 5 ? "Xác Nhận & Gửi Quỹ Sáng Tạo" : "Đến Bước 5 (Xác Nhận & Gửi)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
