import React from 'react';

export default function CoreValuesSection() {
  return (
    <section id="why-what" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="font-label-sm text-xs uppercase tracking-widest text-orange-600 font-extrabold px-3 py-1 bg-orange-50 rounded-full border border-orange-200">
          CƠ CHẾ ĐỔI MỚI LIÊN TỤC LEADSGEN
        </span>
        <h2 className="font-headline-xl text-3xl md:text-4xl font-black text-slate-900 mt-3 tracking-tight">
          Idea → Action → Impact → Recognition
        </h2>
        <p className="font-body-md text-slate-600 mt-3 text-base leading-relaxed font-medium">
          Quỹ Sáng tạo & Cải tiến không chỉ là quỹ thưởng mà là cơ chế xây dựng văn hóa đổi mới liên tục: <br className="hidden sm:inline" />
          <strong className="text-slate-900">Nhìn thấy vấn đề → Đề xuất → Được hỗ trợ thử nghiệm → Tạo giá trị → Được ghi nhận.</strong>
        </p>
      </div>

      {/* 2 Core Idea Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Category 1: Better Work */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl glow-hover border-t-4 border-t-orange-500 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[30px]">precision_manufacturing</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-black uppercase tracking-wider border border-orange-500/20">
                Better Work
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Tối Ưu Công Việc & Năng Suất</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Nhanh hơn, đơn giản hơn, ít lỗi hơn, tiết kiệm thời gian & chi phí, tăng chất lượng công việc. Tự động hóa quy trình, loại bỏ bước thừa.
            </p>
            <div className="mt-5 space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                <span className="material-symbols-outlined text-orange-500 text-[18px]">verified</span>
                <span><strong className="text-slate-900">Hỗ trợ Pilot:</strong> Manager trực tiếp cấp nguồn lực & thời gian thử nghiệm nhóm nhỏ.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                <span className="material-symbols-outlined text-orange-500 text-[18px]">payments</span>
                <span><strong className="text-slate-900">Thưởng Cấp 3:</strong> Thưởng theo giá trị thực tế (`Cost/Time Saving × %`), không trần cứng.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category 2: Better Workplace */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl glow-hover border-t-4 border-t-sky-500 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[30px]">sentiment_satisfied</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-black uppercase tracking-wider border border-sky-500/20">
                Better Workplace
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Môi Trường & Trải Nghiệm Nhân Viên</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Tạo môi trường làm việc thuận tiện, tích cực và có trải nghiệm nhân viên tốt hơn. Onboarding, giao tiếp nội bộ, phúc lợi, không gian & gắn kết.
            </p>
            <div className="mt-5 space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50/60 border border-sky-100">
                <span className="material-symbols-outlined text-sky-500 text-[18px]">bolt</span>
                <span><strong className="text-slate-900">Quick Win HR:</strong> HR chủ động phê duyệt các ý tưởng chi phí dưới 20 Triệu VNĐ.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50/60 border border-sky-100">
                <span className="material-symbols-outlined text-sky-500 text-[18px]">favorite</span>
                <span><strong className="text-slate-900">Mục tiêu 6 tháng:</strong> Tạo niềm tin hành động: Đề xuất → HR nghe → Công ty triển khai.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Tier Recognition Framework Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 font-mono">
            3 CẤP ĐỘ GHI NHẬN & THƯỞNG
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            DÁM NGHĨ → DÁM THỬ → TẠO TÁC ĐỘNG
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            100% ý tưởng được phản hồi minh bạch theo 3 trạng thái: <strong className="text-emerald-400">GO</strong>, <strong className="text-amber-400">WAIT</strong>, <strong className="text-red-400">NO-GO</strong> (có kèm lý do rõ ràng).
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Tier 1 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-orange-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 font-black text-xs uppercase border border-orange-500/30">
                  CẤP 1 – IDEA
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Dám nghĩ</span>
              </div>
              <h4 className="text-lg font-extrabold text-white">Khởi Tạo & Đề Xuất</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Ý tưởng làm rõ vấn đề & giải pháp mới có tiềm năng tạo giá trị, chưa cần chứng minh hiệu quả ngay.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="text-amber-400 font-bold">🎁 Phần Thưởng & Ghi Nhận:</div>
                <div className="text-slate-300 font-mono">Up to 1.000.000 VNĐ tiền mặt</div>
                <div className="text-slate-400 text-[11px]">Huy hiệu "Dám nghĩ", vinh danh & trình bày sáng kiến.</div>
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs uppercase border border-amber-500/30">
                  CẤP 2 – PILOT
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Dám thử</span>
              </div>
              <h4 className="text-lg font-extrabold text-white">Thử Nghiệm PoC</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Được hỗ trợ biến ý tưởng thành hành động thử nghiệm nhóm nhỏ. Có Owner, thời gian & chỉ số đo.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="text-amber-400 font-bold">🎁 Phần Thưởng & Ghi Nhận:</div>
                <div className="text-slate-300 font-mono">2.000.000 – 5.000.000 VNĐ</div>
                <div className="text-slate-400 text-[11px]">Huy hiệu "Dám thử", Quick Win &lt;20M HR duyệt, mở rộng Pilot.</div>
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs uppercase border border-emerald-500/30">
                  CẤP 3 – IMPACT
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Tạo tác động</span>
              </div>
              <h4 className="text-lg font-extrabold text-white">Áp Dụng & Nhân Rộng</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Chứng minh hiệu quả thực tế bằng số liệu đo lường. Được phê duyệt triển khai quy mô toàn tập đoàn.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="text-emerald-400 font-bold">🎁 Thưởng Theo Tác Động Thực Tế:</div>
                <div className="text-slate-300 font-mono">Cost/Time Saving × % Thưởng</div>
                <div className="text-slate-400 text-[11px]">Không trần cứng thưởng tài chính, vinh danh cấp C-Level.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
