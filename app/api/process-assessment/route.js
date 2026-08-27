import { NextResponse } from 'next/server';
import { extractQuestionsFromPages, mapAnswersAndGrade } from '@/app/lib/groq-service';
import { SAMPLE_QUESTIONS, SAMPLE_MAPPED_ANSWERS, SAMPLE_OVERALL_SUMMARY } from '@/app/lib/mock-data';

export const maxDuration = 60; // Allow sufficient time for vision processing

export async function POST(request) {
  try {
    const body = await request.json();
    const { questionPages, answerPages, useDemoData } = body;

    // If demo mode is requested or no files provided
    if (useDemoData) {
      return NextResponse.json({
        success: true,
        isDemo: true,
        questions: SAMPLE_QUESTIONS,
        answers: SAMPLE_MAPPED_ANSWERS,
        overallSummary: SAMPLE_OVERALL_SUMMARY,
      });
    }

    if (!questionPages || questionPages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least one Question Paper page image.' },
        { status: 400 }
      );
    }

    if (!answerPages || answerPages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least one Answer Sheet page image.' },
        { status: 400 }
      );
    }

    // Step 1: Extract Questions from Question Paper pages
    const questions = await extractQuestionsFromPages(questionPages);

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid exam questions detected in the Question Paper. Please ensure you uploaded a proper question paper (and verify that files were not accidentally swapped with the Answer Sheet).',
        },
        { status: 400 }
      );
    }

    // Step 2: Map Student Handwritten Answers & Grade against Questions
    const mappingResult = await mapAnswersAndGrade(answerPages, questions);

    return NextResponse.json({
      success: true,
      questions,
      answers: mappingResult.answers || [],
      overallSummary: mappingResult.overallSummary || null,
    });
  } catch (error) {
    console.error('Error in assessment processing pipeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during document assessment extraction.',
      },
      { status: 500 }
    );
  }
}
