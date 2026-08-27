'use client';

import React from 'react';
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
      className={`bg-white border-r border-slate-200/80 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              V
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Veda<span className="text-slate-800">AI</span>
              </span>
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

        {/* AI Teacher's Toolkit Pill */}
        {!isCollapsed ? (
          <div className="bg-white border-2 border-[#ff5722]/30 rounded-2xl p-2.5 flex items-center gap-2 shadow-sm hover:border-[#ff5722] transition-colors cursor-pointer group">
            <div className="w-6 h-6 rounded-full bg-[#ff5722]/10 flex items-center justify-center text-[#ff5722]">
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              AI Teacher&apos;s Toolkit
            </span>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-2xl border-2 border-[#ff5722]/40 flex items-center justify-center text-[#ff5722] cursor-pointer hover:bg-[#ff5722]/10 transition-colors">
            <Sparkles size={18} />
          </div>
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
