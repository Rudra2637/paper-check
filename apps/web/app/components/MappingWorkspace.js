'use client';

import React, { useState } from 'react';
import QuestionListPanel from './QuestionListPanel';
import AnswerViewer from './AnswerViewer';
import { Sparkles, FileText, CheckCircle2, Award } from 'lucide-react';

export default function MappingWorkspace({
  questions = [],
  answers = [],
  answerPages = [],
  overallSummary = null,
  onReset,
}) {
  const [activeQuestionId, setActiveQuestionId] = useState(questions[0]?.id || null);
  const [mobileTab, setMobileTab] = useState('questions'); // 'questions' | 'answers'

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);
  const activeAnswer = answers.find((a) => a.questionId === activeQuestionId);

  const handleSelectQuestion = (qId) => {
    setActiveQuestionId(qId);

    if (window.innerWidth < 768) {
      setMobileTab('answers');
    }
  };

  const totalScore = overallSummary?.totalMarksAwarded ?? answers.reduce((acc, a) => acc + (a.evaluation?.scoreAwarded || 0), 0);
  const totalMax = overallSummary?.totalMaxMarks ?? questions.reduce((acc, q) => acc + (q.maxMarks || 0), 0);
  const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">

      {/* Mobile Segmented Tab Toggle matching Figma Mobile Screen */}
      <div className="md:hidden flex px-4 py-3 bg-[#f0f2f5] border-b border-slate-200/60">
        <div className="flex w-full bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setMobileTab('questions')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'questions'
                ? 'bg-[#1e232a] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setMobileTab('answers')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'answers'
                ? 'bg-[#1e232a] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            Answer Sheet
          </button>
        </div>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Question List */}
        <div
          className={`w-full md:w-[46%] lg:w-[42%] h-full flex-shrink-0 ${mobileTab === 'questions' ? 'block' : 'hidden md:block'
            }`}
        >
          <QuestionListPanel
            questions={questions}
            answers={answers}
            activeQuestionId={activeQuestionId}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>

        {/* Right Pane: Answer Sheet Document Viewer with Bounding Box Highlighting */}
        <div
          className={`flex-1 h-full overflow-hidden ${mobileTab === 'answers' ? 'block' : 'hidden md:block'
            }`}
        >
          <AnswerViewer
            answerPages={answerPages}
            activeAnswer={activeAnswer}
            activeQuestion={activeQuestion}
            allAnswers={answers}
          />
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="h-12 px-6 bg-white border-t border-slate-200/80 flex items-center justify-between z-10 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Award size={15} className="text-[#ff5722]" />
            <span>Score: {totalScore} / {totalMax}</span>
            <span className="text-slate-400 font-normal">({percentage}%)</span>
          </div>

          {overallSummary?.strengths?.[0] && (
            <span className="hidden lg:inline text-slate-500 truncate max-w-md">
              💡 <span className="font-semibold text-slate-700">Top Strength:</span> {overallSummary.strengths[0]}
            </span>
          )}
        </div>

        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 hover:underline cursor-pointer"
        >
          Upload New Assessment
        </button>
      </div>
    </div>
  );
}
