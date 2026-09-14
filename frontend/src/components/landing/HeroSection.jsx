import React, { useState, useEffect, useRef } from 'react';
import { formatCompactCurrency } from '../../utils/formatCurrency';

export default function HeroSection({ stats }) {
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
    if (!ctx) return;
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
      try {
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
      } catch (err) {
        console.warn("Particle canvas notice:", err);
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
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
          <span className="font-label-sm text-xs uppercase tracking-widest text-orange-600 font-extrabold">
            Idea → Action → Impact → Recognition • Dám Nghĩ → Dám Thử → Tạo Tác Động
          </span>
        </div>

        {/* Headline with Typewriter Effect */}
        <h1 className="font-display-hero text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-full leading-[1.15] whitespace-nowrap">
          <span className="typing-cursor text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-sky-600 whitespace-nowrap">
            {displayText}
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="font-body-lg text-base sm:text-lg md:text-xl text-slate-600 mt-4 max-w-5xl font-normal leading-relaxed">
          Nơi mọi ý tưởng của CBNV LeadsGen đều được biến thành hành động:{' '}
          <span className="whitespace-nowrap font-bold text-slate-900">
            Nhìn thấy vấn đề → Đề xuất → Hỗ trợ thử nghiệm → Tạo giá trị → Ghi nhận.
          </span>
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
              {Number(stats?.totalIdeas || 0).toLocaleString('vi-VN')}
            </span>
            <span className="font-label-sm text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Sáng kiến đã nộp</span>
          </div>
          <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center glow-hover border-t-4 border-t-amber-500 min-w-0">
            <span className="material-symbols-outlined text-amber-500 text-[32px] mb-1">payments</span>
            <div className="flex items-baseline gap-1 whitespace-nowrap max-w-full overflow-hidden">
              <span className="font-mono-metric text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                {formatCompactCurrency(stats?.totalImplementedSavings || 0).value}
              </span>
              <span className="font-mono-metric text-sm sm:text-base lg:text-lg text-amber-600 font-bold shrink-0">
                {formatCompactCurrency(stats?.totalImplementedSavings || 0).unit}
              </span>
            </div>
            <span className="font-label-sm text-xs text-slate-500 uppercase tracking-wider mt-1 font-semibold">Tiết kiệm / Giải ngân</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center glow-hover border-t-4 border-t-sky-500">
            <span className="material-symbols-outlined text-sky-500 text-[32px] mb-1">rocket</span>
            <span className="font-mono-metric text-2xl sm:text-3xl font-bold text-sky-600">
              {Number(stats?.implementedCount || 0).toLocaleString('vi-VN')}
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
  );
}
