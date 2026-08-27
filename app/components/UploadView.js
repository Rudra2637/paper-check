'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, FileText, X, ArrowRight, Sparkles } from 'lucide-react';
import { processUploadedFile } from '@/app/lib/document-processor';

export default function UploadView({ onStartMapping, onUseDemo }) {
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [questionPages, setQuestionPages] = useState([]);
  const [answerPages, setAnswerPages] = useState([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const questionInputRef = useRef(null);
  const answerInputRef = useRef(null);

  const handleQuestionFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsProcessingFiles(true);
    try {
      const pages = await processUploadedFile(file);
      setQuestionFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
        pagesCount: pages.length,
      });
      setQuestionPages(pages);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process question paper. Please ensure it is a valid PDF or image.');
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const handleAnswerFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsProcessingFiles(true);
    try {
      const pages = await processUploadedFile(file);
      setAnswerFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
        pagesCount: pages.length,
      });
      setAnswerPages(pages);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process answer sheet. Please ensure it is a valid PDF or image.');
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const handleRemoveQuestion = (e) => {
    e.stopPropagation();
    setQuestionFile(null);
    setQuestionPages([]);
    if (questionInputRef.current) questionInputRef.current.value = '';
  };

  const handleRemoveAnswer = (e) => {
    e.stopPropagation();
    setAnswerFile(null);
    setAnswerPages([]);
    if (answerInputRef.current) answerInputRef.current.value = '';
  };

  const isReady = questionPages.length > 0 && answerPages.length > 0 && !isProcessingFiles;

  const handleSubmit = () => {
    if (!isReady) return;
    onStartMapping({ questionPages, answerPages, questionFile, answerFile });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-5xl mx-auto w-full min-h-[calc(100vh-4rem)]">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
          Upload <span className="text-[#ff5722]">Question Paper & Answer Sheets</span>
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Upload both files to get started
        </p>
      </div>

      {/* Center Teacher Avatar Graphic */}
      <div className="relative mb-10 flex items-center justify-center">
        {/* Soft decorative concentric rings */}
        <div className="w-28 h-28 rounded-full bg-orange-100/60 absolute animate-ping opacity-30" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-200/50 to-orange-100/30 flex items-center justify-center p-2 shadow-inner">
          <div className="w-18 h-18 rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center relative">
            <Image
              src="/Teacher.png"
              alt="Teacher Illustration"
              width={72}
              height={72}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain"
              priority
              onError={(e) => {
                // Fallback emoji if image missing
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Dual Upload Dropzone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
        {/* Card 1: Question Paper */}
        <input
          type="file"
          ref={questionInputRef}
          onChange={handleQuestionFileUpload}
          accept="application/pdf,image/*"
          className="hidden"
        />
        <div
          onClick={() => !questionFile && questionInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[170px] ${
            questionFile
              ? 'border-slate-300 bg-white shadow-xs'
              : 'border-slate-300/90 bg-white/70 hover:bg-white hover:border-[#ff5722]/60 cursor-pointer shadow-2xs hover:shadow-md'
          }`}
        >
          {questionFile ? (
            <div className="flex items-center justify-between w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs border border-red-200">
                  <FileText size={20} />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                    {questionFile.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {questionFile.size} • {questionFile.pagesCount} {questionFile.pagesCount === 1 ? 'Page' : 'Pages'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveQuestion}
                className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors ml-2"
                title="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                <Upload size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Upload <span className="text-[#ff5722]">Question Paper</span>
              </p>
              <p className="text-xs text-slate-400">Max 10MB (PDF or Image)</p>
            </>
          )}
        </div>

        {/* Card 2: Student Answer Sheet */}
        <input
          type="file"
          ref={answerInputRef}
          onChange={handleAnswerFileUpload}
          accept="application/pdf,image/*"
          className="hidden"
        />
        <div
          onClick={() => !answerFile && answerInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[170px] ${
            answerFile
              ? 'border-slate-300 bg-white shadow-xs'
              : 'border-slate-300/90 bg-white/70 hover:bg-white hover:border-[#ff5722]/60 cursor-pointer shadow-2xs hover:shadow-md'
          }`}
        >
          {answerFile ? (
            <div className="flex items-center justify-between w-full p-2 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs border border-red-200">
                  <FileText size={20} />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                    {answerFile.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {answerFile.size} • {answerFile.pagesCount} {answerFile.pagesCount === 1 ? 'Page' : 'Pages'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveAnswer}
                className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors ml-2"
                title="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                <Upload size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Upload <span className="text-[#ff5722]">Answer Sheet</span>
              </p>
              <p className="text-xs text-slate-400">Max 10MB (PDF or Image)</p>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="mb-4 text-xs font-medium text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
          {uploadError}
        </div>
      )}

      {/* Start Mapping Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!isReady}
          className={`flex items-center gap-2.5 px-8 py-3 rounded-2xl font-semibold text-sm transition-all shadow-sm ${
            isReady
              ? 'bg-slate-900 hover:bg-black text-white cursor-pointer hover:shadow-lg transform active:scale-98'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Start Mapping</span>
          <ArrowRight size={16} />
        </button>

        <p className="text-xs text-slate-400">
          Once both files are uploaded, you&apos;ll able to map answers with questions
        </p>

        {/* 1-Click Demo Evaluation Button */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Want to see it in action?</span>
          <button
            onClick={onUseDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ff5722] text-xs font-semibold rounded-xl border border-[#ff5722]/30 transition-all cursor-pointer"
          >
            <Sparkles size={13} />
            <span>Try Sample Demo Exam</span>
          </button>
        </div>
      </div>
    </div>
  );
}
