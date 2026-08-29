import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initializes Gemini client strictly using server-side environment variables
 */
export function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please set it in .env.local.');
  }
  return new GoogleGenerativeAI(key);
}

/**
 * Helper to convert Base64 Data URL to Gemini inlineData part
 */
function fileToGenerativePart(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return {
      inlineData: {
        data: match[2],
        mimeType: match[1],
      },
    };
  }
  return {
    inlineData: {
      data: dataUrl,
      mimeType: 'image/jpeg',
    },
  };
}

/**
 * Extracts structured questions from Question Paper page images using Gemini 1.5 Flash.
 * Treats labelled sub-parts (e.g., 11(a), 11(b)) as distinct question entries.
 * 
 * @param {Array<{pageNumber: number, dataUrl: string}>} questionPages 
 * @returns {Promise<Array<{ id: string, number: string, text: string, maxMarks: number, topic?: string }>>}
 */
export async function extractQuestionsFromPages(questionPages) {
  const genAI = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const imageParts = questionPages.map((p) => fileToGenerativePart(p.dataUrl));

  const prompt = `
You are an expert academic examination parser. Analyze the provided question paper image(s) and extract all questions and sub-parts accurately in their printed order.

CRITICAL RULES:
1. Preserve original question numbering.
2. IMPORTANT: Treat labelled sub-parts as SEPARATE distinct question entries!
   Example: If the paper has "11. (a) Define Ohm's Law [2 marks]" and "(b) State its limitations [3 marks]", output TWO entries:
   - number: "11 (a)", maxMarks: 2
   - number: "11 (b)", maxMarks: 3
3. If max marks are stated (e.g. [5], (5 Marks), 5M), parse the numeric value into maxMarks. Default to 1 if not stated.
4. VALIDATION RULE: If the image is NOT a question paper (e.g. if it is a handwritten answer sheet, a photo, receipt, or unrelated document), do NOT fabricate questions. Output an empty JSON array: []
5. Output JSON matching this schema:

[
  {
    "id": "q1",
    "number": "1",
    "text": "Full text of the question",
    "maxMarks": 2,
    "topic": "Biology / Life Processes"
  }
]
`;

  const result = await model.generateContent([prompt, ...imageParts]);
  const textOutput = result.response.text();
  return JSON.parse(textOutput);
}

/**
 * Extracts and maps handwritten student answers to questions, detecting spatial bounding boxes on pages.
 * 
 * @param {Array<{pageNumber: number, dataUrl: string}>} answerPages 
 * @param {Array<Object>} questions 
 * @returns {Promise<{ answers: Array<Object>, overallSummary: Object }>}
 */
export async function mapAnswersAndGrade(answerPages, questions) {
  const genAI = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const imageParts = answerPages.map((p) => fileToGenerativePart(p.dataUrl));
  const questionsSummary = JSON.stringify(questions, null, 2);

  const prompt = `
You are an expert academic evaluator. You are given:
1. A list of questions from an exam:
${questionsSummary}

2. Images of a student's handwritten answer sheet pages (Page 1 to ${answerPages.length}).

YOUR TASKS:
1. Locate every handwritten answer on the pages, even if written out of order or across multiple pages.
2. For each question in the list, determine:
   - Is it ANSWERED, PARTIALLY_ANSWERED, or UNANSWERED?
   - The exact spatial bounding box coordinates [ymin, xmin, ymax, xmax] (normalized from 0 to 1000 scale) of the answer on that specific pageNumber (1-indexed):
     * ymin: Start slightly above the question label (e.g. "Ans 6:").
     * ymax: Extend all the way to the bottom of the LAST sentence, equation, or diagram of the answer (crucial: encompass all lines of the response).
     * xmin & xmax: Span across the width of the written section margin (~50 to 950).
   - If an answer spans multiple pages (e.g. Page 1 and Page 2), include a bounding box region for EACH page.
   - Transcribe the student's handwritten response.
   - Grade the response: score awarded (0 to maxMarks) and constructive feedback (1-2 concise sentences).
3. If there is handwritten text that does NOT belong to any question (e.g. rough calculations or unassigned writing), create an entry with questionId: "unmatched" and status: "UNMATCHED".

Output JSON matching this schema:

{
  "answers": [
    {
      "questionId": "q1",
      "questionNumber": "1",
      "status": "ANSWERED",
      "regions": [
        {
          "pageNumber": 1,
          "box": {
            "ymin": 130,
            "xmin": 60,
            "ymax": 240,
            "xmax": 940
          },
          "transcription": "Transcribed handwritten text..."
        }
      ],
      "evaluation": {
        "scoreAwarded": 2,
        "maxMarks": 2,
        "isCorrect": true,
        "feedback": "Correct definition and formula provided."
      }
    }
  ],
  "overallSummary": {
    "totalMarksAwarded": 18,
    "totalMaxMarks": 25,
    "percentage": 72,
    "answeredCount": 7,
    "unansweredCount": 2,
    "strengths": ["Strong conceptual clarity in Section A", "Accurate formula applications"],
    "areasForImprovement": ["Review unattempted questions"]
  }
}
`;

  const result = await model.generateContent([prompt, ...imageParts]);
  const textOutput = result.response.text();
  return JSON.parse(textOutput);
}
