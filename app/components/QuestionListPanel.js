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
      </div>
    </div>
  );
}
