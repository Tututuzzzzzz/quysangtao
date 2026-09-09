import React from 'react';
import { Link } from 'react-router-dom';
import LeadsGenLogo from './LeadsGenLogo';
import { MapPin, Mail, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-slate-300 border-t border-slate-800 py-12 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-9 px-2 py-0.5 rounded-lg bg-white ring-1 ring-orange-500/50 flex items-center justify-center">
                <LeadsGenLogo size="sm" />
              </div>
              <span className="font-headline-sm text-base font-bold text-white">LeadsGen</span>
            </div>
            <p className="font-body-sm text-xs text-slate-400 leading-relaxed">
              Cổng ươm mầm sáng kiến và tài trợ vốn hạt giống nội bộ LeadsGen Corporation. Thúc đẩy tinh thần doanh chủ trong từng cá nhân.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-label-sm text-xs font-bold uppercase tracking-wider text-white">Điều Hướng Nhanh</h4>
            <ul className="space-y-2 text-xs font-label-md text-slate-400">
              <li>
                <Link to="/landing" className="hover:text-orange-400 transition-colors">Về Quỹ Sáng Tạo</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">Bảng Điều Khiển Cá Nhân</Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-orange-400 transition-colors">Gửi Ý Tưởng Mới</Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-orange-400 transition-colors">Bảng Vinh Danh Leaderboard</Link>
              </li>
            </ul>
          </div>

          {/* Core Values */}
          <div className="space-y-3">
            <h4 className="font-label-sm text-xs font-bold uppercase tracking-wider text-white">Lĩnh Vực Trọng Tâm</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>Better Work (Tối ưu Năng Suất & AI)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span>Better Workplace (Môi Trường Xanh & Tiện Ích)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Tiết Kiệm Chi Phí & Ngân Sách</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-label-sm text-xs font-bold uppercase tracking-wider text-white">Thông Tin Liên Hệ Nội Bộ</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Tầng 4, Tòa Rainbow, Văn Quán, Hà Đông, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>innovation@leadsgen.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <a href="https://leadsgen.com" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <span>https://leadsgen.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LeadsGen Innovation Engine • LeadsGen Corporation. Mọi quyền được bảo lưu trong hệ thống nội bộ.
        </div>
      </div>
    </footer>
  );
}
