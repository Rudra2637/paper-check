'use client';

import React from 'react';
import Image from 'next/image';

export default function LoadingView({ progressText = 'Extracting...', stage = 'Analyzing document pages' }) {
  return (
    <div className="flex-1 flex flex-col p-3 sm:p-6 bg-[#f8f9fb] min-h-[calc(100vh-4rem)]">
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center p-6 md:p-12">
        <div className="flex flex-col items-center text-center max-w-sm">
          {/* Animated Sparkle Icon */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-orange-100/40 absolute animate-ping opacity-30" />
            <div className="relative w-24 h-24 flex items-center justify-center animate-sparkle">
              <Image
                src="/extract.png"
                alt="Extracting..."
                width={88}
                height={88}
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain drop-shadow-sm"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {progressText}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mb-6">
            This may take a while
          </p>

          {/* Real-time Stage Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] font-medium text-slate-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-pulse" />
            <span>{stage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
