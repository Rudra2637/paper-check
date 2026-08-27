'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function LoadingView({ progressText = 'Extracting...', stage = 'Analyzing document pages' }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[calc(100vh-4rem)] bg-white">
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Animated Sparkle Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-orange-100/50 absolute animate-ping opacity-40" />
          <div className="relative w-20 h-20 flex items-center justify-center animate-sparkle">
            <Image
              src="/extract.png"
              alt="Extracting..."
              width={80}
              height={80}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain drop-shadow-md"
              priority
              onError={(e) => {
                // Fallback icon if image missing
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {progressText}
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          This may take a while
        </p>

        {/* Real-time Stage Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-600 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-pulse" />
          <span>{stage}</span>
        </div>
      </div>
    </div>
  );
}
