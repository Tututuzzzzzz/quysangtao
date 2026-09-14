import React from 'react';

export default function LeaderboardBanner({
  leaderboardItems = [],
  activeCarouselDot = 0,
  onSelectIndex,
  onMouseEnter,
  onMouseLeave
}) {
  const bgImages = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80'
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div
        id="leaderboard"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 text-white min-h-[480px] sm:min-h-[520px] md:min-h-[560px] border border-slate-800 flex flex-col justify-between"
      >
        {leaderboardItems.length > 0 ? (
          (() => {
            const activeItem = leaderboardItems[activeCarouselDot] || leaderboardItems[0];
            const rankNum = activeCarouselDot + 1;
            const currentBg = activeItem.avatarUrl && activeItem.avatarUrl.startsWith('http')
              ? activeItem.avatarUrl
              : bgImages[activeCarouselDot % bgImages.length];

            return (
              <>
                {/* Dynamic Background Image with Dark Gradient Overlays */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={currentBg}
                    alt={activeItem.fullName}
                    className="w-full h-full object-cover opacity-35 filter brightness-90 transition-all duration-700 ease-in-out transform scale-105"
                  />
                  {/* Dark Gradients for RoPhim Movie Backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 z-10" />
                </div>

                {/* Header Badge */}
                <div className="relative z-20 p-6 sm:p-8 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 font-label-sm text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-orange-500/40">
                    <span className="material-symbols-outlined text-[18px]">military_tech</span>
                    <span>INNOVATION HIGHLIGHTS • BẢNG VÀNG VINH DANH LEADSGEN</span>
                  </div>
                </div>

                {/* Main Left Content Metadata (Movie Details Style) */}
                <div className="relative z-20 px-6 sm:px-10 md:px-12 py-4 max-w-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg border border-amber-300 animate-pulse">
                      🏆 TOP #{activeItem.rank || rankNum} KHỐI ĐỔI MỚI
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 font-semibold text-xs border border-slate-700">
                      {activeItem.department || 'Tập đoàn LeadsGen'}
                    </span>
                    {activeItem.employeeCode && (
                      <span className="px-2.5 py-1 rounded bg-slate-900/90 text-orange-400 font-mono text-xs font-bold border border-orange-500/30">
                        {activeItem.employeeCode}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display-hero text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
                    {activeItem.fullName}
                  </h2>

                  <p className="font-body-md text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl line-clamp-3">
                    Tuyên dương tinh hoa sáng tạo với thành tích xuất sắc: Đã đóng góp{' '}
                    <strong className="text-orange-400 font-bold">{activeItem.totalIdeas || 0} ý tưởng đột phá</strong> và triển khai thành công{' '}
                    <strong className="text-emerald-400 font-bold">{activeItem.implementedIdeas || 0} dự án PoC</strong> thực tế.
                  </p>

                  {/* Action Controls / Play Button Row */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="#idea-builder"
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-label-lg font-extrabold text-sm shadow-xl shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-[20px] fill-current">play_arrow</span>
                      </div>
                      <span>Vinh Danh & Đóng Góp Sáng Kiến</span>
                    </a>
                    <div className="px-4 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-orange-400 font-mono-metric font-black text-sm">
                        {(activeItem.totalScore || 0).toLocaleString('vi-VN')}
                      </span>
                      <span className="font-semibold text-slate-400">ĐIỂM TÍCH LŨY</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Right Thumbnail Strip Navigation (Rophim Movie Strip) */}
                <div className="relative z-20 p-6 sm:p-8 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
                  <div className="text-xs text-slate-400 font-label-sm font-semibold">
                    Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                  </div>

                  {/* Thumbnail List Strip */}
                  <div className="flex items-center gap-3 overflow-x-auto max-w-full hide-scrollbar py-1">
                    {leaderboardItems.map((item, idx) => {
                      const isActive = idx === activeCarouselDot;
                      const itemBg = item.avatarUrl && item.avatarUrl.startsWith('http')
                        ? item.avatarUrl
                        : bgImages[idx % bgImages.length];

                      return (
                        <button
                          key={item.userId || item.employeeCode || idx}
                          type="button"
                          onClick={() => onSelectIndex(idx)}
                          className={`relative group shrink-0 w-24 sm:w-28 h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                            isActive
                              ? 'border-orange-500 scale-105 ring-2 ring-orange-500/50 shadow-lg'
                              : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                          }`}
                        >
                          <img
                            src={itemBg}
                            alt={item.fullName}
                            className="w-full h-full object-cover filter brightness-90 group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                          <div className="absolute bottom-1.5 left-2 right-2 text-left truncate">
                            <span className="text-[10px] font-bold text-white block truncate">
                              {item.fullName}
                            </span>
                            <span className="text-[9px] text-orange-400 font-mono font-bold block">
                              Top #{item.rank || idx + 1}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm w-full">
            Chưa có dữ liệu vinh danh. Hãy nộp sáng kiến đầu tiên để lên bảng vàng!
          </div>
        )}
      </div>
    </section>
  );
}
