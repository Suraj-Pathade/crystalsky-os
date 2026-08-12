import React from 'react';

export default function Logo({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconDimensions = isSm ? 'w-8 h-8' : isLg ? 'w-12 h-12' : 'w-10 h-10';
  const titleTextSize = isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-base';
  const subTextSize = isSm ? 'text-[9px]' : isLg ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Luxury Crystal Sky Camera Emblem */}
      <div className={`${iconDimensions} rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/25 flex items-center justify-center shrink-0`}>
        <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
          {/* Subtle Lens Ring */}
          <div className="absolute inset-1 rounded-full border border-amber-500/30 animate-pulse"></div>
          {/* Camera Lens + Crystal Star Icon */}
          <svg className="w-3/5 h-3/5 text-amber-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L14.5 8.5L21 9.5L16.25 14L17.5 21L12 17.5L6.5 21L7.75 14L3 9.5L9.5 8.5L12 2Z" />
            <circle cx="12" cy="12" r="3" className="fill-black stroke-amber-400 stroke-2" />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h1 className={`font-extrabold ${titleTextSize} tracking-wider text-white leading-none flex items-center gap-1`}>
          CRYSTAL<span className="text-amber-500">SKY</span>
        </h1>
        <p className={`text-zinc-400 font-semibold tracking-widest uppercase ${subTextSize} mt-0.5`}>
          Photography & Film OS
        </p>
      </div>
    </div>
  );
}
