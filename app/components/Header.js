'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, HelpCircle, Bell, Sparkles, ChevronDown } from 'lucide-react';

export default function Header({ onBack, showBackButton = true, title = 'Exams' }) {
  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <h1 className="font-semibold text-slate-800 text-base">{title}</h1>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-4">
        {/* Help Icon */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <HelpCircle size={18} />
        </button>

        {/* Notifications with Orange Badge */}
        <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5722]" />
        </button>

        {/* Sparkle Action */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-[#ff5722] hover:bg-orange-50 transition-colors">
          <Sparkles size={18} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative">
            <Image
              src="/userIcon.jpg"
              alt="Madhur Rastogi"
              width={32}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
              className="object-cover"
              onError={(e) => {
                // Fallback if image fails
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950 hidden sm:inline">
            Madhur Rastogi
          </span>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-700 hidden sm:inline" />
        </div>
      </div>
    </header>
  );
}
