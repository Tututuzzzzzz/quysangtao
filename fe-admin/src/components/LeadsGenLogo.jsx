import React from 'react';

export default function LeadsGenLogo({ size = 'md', dark = true, className = '', showSubtitle = true }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const logoHeight = isSmall ? 'h-7' : isLarge ? 'h-11' : 'h-9';
  const borderStyle = 'border-emerald-500/50 text-[#00FF9D]';

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <img
        src="/logo-leadsgen.png"
        alt="LeadsGen Logo"
        className={`${logoHeight} w-auto object-contain transition-transform hover:scale-105 shrink-0`}
      />
      {showSubtitle && (
        <span className={`font-extrabold tracking-widest uppercase text-[11px] border-l-2 ${borderStyle} pl-2.5 py-0.5 leading-none shrink-0`}>
          ADMIN PORTAL
        </span>
      )}
    </div>
  );
}
