'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadView from './components/UploadView';
import LoadingView from './components/LoadingView';
import MappingWorkspace from './components/MappingWorkspace';

export default function Home() {
  const [currentView, setCurrentView] = useState('upload'); // 'upload' | 'loading' | 'workspace'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Analyzing document pages...');
  const [errorMessage, setErrorMessage] = useState(null);

  // Assessment state
  const [questionPages, setQuestionPages] = useState([]);
  const [answerPages, setAnswerPages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [overallSummary, setOverallSummary] = useState(null);

  // Handle Real Document Processing
  const handleStartMapping = async ({ questionPages, answerPages }) => {
    setQuestionPages(questionPages);
    setAnswerPages(answerPages);
    setCurrentView('loading');
    setIsSidebarCollapsed(true);
    setLoadingStage('Extracting questions from question paper...');

    try {
      // Small timeout for realistic stage feedback
      setTimeout(() => {
        setLoadingStage('Mapping handwritten answers & calculating coordinates...');
      }, 3000);

      const response = await fetch('/api/process-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionPages,
          answerPages,
          useDemoData: false,
        }),
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        if (response.status === 504 || rawText.includes('TIMEOUT') || rawText.includes('timed out')) {
          throw new Error('Processing timed out on serverless function. Please retry or use 1-Click Demo.');
        }
        throw new Error(rawText || 'Server returned an invalid response format.');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to process assessment');
      }

      setQuestions(data.questions || []);
      setAnswers(data.answers || []);
      setOverallSummary(data.overallSummary || null);
      setCurrentView('workspace');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during extraction. Please retry.');
      setCurrentView('upload');
      setIsSidebarCollapsed(false);
    }
  };

  // Handle 1-Click Demo Evaluation
  const handleUseDemo = async () => {
    setCurrentView('loading');
    setIsSidebarCollapsed(true);
    setLoadingStage('Loading sample question paper and answer sheets...');

    try {
      const response = await fetch('/api/process-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useDemoData: true }),
      });

      const data = await response.json();

      setQuestions(data.questions || []);
      setAnswers(data.answers || []);
      setOverallSummary(data.overallSummary || null);
      
      // Load the authentic sample answer sheet image
      setAnswerPages([
        {
          pageNumber: 1,
          dataUrl: '/samples/student_answersheet.jpg',
          width: 800,
          height: 1100,
        },
      ]);
      
      setTimeout(() => {
        setCurrentView('workspace');
      }, 1000);
    } catch (err) {
      console.error(err);
      setCurrentView('upload');
      setIsSidebarCollapsed(false);
    }
  };

  const handleReset = () => {
    setCurrentView('upload');
    setIsSidebarCollapsed(false);
    setQuestions([]);
    setAnswers([]);
    setQuestionPages([]);
    setAnswerPages([]);
    setOverallSummary(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {/* Figma Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onBack={currentView !== 'upload' ? handleReset : undefined}
          showBackButton={currentView !== 'upload'}
          title="Exams"
        />

        <main className="flex-1 flex flex-col">
          {errorMessage && currentView === 'upload' && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="underline hover:text-red-950 ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {currentView === 'upload' && (
            <UploadView
              onStartMapping={handleStartMapping}
              onUseDemo={handleUseDemo}
            />
          )}

          {currentView === 'loading' && (
            <LoadingView
              progressText="Extracting..."
              stage={loadingStage}
            />
          )}

          {currentView === 'workspace' && (
            <MappingWorkspace
              questions={questions}
              answers={answers}
              answerPages={answerPages}
              overallSummary={overallSummary}
              onReset={handleReset}
            />
          )}
        </main>
      </div>
    </div>
  );
}
