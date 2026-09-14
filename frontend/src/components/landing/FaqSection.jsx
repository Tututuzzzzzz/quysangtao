import React, { useState } from 'react';

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Ai có quyền gửi ý tưởng vào Quỹ Sáng Tạo LeadsGen?",
      a: "Tất cả cán bộ nhân viên, thực tập sinh, CTV đang công tác tại các đơn vị, phòng ban trực thuộc Tập đoàn LeadsGen đều có quyền đăng ký sáng kiến."
    },
    {
      q: "Quy trình thẩm định 48h diễn ra như thế nào?",
      a: "Sau khi gửi ý tưởng trực tuyến, Ban Quản trị Quỹ sẽ nghiên cứu sơ loại trong 48h. Nếu ý tưởng đáp ứng tiêu chí tính mới và tính khả thi, bạn sẽ nhận được phần thưởng 5M và cơ hội bảo vệ dự án trước Ban Giám Đốc."
    },
    {
      q: "Quyền sở hữu trí tuệ & bản quyền ý tưởng thuộc về ai?",
      a: "Người nộp sáng kiến được công nhận là Tác giả sáng lập (Founder Author), được gắn tên vĩnh viễn trên sản phẩm và hưởng tỷ lệ chia sẻ doanh thu/lợi nhuận khi thương mại hóa thành công."
    },
    {
      q: "Nếu ý tưởng của tôi cần cả đội ngũ hỗ trợ thì sao?",
      a: "Bạn có thể điền thông tin các Đồng tác giả (Co-authors) ở Bước 4 trong Idea Builder. Quỹ sẽ hỗ trợ ghép đội ngũ Kỹ thuật/Product nếu dự án được duyệt cấp vốn."
    }
  ];

  return (
    <section id="faqs" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-label-sm text-xs uppercase tracking-widest text-orange-600 font-bold">Giải Đáp Thắc Mắc</span>
          <h2 className="font-headline-xl text-3xl font-extrabold text-slate-900 mt-2">
            Câu Hỏi Thường Gặp Về Quỹ LeadsGen
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden border border-slate-200/80 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-headline-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-[24px] text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 border-t border-slate-100 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
