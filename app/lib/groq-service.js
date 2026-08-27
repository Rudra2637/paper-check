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
4. Output STRICT JSON format inside a code block \`\`\`json ... \`\`\` matching this structure:

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
    model: 'llama-3.2-11b-vision-preview',
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
   - The exact spatial bounding box coordinates [ymin, xmin, ymax, xmax] (normalized from 0 to 1000 scale) of the answer on that specific pageNumber (1-indexed).
   - If an answer spans multiple pages (e.g. Page 1 and Page 2), include a bounding box region for EACH page.
   - Transcribe the student's handwritten response.
   - Grade the response: score awarded (0 to maxMarks) and constructive feedback explaining what was correct or missing.
3. If there is handwritten text that does NOT belong to any question, create an entry with questionId: "unmatched".

Output STRICT JSON format inside a code block \`\`\`json ... \`\`\` matching this schema:

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
    model: 'llama-3.2-11b-vision-preview',
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
    max_tokens: 6000,
  });

  const textOutput = response.choices[0]?.message?.content || '';
  return parseJsonFromLlmOutput(textOutput);
}

/**
 * Robust JSON parser for LLM responses
 */
function parseJsonFromLlmOutput(text) {
  try {
    // Try matching ```json ... ``` code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    // Fallback: try parsing directly
    return JSON.parse(text.trim());
  } catch (err) {
    console.error('Failed to parse JSON from LLM output:', text);
    throw new Error('Could not parse structured output from AI model. Please retry.');
  }
}
