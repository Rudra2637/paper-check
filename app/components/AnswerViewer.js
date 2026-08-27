'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function AnswerViewer({
  answerPages = [],
  activeAnswer = null,
  activeQuestion = null,
  allAnswers = [],
}) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const containerRef = useRef(null);
  const pageRef = useRef(null);

  // Auto-switch page when active answer changes
  useEffect(() => {
    if (activeAnswer && activeAnswer.regions && activeAnswer.regions.length > 0) {
      const targetPageNum = activeAnswer.regions[0].pageNumber;
      const targetIndex = targetPageNum - 1;
      if (targetIndex >= 0 && targetIndex < (answerPages.length || 2)) {
        setCurrentPageIndex(targetIndex);
      }
    }
  }, [activeAnswer, answerPages.length]);

  const totalPages = Math.max(answerPages.length, 2); // Default to at least 2 for demo
  const currentPageNumber = currentPageIndex + 1;
  const currentPageData = answerPages[currentPageIndex];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 175));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 60));
  };

  const handlePrevPage = () => {
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  // Find all active regions on the current page for the selected question
  const activeRegionsOnCurrentPage = activeAnswer?.regions?.filter(
    (r) => r.pageNumber === currentPageNumber
  ) || [];

  return (
    <div className="flex flex-col h-full bg-slate-100 relative select-none">
      {/* Top Controls Bar matching Figma */}
      <div className="h-14 px-5 bg-white border-b border-slate-200/80 flex items-center justify-between z-10">
        <h4 className="font-bold text-sm text-slate-800 tracking-tight">
          Answersheet
        </h4>

        {/* Center/Right: Zoom & Page Controls */}
        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100/90 rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 gap-2 border border-slate-200/60 shadow-2xs">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
              title="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Page navigation */}
          <div className="flex items-center bg-slate-100/90 rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 gap-1.5 border border-slate-200/60 shadow-2xs">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span>
              Page {currentPageNumber} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === totalPages - 1}
              className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Viewer Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start"
      >
        <div
          ref={pageRef}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative bg-white shadow-xl rounded-xl border border-slate-300/80 overflow-hidden w-full max-w-2xl min-h-[850px]"
        >
          {/* If real page image exists */}
          {currentPageData?.dataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentPageData.dataUrl}
              alt={`Answer Sheet Page ${currentPageNumber}`}
              className="w-full h-auto object-contain pointer-events-none"
            />
          ) : (
            <div className="p-8 font-serif leading-relaxed text-slate-800 text-sm min-h-[850px] relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              {currentPageNumber === 1 ? (
                <div className="space-y-10">
                  {/* Demo Q1 Handwritten block */}
                  <div className="p-4 rounded-lg bg-blue-50/20 border-l-2 border-slate-300">
                    <p className="font-bold text-slate-700 mb-1">Q1.</p>
                    <p className="italic text-slate-700">
                      Photosynthesis is the process used by green plants and some other organisms to convert light energy into chemical energy.
                    </p>
                    <div className="my-3 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-center">
                      6CO₂ + 6H₂O ──[Light / Chlorophyll]──&gt; C₆H₁₂O₆ + 6O₂
                    </div>
                  </div>

                  {/* Demo Q2 Handwritten block */}
                  <div className="p-4 rounded-lg bg-emerald-50/20 border-l-2 border-slate-300">
                    <p className="font-bold text-slate-700 mb-1">Q2.</p>
                    <p className="italic text-slate-700">
                      The process mainly occurs in the chloroplast of the plant cell. It has two main stages:
                    </p>
                    <ul className="list-disc pl-5 mt-1 text-slate-700 text-xs space-y-1 italic">
                      <li>1. Light reaction -- Captures light energy.</li>
                      <li>2. Dark reaction -- Uses energy to make glucose.</li>
                    </ul>
                  </div>

                  {/* Demo Q1 continuation / other */}
                  <div className="p-4 rounded-lg bg-slate-50/50 border-l-2 border-slate-300">
                    <p className="font-bold text-slate-700 mb-1">Q3.</p>
                    <p className="italic text-slate-700">
                      Chlorophyll absorbs red and blue light from sunlight and reflects green light, giving plants their characteristic color.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="p-4 rounded-lg bg-slate-50/30 border-l-2 border-slate-300">
                    <p className="font-bold text-slate-700 mb-1">Q4.</p>
                    <p className="italic text-slate-700">
                      Blood flow through the human heart starts from the right atrium and enters the right ventricle through the tricuspid valve...
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50/30 border-l-2 border-slate-300">
                    <p className="font-bold text-slate-700 mb-1">Q5.</p>
                    <p className="italic text-slate-700">
                      Alveoli have thin walls surrounded by capillaries facilitating rapid gas exchange of O₂ and CO₂.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC SVG / HTML HIGHLIGHT BOUNDING BOX OVERLAYS */}
          {activeRegionsOnCurrentPage.map((region, idx) => {
            const box = region.box;
            if (!box) return null;

            // Ensure the box has enough vertical height to cover both the label AND all answer lines below it
            const currentHeight = box.ymax - box.ymin;
            const minContentHeight = 80; // minimum height ensuring header + body lines are enclosed
            const effectiveHeight = Math.max(currentHeight, minContentHeight);

            const padYTop = 8;
            const padYBottom = 16;
            const ymin = Math.max(0, box.ymin - padYTop);
            const ymax = Math.min(1000, box.ymin + effectiveHeight + padYBottom);

            // Ensure xmin starts cleanly to the left of the label and extends across the written section
            const xmin = Math.max(20, Math.min(box.xmin - 20, 50));
            const xmax = Math.min(970, Math.max(box.xmax + 20, 940));

            const topPct = (ymin / 1000) * 100;
            const leftPct = (xmin / 1000) * 100;
            const widthPct = ((xmax - xmin) / 1000) * 100;
            const heightPct = ((ymax - ymin) / 1000) * 100;

            const isUnmatched = activeAnswer?.status === 'UNMATCHED' || activeAnswer?.questionId?.startsWith('unmatched');
            const questionLabel = isUnmatched
              ? '📝 Unmatched Writing'
              : activeQuestion?.number
              ? `Q${activeQuestion.number}.`
              : 'Answer';

            return (
              <div
                key={`box-${idx}`}
                style={{
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
                className={`absolute border-2 rounded-2xl transition-all duration-300 pointer-events-none ${
                  isUnmatched
                    ? 'border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/20'
                    : 'border-[#22c55e] bg-[#22c55e]/15 highlight-box-active'
                }`}
              >
                {/* Badge on Top-Left */}
                <div
                  className={`absolute -top-3.5 -left-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 text-white ${
                    isUnmatched ? 'bg-amber-600' : 'bg-[#16a34a]'
                  }`}
                >
                  <span>{questionLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
