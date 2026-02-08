/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { PracticeSession, practiceSessionSchema } from "@/components/adaptiq/PracticeSession";
import { QuestionCard, questionCardSchema } from "@/components/adaptiq/QuestionCard";
import { CalmMode, calmModeSchema } from "@/components/adaptiq/CalmMode";
import { ExamPanicMode, examPanicModeSchema } from "@/components/adaptiq/ExamPanicMode";
import {
  MistakeAnalysis,
  mistakeAnalysisSchema,
} from "@/components/adaptiq/MistakeAnalysis";
import { ProgressCard, progressCardSchema } from "@/components/adaptiq/ProgressCard";
import { getQuestions, getQuestionById, getQuestionStats } from "@/data/questions";
import { analyzeUserInput } from "@/utils/parseUserInputs";
import type { TamboComponent, TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "analyzeInput",
    description: `Analyzes user's natural language input to extract:
    - Time budget (quick/standard/deep) and exact minutes if mentioned
    - Stress level (none/low/medium/high) from emotional keywords
    - Subject/topic preferences

    Use this when user mentions time constraints, emotional state, or topic preferences.
    Examples: "I have 10 minutes", "I'm stressed about physics", "quick practice"`,
    tool: ({ input }: { input: string }) => analyzeUserInput(input),
    inputSchema: z.object({
      input: z.string().describe("User input text to analyze"),
    }),
    outputSchema: z.object({
      time: z.object({
        budget: z.enum(["quick", "standard", "deep"]),
        minutes: z.number().nullable(),
      }),
      stress: z.enum(["none", "low", "medium", "high"]),
      preferences: z.object({
        subject: z.enum(["physics", "chemistry", "math"]).nullable(),
        topics: z.array(z.string()),
      }),
    }),
  },
  {
    name: "getQuestions",
    description: `Fetches practice questions from the question bank.
    Can filter by subject (physics/chemistry/math), topic, difficulty (1-3).
    Returns array of questions with id, text, options, correctAnswer, explanation.

    Use this when user wants to practice or needs questions.
    The limit parameter controls how many questions to return.`,
    tool: (options?: {
      subject?: "physics" | "chemistry" | "math";
      topic?: string;
      difficulty?: 1 | 2 | 3;
      limit?: number;
    }) => getQuestions(options),
    inputSchema: z.object({
      subject: z.enum(["physics", "chemistry", "math"]).optional(),
      topic: z.string().optional(),
      difficulty: z.number().min(1).max(3).optional(),
      limit: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        subject: z.enum(["physics", "chemistry", "math"]),
        topic: z.string(),
        subtopic: z.string(),
        difficulty: z.number(),
        text: z.string(),
        options: z.object({
          a: z.string(),
          b: z.string(),
          c: z.string(),
          d: z.string(),
        }),
        correctAnswer: z.enum(["a", "b", "c", "d"]),
        explanation: z.string(),
        commonMistake: z.string().optional(),
      }),
    ),
  },
  {
    name: "getQuestionById",
    description: `Fetches a specific question by its ID.
    Use this when you need to show a particular question.`,
    tool: ({ id }: { id: string }) => getQuestionById(id),
    inputSchema: z.object({
      id: z.string().describe("Question ID"),
    }),
    outputSchema: z
      .object({
        id: z.string(),
        subject: z.enum(["physics", "chemistry", "math"]),
        topic: z.string(),
        subtopic: z.string(),
        difficulty: z.number(),
        text: z.string(),
        options: z.object({
          a: z.string(),
          b: z.string(),
          c: z.string(),
          d: z.string(),
        }),
        correctAnswer: z.enum(["a", "b", "c", "d"]),
        explanation: z.string(),
        commonMistake: z.string().optional(),
      })
      .optional(),
  },
  {
    name: "getQuestionStats",
    description: `Returns statistics about the question bank:
    - Total number of questions
    - Count by subject (physics, chemistry, math)
    - Count by difficulty (1, 2, 3)

    Use this to inform user about available practice material.`,
    tool: () => getQuestionStats(),
    inputSchema: z.object({}),
    outputSchema: z.object({
      total: z.number(),
      bySubject: z.object({
        physics: z.number(),
        chemistry: z.number(),
        math: z.number(),
      }),
      byDifficulty: z.object({
        1: z.number(),
        2: z.number(),
        3: z.number(),
      }),
    }),
  },
  {
    name: "classifyMistakeAI",
    description: `AI-POWERED: Deeply analyzes a student's mistake to understand WHY they got it wrong.
    Uses Claude AI to examine the question, the student's answer, and the correct answer.

    Returns:
    - mistakeType: conceptual, calculation, careless, or misread
    - explanation: Why they likely made this mistake
    - tip: Specific actionable advice to avoid it
    - encouragement: A supportive message

    Use this when rendering MistakeAnalysis for intelligent feedback.`,
    tool: async (params: {
      questionText: string;
      topic: string;
      subject: string;
      selectedAnswer: string;
      selectedOption: string;
      correctAnswer: string;
      correctOption: string;
      explanation: string;
      commonMistake?: string;
    }) => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "classifyMistake", data: params }),
        });
        if (!response.ok) throw new Error("API call failed");
        return await response.json();
      } catch {
        // Fallback to simple heuristic if AI fails
        return {
          mistakeType: "careless" as const,
          explanation: "Review the question and options carefully.",
          tip: "Take your time reading all options before selecting.",
          encouragement: "Every mistake is a learning opportunity!",
        };
      }
    },
    inputSchema: z.object({
      questionText: z.string(),
      topic: z.string(),
      subject: z.string(),
      selectedAnswer: z.string(),
      selectedOption: z.string(),
      correctAnswer: z.string(),
      correctOption: z.string(),
      explanation: z.string(),
      commonMistake: z.string().optional(),
    }),
    outputSchema: z.object({
      mistakeType: z.enum([
        "conceptual",
        "calculation",
        "careless",
        "misread",
      ]),
      explanation: z.string(),
      tip: z.string(),
      encouragement: z.string(),
    }),
  },
  {
    name: "generateEncouragementAI",
    description: `AI-POWERED: Generates personalized, empathetic encouragement for the student.
    Takes into account their mood, performance, progress, and stress level.

    Use this when:
    - Student is struggling or frustrated
    - Rendering CalmMode or ExamPanicMode
    - Student asks for motivation or help

    Returns a personalized message and a suggested action.`,
    tool: async (params: {
      mood?: string;
      accuracy: number;
      totalSolved: number;
      streak: number;
      strongTopics?: string[];
      weakTopics?: string[];
      stressLevel?: string;
      recentMistakes?: string;
    }) => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "generateEncouragement", data: params }),
        });
        if (!response.ok) throw new Error("API call failed");
        return await response.json();
      } catch {
        return {
          message: "You're making progress. Keep going!",
          suggestedAction: "Try a few more practice questions.",
        };
      }
    },
    inputSchema: z.object({
      mood: z.string().optional(),
      accuracy: z.number(),
      totalSolved: z.number(),
      streak: z.number(),
      strongTopics: z.array(z.string()).optional(),
      weakTopics: z.array(z.string()).optional(),
      stressLevel: z.string().optional(),
      recentMistakes: z.string().optional(),
    }),
    outputSchema: z.object({
      message: z.string(),
      suggestedAction: z.string(),
    }),
  },
  {
    name: "detectPanicLevelAI",
    description: `AI-POWERED: Analyzes user's message for stress, anxiety, and panic indicators.
    Uses emotional intelligence to detect how the student is really feeling.

    Use this when:
    - User mentions exam timing with emotional language
    - Deciding between CalmMode vs ExamPanicMode
    - Student seems stressed but hasn't explicitly said so

    Returns panic level, detected emotions, and recommended approach.`,
    tool: async (params: {
      message: string;
      hoursUntilExam?: number;
      accuracy?: number;
      recentPerformance?: string;
    }) => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "detectPanicLevel", data: params }),
        });
        if (!response.ok) throw new Error("API call failed");
        return await response.json();
      } catch {
        // Fallback to keyword-based detection
        const lower = params.message.toLowerCase();
        const highPanicWords = [
          "fail",
          "panic",
          "can't",
          "freaking",
          "hopeless",
          "give up",
        ];
        const panicLevel = highPanicWords.some((w) => lower.includes(w))
          ? "high"
          : "low";
        return {
          panicLevel,
          detectedEmotions: [],
          needsIntervention: panicLevel === "high",
          suggestedApproach:
            panicLevel === "high" ? "crisis-support" : "encouraging",
          keyTriggers: [],
        };
      }
    },
    inputSchema: z.object({
      message: z.string(),
      hoursUntilExam: z.number().optional(),
      accuracy: z.number().optional(),
      recentPerformance: z.string().optional(),
    }),
    outputSchema: z.object({
      panicLevel: z.enum(["none", "low", "medium", "high", "crisis"]),
      detectedEmotions: z.array(z.string()),
      needsIntervention: z.boolean(),
      suggestedApproach: z.enum([
        "calm",
        "encouraging",
        "practical",
        "crisis-support",
      ]),
      keyTriggers: z.array(z.string()),
    }),
  },
  {
    name: "parseExamTiming",
    description: `FAST utility for extracting exam timing from user input.
    Uses simple pattern matching - for deep emotional analysis use detectPanicLevelAI instead.

    Use this for quick time extraction when user mentions:
    - "exam tomorrow", "test in 2 days", "JEE next week"
    - "in 3 hours", "this morning"

    For emotional/panic analysis, use detectPanicLevelAI tool instead.
    This tool is fast and works offline.`,
    tool: ({ input }: { input: string }) => {
      const lower = input.toLowerCase();
      let hoursUntilExam = 168; // Default: 1 week
      let panicLevel: "low" | "medium" | "high" | "extreme" = "low";

      if (
        lower.includes("today") ||
        lower.includes("in a few hours") ||
        /in \d+ hours?/.test(lower)
      ) {
        const hourMatch = lower.match(/in (\d+) hours?/);
        hoursUntilExam = hourMatch ? parseInt(hourMatch[1]) : 4;
      } else if (
        lower.includes("tomorrow") ||
        lower.includes("in the morning")
      ) {
        hoursUntilExam = 12;
      } else if (lower.includes("day after") || /in 2 days?/.test(lower)) {
        hoursUntilExam = 48;
      } else if (/in (\d+) days?/.test(lower)) {
        const dayMatch = lower.match(/in (\d+) days?/);
        hoursUntilExam = dayMatch ? parseInt(dayMatch[1]) * 24 : 72;
      } else if (lower.includes("next week") || lower.includes("this week")) {
        hoursUntilExam = 120;
      }

      const extremePanic = [
        "going to fail",
        "not ready",
        "can't do this",
        "freaking out",
        "panicking",
        "blank out",
        "meltdown",
      ];
      const highPanic = ["stressed", "anxious", "worried", "scared", "nervous"];
      const mediumPanic = ["unsure", "not confident", "need help"];

      if (extremePanic.some((p) => lower.includes(p))) {
        panicLevel = "extreme";
      } else if (highPanic.some((p) => lower.includes(p))) {
        panicLevel = "high";
      } else if (mediumPanic.some((p) => lower.includes(p))) {
        panicLevel = "medium";
      }

      if (hoursUntilExam <= 6 && panicLevel !== "extreme") {
        panicLevel = panicLevel === "low" ? "medium" : "high";
      }

      return {
        hoursUntilExam,
        panicLevel,
        needsExamPanicMode:
          panicLevel === "high" ||
          panicLevel === "extreme" ||
          hoursUntilExam <= 24,
      };
    },
    inputSchema: z.object({
      input: z.string().describe("User input to parse for exam timing"),
    }),
    outputSchema: z.object({
      hoursUntilExam: z.number(),
      panicLevel: z.enum(["low", "medium", "high", "extreme"]),
      needsExamPanicMode: z.boolean(),
    }),
  },
  {
    name: "analyzeStudyPatternAI",
    description: `AI-POWERED: Analyzes student's practice history to provide insights and recommendations.
    Uses Claude AI to identify strengths, weaknesses, and personalized study strategies.

    Use this when:
    - Rendering ProgressCard with personalized insights
    - User asks "how am I doing?" or "what should I focus on?"
    - Building adaptive study recommendations

    Returns strengths, areas to improve, recommended focus, and readiness estimate.`,
    tool: async (params: {
      totalAttempted: number;
      accuracy: number;
      totalMinutes: number;
      topicBreakdown: string;
      mistakePatterns: string;
      daysUntilExam?: number;
    }) => {
      const parsedParams = {
        ...params,
        topicBreakdown: JSON.parse(params.topicBreakdown) as Record<string, { attempted: number; correct: number }>,
        mistakePatterns: JSON.parse(params.mistakePatterns) as Record<string, number>,
      };
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "analyzeStudyPattern", data: parsedParams }),
        });
        if (!response.ok) throw new Error("API call failed");
        return await response.json();
      } catch {
        return {
          strengths: ["Consistent practice"],
          areasToImprove: ["Continue reviewing weak topics"],
          recommendedFocus: "Keep up the balanced practice",
          studyTip: "Focus on understanding concepts deeply.",
          estimatedReadiness: "medium" as const,
        };
      }
    },
    inputSchema: z.object({
      totalAttempted: z.number(),
      accuracy: z.number(),
      totalMinutes: z.number(),
      topicBreakdown: z.string().describe("JSON string of Record<topic, { attempted: number, correct: number }>"),
      mistakePatterns: z.string().describe("JSON string of Record<mistakeType, count>"),
      daysUntilExam: z.number().optional(),
    }),
    outputSchema: z.object({
      strengths: z.array(z.string()),
      areasToImprove: z.array(z.string()),
      recommendedFocus: z.string(),
      studyTip: z.string(),
      estimatedReadiness: z.enum(["low", "medium", "high"]),
    }),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "PracticeSession",
    description: `PREFERRED for practice: A complete practice session with multiple questions.
    Manages question flow, scoring, and navigation automatically.
    Has MODE-DEPENDENT behavior for advancing between questions.

    WHEN TO USE (USE THIS instead of QuestionCard for practice):
    - User wants to practice multiple questions
    - User mentions time constraints ("I have 10 minutes")
    - User asks for a quiz or practice session
    - User wants to practice a specific subject/topic

    MODES:
    - quick: Dark theme, AUTO-ADVANCES after 3 seconds, minimal explanations (for time-constrained)
    - standard: Normal display, shows "Next Question" button, full explanations
    - calm: Soothing colors, gentle "Ready for another?" button, encouraging

    HOW TO USE:
    1. Call getQuestions tool to fetch questions (use limit parameter, e.g., limit: 5)
    2. Render PracticeSession with the questions array
    3. Set mode based on user's time/stress: quick for <15min, calm if stressed, standard otherwise

    REQUIRED PROPS: questions (array from getQuestions tool)
    OPTIONAL: mode, showProgress`,
    component: PracticeSession,
    propsSchema: practiceSessionSchema,
  },
  {
    name: "QuestionCard",
    description: `Displays a SINGLE practice question. Use PracticeSession instead for multiple questions.
    Only use QuestionCard when showing exactly ONE question without session flow.

    WHEN TO USE:
    - Showing a single example question
    - User asks for just one question specifically
    - NOT for practice sessions (use PracticeSession instead)

    MODES:
    - standard: Normal display with full feedback
    - quick: Dark theme for time-constrained practice
    - calm: Soothing colors for stressed users`,
    component: QuestionCard,
    propsSchema: questionCardSchema,
  },
  {
    name: "ProgressCard",
    description: `Displays user's learning statistics and progress.
    Shows accuracy percentage, questions attempted, streak, strong/weak topics.

    WHEN TO USE:
    - User asks about their progress or stats
    - At start of session to show where they stand
    - User asks "how am I doing?"

    VARIANTS:
    - default: Full stats with circular progress chart
    - compact: Single-line summary bar
    - calm: Soothing colors focusing on accomplishments (for stressed users)`,
    component: ProgressCard,
    propsSchema: progressCardSchema,
  },
  {
    name: "CalmMode",
    description: `CRITICAL: Supportive calming interface for stressed or overwhelmed users.
    Transforms UI to be gentle and encouraging. Shows accomplishments, offers breaks.

    WHEN TO USE (HIGH PRIORITY - render this FIRST if detected):
    - User says: "can't do this", "giving up", "too hard", "failing", "hopeless"
    - User expresses: frustration, anxiety, being overwhelmed, panic
    - User mentions: crying, freaking out, meltdown, hate this
    - Stress level detected as 'high' or 'medium' from analyzeInput tool

    FEATURES:
    - Soothing green/teal color scheme
    - Shows user's accomplishments (problems solved, streak)
    - Breathing exercise option
    - Break timer
    - "Easy wins" practice suggestion
    - Option to continue normally

    REQUIRED PROPS: totalSolved, currentStreak`,
    component: CalmMode,
    propsSchema: calmModeSchema,
  },
  {
    name: "MistakeAnalysis",
    description: `Detailed breakdown when user gets a question wrong.
    Shows WHY they got it wrong, not just that they got it wrong.

    WHEN TO USE:
    - User just answered a question incorrectly
    - User asks "why was I wrong?" or "explain my mistake"
    - User wants to understand their error
    - After incorrect answer in practice session (for deeper analysis)

    FEATURES:
    - Side-by-side comparison: Your Answer vs Correct Answer
    - Explanation of why correct answer is correct
    - Common mistake callout (why students typically get this wrong)
    - Mistake type classification (conceptual, calculation, careless, misread)
    - Pattern detection alert ("You've made this error 3 times")
    - "Practice Similar Problems" button

    REQUIRED PROPS: questionText, selectedAnswer, correctAnswer, options, explanation, topic, subject
    OPTIONAL: commonMistake, mistakeType, similarMistakeCount, patternMessage`,
    component: MistakeAnalysis,
    propsSchema: mistakeAnalysisSchema,
  },
  {
    name: "ExamPanicMode",
    description: `CRITICAL: Emergency intervention for pre-exam panic and extreme anxiety.
    More intensive than CalmMode - specifically for imminent exams with high stress.

    WHEN TO USE (HIGHEST PRIORITY - render IMMEDIATELY if detected):
    - User mentions exam is tomorrow/today/in X hours
    - User expresses panic: "I'm going to fail", "not ready", "can't do this"
    - User mentions: "exam tomorrow", "test in X hours", "freaking out about exam"
    - User says: "going to blank out", "haven't studied enough", "no time left"
    - Extreme stress with imminent deadline detected

    DIFFERENCE FROM CalmMode:
    - CalmMode: General stress relief during practice
    - ExamPanicMode: Pre-exam crisis intervention with countdown, action plan, tips

    FEATURES:
    - Exam countdown with calming perspective
    - Tabbed interface: Calm Down / You Got This / Action Plan / Exam Tips
    - Guided breathing exercise (visual, timed)
    - Confidence boosters showing user's accomplishments
    - Emergency study plan based on time remaining
    - Last-minute exam strategy tips

    REQUIRED PROPS: hoursUntilExam, totalSolved, accuracy
    OPTIONAL: examName, userName, strongTopics, weakTopics, bestMockScore`,
    component: ExamPanicMode,
    propsSchema: examPanicModeSchema,
  },
  // Add more components here
];
