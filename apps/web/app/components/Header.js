'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, HelpCircle, Bell, Sparkles, ChevronDown, Menu } from 'lucide-react';

export default function Header({ onBack, showBackButton = true, title = 'Exams', onOpenMobileMenu }) {
  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Back button & Title / Brand */}
      <div className="flex items-center gap-2.5">
        {showBackButton && (
          <button
            onClick={onBack}
            className="p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft size={19} />
          </button>
        )}

        <div className="md:hidden flex items-center">
          <Image
            src="/logo.png"
            alt="VedaAI"
            width={105}
            height={26}
            className="h-6.5 w-auto object-contain"
            priority
          />
        </div>

        {/* Desktop: Shows breadcrumb title */}
        <h1 className="hidden md:block font-semibold text-slate-800 text-base">{title}</h1>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Help Icon (Desktop only) */}
        <button className="hidden md:flex w-8 h-8 rounded-full items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <HelpCircle size={18} />
        </button>

        {/* Notifications with Orange Badge */}
        <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <Bell size={19} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#ff5722] border-2 border-white" />
        </button>

        {/* Sparkle Action (Desktop only) */}
        <button className="hidden md:flex w-8 h-8 rounded-full items-center justify-center text-slate-500 hover:text-[#ff5722] hover:bg-orange-50 transition-colors">
          <Sparkles size={18} />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 md:pl-2 md:border-l md:border-slate-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative">
            <Image
              src="/userIcon.jpg"
              alt="Madhur Rastogi"
              width={32}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950 hidden md:inline">
            Madhur Rastogi
          </span>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-700 hidden md:inline" />
        </div>

        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors ml-1"
          title="Menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
