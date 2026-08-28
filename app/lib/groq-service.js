import Groq from 'groq-sdk';

/**
 * Initializes Groq Client strictly using server-side environment variable
 */
export function getGroqClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY environment variable is missing. Please set it in .env.local.');
  }
  return new Groq({ apiKey: key });
}

/**
 * Extracts structured questions from Question Paper page images.
 * Treats labelled sub-parts (e.g., 11(a), 11(b)) as distinct question entries.
 * 
 * @param {Array<{pageNumber: number, dataUrl: string}>} questionPages 
 * @returns {Promise<Array<{ id: string, number: string, text: string, maxMarks: number, topic?: string }>>}
 */
export async function extractQuestionsFromPages(questionPages) {
  const groq = getGroqClient();

  const imageContent = questionPages.map((p) => ({
    type: 'image_url',
    image_url: {
      url: p.dataUrl,
    },
  }));

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
5. Output STRICT JSON format inside a code block \`\`\`json ... \`\`\` matching this structure. Output JSON directly without lengthy pre-thinking or conversational filler:

[
  {
    "id": "q1",
    "number": "1",
    "text": "Full text of the question",
    "maxMarks": 2,
    "topic": "Physics / Mechanics"
  },
  {
    "id": "q2_a",
    "number": "2 (a)",
    "text": "Full text of sub-part 2a",
    "maxMarks": 3,
    "topic": "Electricity"
  }
]
`;

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          ...imageContent,
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 1500,
  });

  const textOutput = response.choices[0]?.message?.content || '';
  return parseJsonFromLlmOutput(textOutput);
}

/**
 * Extracts and maps handwritten student answers to questions, detecting spatial bounding boxes on pages.
 * 
 * @param {Array<{pageNumber: number, dataUrl: string}>} answerPages 
 * @param {Array<Object>} questions 
 * @returns {Promise<Array<Object>>}
 */
export async function mapAnswersAndGrade(answerPages, questions) {
  const groq = getGroqClient();

  const imageContent = answerPages.map((p, index) => ({
    type: 'image_url',
    image_url: {
      url: p.dataUrl,
    },
  }));

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
     * ymax: Extend all the way to the bottom of the LAST sentence, equation, or diagram of the answer (crucial: do not just enclose the label line, encompass all lines of the response).
     * xmin & xmax: Span across the width of the page margin (typically xmin ~ 50, xmax ~ 950).
   - If an answer spans multiple pages (e.g. Page 1 and Page 2), include a bounding box region for EACH page.
   - Transcribe the student's handwritten response.
   - Grade the response: score awarded (0 to maxMarks) and constructive feedback (1-2 concise sentences).
3. If there is handwritten text that does NOT belong to any question, create an entry with questionId: "unmatched".

Output STRICT JSON format inside a code block \`\`\`json ... \`\`\` matching this schema. Be direct and concise, and output the JSON immediately:

{
  "answers": [
    {
      "questionId": "q1",
      "questionNumber": "1",
      "status": "ANSWERED", // "ANSWERED" | "PARTIALLY_ANSWERED" | "UNANSWERED" | "UNMATCHED"
      "regions": [
        {
          "pageNumber": 1,
          "box": {
            "ymin": 150,
            "xmin": 80,
            "ymax": 380,
            "xmax": 920
          },
          "transcription": "Newton's Second law states that force is equal to mass times acceleration (F=ma)..."
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
    "areasForImprovement": ["Needs more detail in derivations", "Review question 3 calculation steps"]
  }
}
`;

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          ...imageContent,
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 4000,
  });

  const textOutput = response.choices[0]?.message?.content || '';
  return parseJsonFromLlmOutput(textOutput);
}

/**
 * Ultra-robust JSON parser with auto-repair for truncated or partial LLM outputs
 */
function parseJsonFromLlmOutput(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty response received from AI model.');
  }

  // 1. Strip reasoning <think>...</think> blocks
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. Extract code block if present
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleaned = codeBlockMatch[1].trim();
  }

  // 3. Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to repair strategies
  }

  // 4. Try parsing within outer braces/brackets
  try {
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    const startIdx = firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket) ? firstBrace : firstBracket;

    if (startIdx !== -1) {
      const isObject = cleaned[startIdx] === '{';
      const lastClose = isObject ? cleaned.lastIndexOf('}') : cleaned.lastIndexOf(']');
      if (lastClose > startIdx) {
        return JSON.parse(cleaned.substring(startIdx, lastClose + 1));
      }
    }
  } catch {
    // Continue to next fallback
  }

  // 5. Truncation Auto-Repair: Extract the completed "answers" array if tail was truncated
  try {
    const answersMatch = cleaned.match(/"answers"\s*:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
    if (answersMatch && answersMatch[1]) {
      const parsedAnswers = JSON.parse(answersMatch[1]);
      return {
        answers: parsedAnswers,
        overallSummary: {
          totalMarksAwarded: parsedAnswers.reduce((sum, a) => sum + (a.evaluation?.scoreAwarded || 0), 0),
          totalMaxMarks: parsedAnswers.reduce((sum, a) => sum + (a.evaluation?.maxMarks || 0), 0),
          answeredCount: parsedAnswers.filter(a => a.status === 'ANSWERED').length,
          unansweredCount: parsedAnswers.filter(a => a.status === 'UNANSWERED').length,
          strengths: ['Accurate responses to attempted questions'],
          areasForImprovement: ['Review unattempted questions'],
        }
      };
    }
  } catch {
    // Fall through to error
  }

  console.error('Failed to parse JSON from LLM output:', text);
  throw new Error('Could not parse structured output from AI model. Please retry.');
}
