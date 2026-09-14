import React from 'react';

export default function CoreValuesSection() {
  return (
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
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                <span><strong className="text-slate-900">Nộp ý tưởng:</strong> Điền Idea Builder trực tuyến gửi tới Ban Quản trị Quỹ Sáng Tạo.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
                <span><strong className="text-slate-900">Thẩm định 48h:</strong> Ban Quản trị Quỹ phản hồi & giải ngân thưởng 5M.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <span><strong className="text-slate-900">Cấp vốn & PoC:</strong> Nhận vốn tới 200M và cố vấn từ Ban Quản trị & C-Level.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span><strong className="text-slate-900">Thương mại hóa:</strong> Triển khai quy mô toàn tập đoàn & chia sẻ lợi nhuận.</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold font-label-md">
            <span>Đồng hành cùng Ban Quản trị & Tech Lead LeadsGen</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </div>
        </div>
      </div>
    </section>
  );
}
