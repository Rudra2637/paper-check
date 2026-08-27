/**
 * Mock / Sample Dataset for AI Assessment & Mapping Demo
 * Demonstrates:
 * - Questions with sub-parts (1a, 1b, 2)
 * - Multi-page answer sheet mapping
 * - Out-of-order answer locations
 * - Unanswered question detection
 * - Highlighting coordinate bounding boxes (normalized 0-1000)
 */

export const SAMPLE_QUESTIONS = [
  {
    id: "q1_a",
    number: "1 (a)",
    text: "State Newton's Second Law of Motion and give its mathematical equation.",
    maxMarks: 2,
    topic: "Mechanics"
  },
  {
    id: "q1_b",
    number: "1 (b)",
    text: "A constant force acts on a body of mass 5 kg for a duration of 2 s. It increases the body's velocity from 3 m/s to 7 m/s. Find the magnitude of the applied force.",
    maxMarks: 3,
    topic: "Mechanics"
  },
  {
    id: "q2",
    number: "2",
    text: "Explain the difference between potential energy and kinetic energy with one practical daily-life example for each.",
    maxMarks: 4,
    topic: "Work & Energy"
  },
  {
    id: "q3",
    number: "3",
    text: "Derive the formula for universal gravitational force between two point masses m1 and m2 separated by distance r.",
    maxMarks: 5,
    topic: "Gravitation"
  },
  {
    id: "q4",
    number: "4",
    text: "Define Ohm's Law and state two limitations where Ohm's Law does not hold true.",
    maxMarks: 3,
    topic: "Electricity"
  }
];

export const SAMPLE_MAPPED_ANSWERS = [
  {
    questionId: "q1_a",
    questionNumber: "1 (a)",
    status: "ANSWERED",
    regions: [
      {
        pageNumber: 1,
        box: { ymin: 110, xmin: 60, ymax: 270, xmax: 940 },
        transcription: "Newton's Second Law states that the rate of change of momentum of a body is directly proportional to the applied force. Mathematical formulation: F = dp/dt = m * a (Force = mass x acceleration)."
      }
    ],
    evaluation: {
      scoreAwarded: 2,
      maxMarks: 2,
      isCorrect: true,
      feedback: "Complete and accurate definition with correct formula derivation."
    }
  },
  {
    questionId: "q1_b",
    questionNumber: "1 (b)",
    status: "ANSWERED",
    regions: [
      {
        pageNumber: 1,
        box: { ymin: 300, xmin: 60, ymax: 560, xmax: 940 },
        transcription: "Given: mass m = 5 kg, time t = 2s, initial velocity u = 3 m/s, final velocity v = 7 m/s.\nAcceleration a = (v - u) / t = (7 - 3) / 2 = 4/2 = 2 m/s².\nForce F = m * a = 5 * 2 = 10 N.\nApplied force is 10 Newtons."
      }
    ],
    evaluation: {
      scoreAwarded: 3,
      maxMarks: 3,
      isCorrect: true,
      feedback: "Step-by-step substitution and correct unit (10 N)."
    }
  },
  {
    questionId: "q2",
    questionNumber: "2",
    status: "ANSWERED",
    regions: [
      // Multi-page spanning answer: starts at bottom of Page 1 and finishes on Page 2
      {
        pageNumber: 1,
        box: { ymin: 620, xmin: 60, ymax: 950, xmax: 940 },
        transcription: "Ans 2: Potential Energy (PE) is energy possessed by an object due to its position or state. Example: Water stored in an elevated dam.\nKinetic Energy (KE) is energy possessed by an object due to its motion (Continued on next page...)"
      },
      {
        pageNumber: 2,
        box: { ymin: 80, xmin: 60, ymax: 260, xmax: 940 },
        transcription: "...Example of KE: A moving cricket ball or running car. Formula: KE = 1/2 m v²."
      }
    ],
    evaluation: {
      scoreAwarded: 4,
      maxMarks: 4,
      isCorrect: true,
      feedback: "Clear definitions with well-chosen real-world examples across both pages."
    }
  },
  {
    questionId: "q3",
    questionNumber: "3",
    status: "PARTIALLY_ANSWERED",
    // Out-of-order: written on Page 2 after question 4
    regions: [
      {
        pageNumber: 2,
        box: { ymin: 580, xmin: 60, ymax: 900, xmax: 940 },
        transcription: "Ans 3: F ∝ m1*m2 and F ∝ 1/r². Combining both: F = G * (m1*m2)/r². Where G is gravitational constant = 6.67 x 10^-11 N m²/kg²."
      }
    ],
    evaluation: {
      scoreAwarded: 3.5,
      maxMarks: 5,
      isCorrect: false,
      feedback: "Stated proportionality correctly, but skipped the formal calculus/geometric derivation steps."
    }
  },
  {
    questionId: "q4",
    questionNumber: "4",
    status: "UNANSWERED",
    regions: [],
    evaluation: {
      scoreAwarded: 0,
      maxMarks: 3,
      isCorrect: false,
      feedback: "Question left unattempted by student."
    }
  }
];

export const SAMPLE_OVERALL_SUMMARY = {
  totalMarksAwarded: 12.5,
  totalMaxMarks: 17,
  percentage: 73.5,
  answeredCount: 4,
  unansweredCount: 1,
  strengths: [
    "High accuracy in Mechanics numerical problems with clear unit notations",
    "Comprehensive explanation of Energy concepts spanning across pages"
  ],
  areasForImprovement: [
    "Ensure complete derivation steps are written for high-mark theory questions (Q3)",
    "Time management to avoid leaving Section B questions (Q4) unattempted"
  ]
};
