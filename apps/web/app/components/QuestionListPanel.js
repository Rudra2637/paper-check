'use client';

import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function QuestionListPanel({
  questions = [],
  answers = [],
  activeQuestionId,
  onSelectQuestion,
}) {
  const [expandedMap, setExpandedMap] = useState({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const toggleExpand = (qId) => {
    setExpandedMap((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleToggleExpandAll = () => {
    const nextState = !isAllExpanded;
    setIsAllExpanded(nextState);
    const newMap = {};
    questions.forEach((q) => {
      newMap[q.id] = nextState;
    });
    setExpandedMap(newMap);
  };

  const findAnswerForQuestion = (qId) => {
    return answers.find((a) => a.questionId === qId);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 border-r border-slate-200/80">
      <div className="p-4 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h3 className="font-bold text-sm md:text-base text-slate-900">
            Extracted Questions <span className="text-xs font-normal text-slate-500">(from question paper)</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            {questions.length} questions detected
          </p>
        </div>

        <button
          onClick={handleToggleExpandAll}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
        >
          {isAllExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Scrollable Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {questions.map((question) => {
          const answer = findAnswerForQuestion(question.id);
          const isActive = activeQuestionId === question.id;
          const isExpanded = expandedMap[question.id] || (isActive && expandedMap[question.id] !== false);

          return (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answer}
              isActive={isActive}
              onSelect={() => onSelectQuestion(question.id)}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleExpand(question.id)}
            />
          );
        })}

        {/* Unmatched / Extra Writing Section */}
        {answers.filter((a) => a.status === 'UNMATCHED' || a.questionId?.startsWith('unmatched')).map((unmatched, uIdx) => {
          const isActive = activeQuestionId === (unmatched.questionId || `unmatched_${uIdx}`);
          const pageNum = unmatched.regions?.[0]?.pageNumber || 1;
          const transcript = unmatched.regions?.[0]?.transcription || unmatched.evaluation?.feedback || 'Unassigned handwritten writing or rough work.';

          return (
            <div
              key={`unmatched-${uIdx}`}
              onClick={() => onSelectQuestion(unmatched.questionId || `unmatched_${uIdx}`)}
              className={`rounded-2xl transition-all cursor-pointer border p-4 mt-4 ${
                isActive
                  ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                  : 'border-dashed border-amber-300/80 bg-amber-50/30 hover:bg-amber-50/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    ⚠️ Extra / Unmatched Writing
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    📄 Page {pageNum}
                  </span>
                </div>
                <span className="text-[11px] text-amber-700 font-semibold">
                  Not in Exam
                </span>
              </div>
              <p className="text-xs text-slate-700 font-mono italic bg-white/80 p-2 rounded-xl border border-amber-200/60">
                &quot;{transcript}&quot;
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Click to view and highlight this writing on the answer sheet.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
