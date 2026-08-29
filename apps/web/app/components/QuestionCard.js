'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function QuestionCard({
  question,
  answer,
  isActive,
  onSelect,
  isExpanded,
  onToggleExpand,
}) {
  const isAnswered = answer && answer.status !== 'UNANSWERED' && answer.regions?.length > 0;
  const scoreAwarded = answer?.evaluation?.scoreAwarded ?? 0;
  const maxMarks = question.maxMarks || answer?.evaluation?.maxMarks || 1;
  const isFullMarks = scoreAwarded === maxMarks && isAnswered;
  const isPartial = scoreAwarded > 0 && scoreAwarded < maxMarks;
  const isZero = scoreAwarded === 0 || !isAnswered;

  const getScoreBadge = () => {
    if (!isAnswered) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
          Unanswered
        </span>
      );
    }
    if (isFullMarks) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {scoreAwarded}/{maxMarks}
        </span>
      );
    }
    if (isPartial) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {scoreAwarded}/{maxMarks}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
        {scoreAwarded}/{maxMarks}
      </span>
    );
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl transition-all cursor-pointer border ${isActive
          ? 'border-[#ff5722] bg-[#fffaf8] shadow-md ring-2 ring-[#ff5722]/20'
          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
        } p-4 mb-3`}
    >
      {/* Top Row: Number, Text, Score & Chevron */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Number circle + Question Text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${isActive
                ? 'bg-[#ff5722] text-white'
                : 'bg-slate-900 text-white'
              }`}
          >
            {question.number}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-slate-800 leading-snug">
              {question.text}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {question.topic && (
                <span className="text-[11px] font-medium text-slate-400">
                  {question.topic}
                </span>
              )}
              {isAnswered && answer.regions?.[0]?.pageNumber && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  📄 Page {answer.regions[0].pageNumber}
                  {answer.regions.length > 1 ? ` (+${answer.regions.length - 1} more)` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Score Pill & Chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {getScoreBadge()}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && answer && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
          {/* AI Feedback Card */}
          {answer.evaluation?.feedback && (
            <div className="bg-orange-50/70 border border-[#ff5722]/30 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#ff5722] mb-1">
                <Sparkles size={13} />
                <span>AI Feedback</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {answer.evaluation.feedback}
              </p>
            </div>
          )}

          {/* Student Handwritten Transcription */}
          {answer.regions?.[0]?.transcription && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
              <span className="font-semibold text-slate-600 block mb-1">
                Transcribed Student Answer:
              </span>
              <p className="text-slate-600 italic leading-relaxed whitespace-pre-line font-mono text-[11px]">
                &quot;{answer.regions[0].transcription}&quot;
              </p>
            </div>
          )}

          {/* Multi-page note */}
          {answer.regions && answer.regions.length > 1 && (
            <div className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Answer spans across {answer.regions.length} pages (Pages: {answer.regions.map(r => r.pageNumber).join(', ')})
            </div>
          )}
        </div>
      )}
    </div>
  );
}
