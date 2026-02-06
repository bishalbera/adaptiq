"use client";

import * as React from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { MistakeType } from "@/types";
import { cn } from "@/lib/utils";

export const mistakeAnalysisSchema = z.object({
  questionText: z
    .string()
    .describe("The question that was answered incorrectly"),
  selectedAnswer: z
    .enum(["a", "b", "c", "d"])
    .describe("The answer the user selected"),
  correctAnswer: z.enum(["a", "b", "c", "d"]).describe("The correct answer"),
  options: z
    .object({
      a: z.string(),
      b: z.string(),
      c: z.string(),
      d: z.string(),
    })
    .describe("All answer options"),
  explanation: z.string().describe("Why the correct answer is correct"),
  commonMistake: z
    .string()
    .optional()
    .describe("Common mistake students make on this question"),
  topic: z.string().describe("The topic of this question"),
  subject: z.enum(["physics", "chemistry", "math"]).describe("Subject area"),
  mistakeType: z
    .enum(["conceptual", "calculation", "careless", "misread"])
    .optional()
    .describe("Type of mistake made"),
  similarMistakeCount: z
    .number()
    .optional()
    .describe("How many times user has made similar mistakes"),
  patternMessage: z
    .string()
    .optional()
    .describe("Message about mistake pattern if detected"),
  onPracticeSimilar: z
    .function()
    .optional()
    .describe("Callback to practice similar problems"),
  onContinue: z
    .function()
    .optional()
    .describe("Callback to continue to next question"),
});

export type MistakeAnalysisProps = z.infer<typeof mistakeAnalysisSchema>;

const mistakeTypeConfig: Record<
  MistakeType,
  { label: string; icon: string; color: string; tip: string }
> = {
  conceptual: {
    label: "Conceptual Gap",
    icon: "🧠",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    tip: "Review the underlying concept before attempting similar problems.",
  },
  calculation: {
    label: "Calculation Error",
    icon: "🔢",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    tip: "Double-check your arithmetic. Write out each step clearly.",
  },
  careless: {
    label: "Careless Mistake",
    icon: "👀",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    tip: "Slow down and read each option carefully before selecting.",
  },
  misread: {
    label: "Misread Question",
    icon: "📖",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    tip: "Underline key words in the question to avoid misreading.",
  },
};

const subjectColors = {
  physics: "bg-blue-100 text-blue-800",
  chemistry: "bg-purple-100 text-purple-800",
  math: "bg-orange-100 text-orange-800",
};

export const MistakeAnalysis = React.forwardRef<
  HTMLDivElement,
  MistakeAnalysisProps
>(
  (
    {
      questionText,
      selectedAnswer,
      correctAnswer,
      options,
      explanation,
      commonMistake,
      topic,
      subject,
      mistakeType,
      similarMistakeCount,
      patternMessage,
      onPracticeSimilar,
      onContinue,
    },
    ref,
  ) => {
    const mistakeConfig = mistakeType ? mistakeTypeConfig[mistakeType] : null;

    // Guard against streaming partial props
    const isReady =
      questionText &&
      selectedAnswer &&
      correctAnswer &&
      options &&
      explanation &&
      topic &&
      subject;

    if (!isReady) {
      return (
        <div
          ref={ref}
          className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent" />
            <span className="text-gray-600">Analyzing your answer...</span>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border-2 border-red-100 shadow-sm overflow-hidden"
      >
        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h2 className="text-lg font-semibold text-red-800">
                Mistake Analysis
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  subjectColors[subject],
                )}
              >
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {topic}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Question</h3>
            <p className="text-gray-800">{questionText}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✗</span>
                <h3 className="font-semibold text-red-800">Your Answer</h3>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold text-sm">
                  {selectedAnswer.toUpperCase()}
                </span>
                <p className="text-red-900 pt-1">{options[selectedAnswer]}</p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✓</span>
                <h3 className="font-semibold text-green-800">Correct Answer</h3>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
                  {correctAnswer.toUpperCase()}
                </span>
                <p className="text-green-900 pt-1">{options[correctAnswer]}</p>
              </div>
            </div>
          </div>

          {mistakeConfig && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={cn("rounded-lg border p-4", mistakeConfig.color)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{mistakeConfig.icon}</span>
                <div>
                  <h4 className="font-semibold">{mistakeConfig.label}</h4>
                  <p className="text-sm mt-1 opacity-90">{mistakeConfig.tip}</p>
                </div>
              </div>
            </motion.div>
          )}

          {similarMistakeCount && similarMistakeCount >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-amber-800">
                    Pattern Detected: {similarMistakeCount} similar mistakes
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {patternMessage ||
                      `You've made this type of error ${similarMistakeCount} times. Consider focusing on this area.`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="font-semibold text-blue-800">
                Why is this correct?
              </h3>
            </div>
            <p className="text-blue-900">{explanation}</p>
          </div>

          {commonMistake && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎯</span>
                <h3 className="font-semibold text-amber-800">Common Pitfall</h3>
              </div>
              <p className="text-amber-900">{commonMistake}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onPracticeSimilar && (
              <button
                onClick={() => onPracticeSimilar()}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Practice Similar Problems
              </button>
            )}
            {onContinue && (
              <button
                onClick={() => onContinue()}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                  onPracticeSimilar
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white",
                )}
              >
                Continue
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 italic">
              &quot;Mistakes are proof that you are trying. Learn from them and
              keep going!&quot;
            </p>
          </div>
        </div>
      </motion.div>
    );
  },
);

MistakeAnalysis.displayName = "MistakeAnalysis";
