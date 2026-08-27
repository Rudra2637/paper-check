'use client';

import React from 'react';
import Image from 'next/image';
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  BookOpen, 
  Library, 
  Settings, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ isCollapsed, onToggleCollapse, activeScreen = 'exams' }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'classroom', label: 'My Classroom', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'exams', label: 'Exams', icon: BookOpen, active: true },
    { id: 'library', label: 'My Library', icon: Library },
  ];

  return (
    <aside
      className={`hidden md:flex bg-white border-r border-slate-200/80 h-screen sticky top-0 flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!isCollapsed ? (
              <Image
                src="/logo.png"
                alt="VedaAI"
                width={125}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            ) : (
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-start">
                <Image
                  src="/logo.png"
                  alt="VedaAI"
                  width={125}
                  height={32}
                  className="h-8 w-auto max-w-none object-left"
                  priority
                />
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* AI Teacher's Toolkit Pill Button matching User Reference Image */}
        {!isCollapsed ? (
          <button className="w-full bg-[#1e232a] border-2 border-[#ff5722] rounded-full py-2 px-4 flex items-center justify-center gap-2 shadow-md hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group">
            <Sparkles size={14} className="text-white group-hover:rotate-12 transition-transform fill-white/20" />
            <span className="text-xs font-semibold text-white tracking-tight">
              AI Teacher&apos;s Toolkit
            </span>
          </button>
        ) : (
          <button
            className="w-10 h-10 mx-auto rounded-full bg-[#1e232a] border-2 border-[#ff5722] flex items-center justify-center text-white shadow-md hover:bg-black transition-all"
            title="AI Teacher's Toolkit"
          >
            <Sparkles size={16} />
          </button>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeScreen;
            return (
              <button
                key={item.id}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-slate-100/90 text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon size={18} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
        <button
          className={`flex items-center gap-3 px-3.5 py-2 text-slate-500 hover:text-slate-900 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
        >
          <Settings size={18} className="text-slate-400" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {/* School Branding Badge */}
        {!isCollapsed ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-300">
              <GraduationCap size={18} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-slate-800 truncate">
                Delhi Public School
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                Bokaro Steel City
              </span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
            <GraduationCap size={18} />
          </div>
        )}
      </div>
    </aside>
  );
}
