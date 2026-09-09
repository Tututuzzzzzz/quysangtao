import React from 'react';

export default function LeadsGenLogo({ size = 'md', dark = false, className = '', showSubtitle = false }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoHeight = isSmall ? 'h-7' : isLarge ? 'h-9' : 'h-7';
  const borderStyle = dark ? 'border-amber-500/50 text-amber-400' : 'border-orange-300 text-orange-500';

  return (
    <div className={`flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      <img
        src="https://static.ybox.vn/2025/7/4/1753954730921-LeadsgenLogo2.png"
        alt="LeadsGen Logo"
        className={`${logoHeight} w-auto object-contain transition-transform hover:scale-105 shrink-0`}
      />
      {showSubtitle && (
        <span className={`font-extrabold tracking-widest uppercase text-[11px] border-l-2 ${borderStyle} pl-2 py-0.5 leading-none shrink-0 whitespace-nowrap`}>
          QUỸ SÁNG TẠO
        </span>
      )}
    </div>
  );
}
