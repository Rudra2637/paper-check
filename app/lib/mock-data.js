/**
 * Perfect Alignment Sample Dataset
 * Matches the sample test files (Class 10 Biology Unit Test)
 * - Questions with sub-parts: 2(a) and 2(b)
 * - Exact pixel coordinates matching /samples/student_answersheet.jpg
 * - Out-of-order & unanswered question handling (Q3 unattempted)
 */

export const SAMPLE_QUESTIONS = [
  {
    id: "q1",
    number: "1",
    text: "State the function of stomata in plants.",
    maxMarks: 2,
    topic: "Plant Physiology"
  },
  {
    id: "q2_a",
    number: "2 (a)",
    text: "Draw a labeled diagram of chloroplast with outer membrane, thylakoids, granum, and stroma.",
    maxMarks: 3,
    topic: "Cell Biology & Photosynthesis"
  },
  {
    id: "q2_b",
    number: "2 (b)",
    text: "Mention two major stages of photosynthesis and where they take place.",
    maxMarks: 2,
    topic: "Photosynthesis"
  },
  {
    id: "q3",
    number: "3",
    text: "Explain double circulation in the human heart with a schematic diagram.",
    maxMarks: 5,
    topic: "Human Circulatory System"
  },
  {
    id: "q4",
    number: "4",
    text: "Differentiate between xylem and phloem in terms of transport direction and function.",
    maxMarks: 3,
    topic: "Plant Tissues"
  }
];

export const SAMPLE_MAPPED_ANSWERS = [
  {
    questionId: "q1",
    questionNumber: "1",
    status: "ANSWERED",
    regions: [
      {
        pageNumber: 1,
        box: { ymin: 80, xmin: 110, ymax: 165, xmax: 920 },
        transcription: "Ans 1: Stomata help in gaseous exchange (CO2 and O2) and transpiration."
      }
    ],
    evaluation: {
      scoreAwarded: 2,
      maxMarks: 2,
      isCorrect: true,
      feedback: "Accurate functions specified (gaseous exchange and transpiration)."
    }
  },
  {
    questionId: "q2_a",
    questionNumber: "2 (a)",
    status: "ANSWERED",
    regions: [
      {
        pageNumber: 1,
        box: { ymin: 180, xmin: 110, ymax: 520, xmax: 920 },
        transcription: "Ans 2(a): Diagram of chloroplast with outer membrane, thylakoids, granum, stroma labeled."
      }
    ],
    evaluation: {
      scoreAwarded: 3,
      maxMarks: 3,
      isCorrect: true,
      feedback: "Neatly drawn diagram with all required organelles clearly labeled (outer membrane, thylakoids, granum, stroma)."
    }
  },
  {
    questionId: "q2_b",
    questionNumber: "2 (b)",
    status: "ANSWERED",
    regions: [
      {
        pageNumber: 1,
        box: { ymin: 545, xmin: 110, ymax: 745, xmax: 920 },
        transcription: "Ans 2(b): The two stages are:\n1. Light-dependent reaction in thylakoids\n2. Dark reaction (Calvin cycle) in stroma."
      }
    ],
    evaluation: {
      scoreAwarded: 2,
      maxMarks: 2,
      isCorrect: true,
      feedback: "Correctly identified both light reaction (thylakoids) and dark reaction (stroma)."
    }
  },
  {
    questionId: "q3",
    questionNumber: "3",
    status: "UNANSWERED",
    regions: [],
    evaluation: {
      scoreAwarded: 0,
      maxMarks: 5,
      isCorrect: false,
      feedback: "Question unattempted by student."
    }
  },
  {
    questionId: "q4",
    questionNumber: "4",
    status: "ANSWERED",
    regions: [
      {
        pageNumber: 1,
        box: { ymin: 760, xmin: 110, ymax: 955, xmax: 920 },
        transcription: "Ans 4: Xylem transports water and minerals from roots to leaves unidirectionally.\nPhloem transports food bidirectionally."
      }
    ],
    evaluation: {
      scoreAwarded: 3,
      maxMarks: 3,
      isCorrect: true,
      feedback: "Complete differentiation covering unidirectional water transport (xylem) and bidirectional food translocation (phloem)."
    }
  }
];

export const SAMPLE_OVERALL_SUMMARY = {
  totalMarksAwarded: 10,
  totalMaxMarks: 15,
  percentage: 67,
  answeredCount: 4,
  unansweredCount: 1,
  strengths: [
    "High accuracy in diagrammatic representation of cellular organelles (Q2a)",
    "Clear conceptual differentiation between xylem and phloem transport (Q4)"
  ],
  areasForImprovement: [
    "Review time allocation to ensure high-weightage questions (Q3 - Double Circulation) are not left unattempted"
  ]
};
