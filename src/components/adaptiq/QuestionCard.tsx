"use client";

import { z } from "zod";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
export const questionCardSchema = z.object({
  questionId: z.string().describe("Unique identifier for the question"),
  questionText: z.string().describe("The question text to be displayed"),
  options: z.object({
    a: z.string().describe("Option A text"),
    b: z.string().describe("Option B text"),
    c: z.string().describe("Option C text"),
    d: z.string().describe("Option D text"),
  }),
  correctAnswer: z
    .enum(["a", "b", "c", "d"])
    .describe("The correct answer key"),
  explanation: z
    .string()
    .describe("Explanation shown after answering the question"),
  difficulty: z
    .number()
    .min(1)
    .max(3)
    .describe("Difficulty level: 1=Easy, 2=Medium, 3=Hard"),
  topic: z.string().describe("The topic this quesstion belongs to"),
  subject: z.enum(["physics", "chemistry", "math"]).describe("Subject area"),
  commonMistake: z.string().optional().describe("Common mistake students make"),
  mode: z
    .enum(["standard", "quick", "calm"])
    .describe("Display mode affecting styling"),
  showExplanation: z
    .boolean()
    .optional()
    .describe("Whether to show explanation after answering"),
  onAnswer: z
    .function()
    .args(
      z.object({
        questionId: z.string(),
        selectedAnswer: z.enum(["a", "b", "c", "d"]),
        isCorrect: z.boolean(),
        timeSpent: z.number(),
      }),
    )
    .optional()
    .describe("Callback when user answers"),
  onNext: z
    .function()
    .optional()
    .describe("Callback when user wants next question"),
});

const QUICK_MODE_DELAY = 3;

export type QuestionCardProps = z.infer<typeof questionCardSchema>;

const modeStyles = {
  standard: {
    card: "glass",
    correct: "bg-neon-success/10 border-neon-success glow-success-sm",
    incorrect: "bg-neon-error/10 border-neon-error glow-error-sm",
    optionHover: "hover:bg-white/5 hover:border-white/20",
    accent: "text-neon-primary",
  },
  quick: {
    card: "glass-strong",
    correct: "bg-neon-success/10 border-neon-success glow-success-sm",
    incorrect: "bg-neon-error/10 border-neon-error glow-error-sm",
    optionHover: "hover:bg-white/8 hover:border-white/20",
    accent: "text-neon-primary",
  },
  calm: {
    card: "bg-neon-success/5 backdrop-blur-xl border border-neon-success/20",
    correct: "bg-neon-success/10 border-neon-success",
    incorrect: "bg-neon-warning/10 border-neon-warning",
    optionHover: "hover:bg-neon-success/10 hover:border-neon-success/30",
    accent: "text-neon-success",
  },
};

const difficultyConfig = {
  1: { label: "Easy", color: "bg-neon-success/15 text-neon-success" },
  2: { label: "Medium", color: "bg-neon-warning/15 text-neon-warning" },
  3: { label: "Hard", color: "bg-neon-error/15 text-neon-error" },
};

const subjectColors = {
  physics: "bg-neon-primary/15 text-neon-primary",
  chemistry: "bg-neon-secondary/15 text-neon-secondary",
  math: "bg-neon-warning/15 text-neon-warning",
};

export const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  (
    {
      questionId,
      questionText,
      options,
      correctAnswer,
      explanation,
      difficulty,
      topic,
      subject,
      commonMistake,
      mode = "standard",
      showExplanation = true,
      onAnswer,
      onNext,
    },
    ref,
  ) => {
    const [selectedAnswer, setSelectedAnswer] = React.useState<
      "a" | "b" | "c" | "d" | null
    >(null);
    const [isAnswered, setIsAnswered] = React.useState(false);
    const [startTime] = React.useState(Date.now());
    const [countdown, setCountdown] = React.useState(QUICK_MODE_DELAY);
    const styles = modeStyles[mode];
    const isCorrect = selectedAnswer === correctAnswer;

    // Auto-advance timer for quick mode
    React.useEffect(() => {
      if (!isAnswered || mode !== "quick" || !onNext) return;

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [isAnswered, mode, onNext]);

    const handleSelectOption = (option: "a" | "b" | "c" | "d") => {
      if (isAnswered) return;

      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      setSelectedAnswer(option);
      setIsAnswered(true);

      // Call the onAnswer callback if provided
      if (onAnswer) {
        onAnswer({
          questionId,
          selectedAnswer: option,
          isCorrect: option === correctAnswer,
          timeSpent,
        });
      }
    };

    const getOptionStyle = (option: "a" | "b" | "c" | "d") => {
      if (!isAnswered) {
        return cn(
          "border border-white/10 rounded-lg p-4 cursor-pointer transition-all",
          styles.optionHover,
        );
      }

      if (option === correctAnswer) {
        return "border border-neon-success bg-neon-success/10 rounded-lg p-4";
      }

      if (option === selectedAnswer && option !== correctAnswer) {
        return "border border-neon-error bg-neon-error/10 rounded-lg p-4";
      }

      return "border border-white/5 rounded-lg p-4 opacity-50";
    };

    const optionLabels = ["A", "B", "C", "D"];
    const optionKeys: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "rounded-xl p-6 transition-all",
          isAnswered
            ? isCorrect
              ? styles.correct
              : styles.incorrect
            : styles.card,
          mode === "quick" && "text-foreground",
        )}
      >
        {/* Header: Subject, Topic, Difficulty */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              subjectColors[subject],
            )}
          >
            {subject.charAt(0).toUpperCase() + subject.slice(1)}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground">
            {topic}
          </span>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              difficultyConfig[difficulty as 1 | 2 | 3].color,
            )}
          >
            {difficultyConfig[difficulty as 1 | 2 | 3].label}
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p
            className={cn(
              "text-lg font-medium leading-relaxed",
              "text-foreground",
            )}
          >
            {questionText}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {optionKeys.map((key, index) => (
            <motion.div
              key={key}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              onClick={() => handleSelectOption(key)}
              className={getOptionStyle(key)}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                    isAnswered && key === correctAnswer
                      ? "bg-neon-success text-white"
                      : isAnswered && key === selectedAnswer
                        ? "bg-neon-error text-white"
                        : "bg-white/10 text-muted-foreground",
                  )}
                >
                  {optionLabels[index]}
                </span>
                <span
                  className="pt-1 text-foreground"
                >
                  {options[key]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feedback Section */}
        <AnimatePresence>
          {isAnswered && showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              {/* Result Banner */}
              <div
                className={cn(
                  "rounded-lg p-4 mb-4",
                  isCorrect ? "bg-neon-success/10" : "bg-neon-error/10",
                )}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <span className="text-2xl">✓</span>
                      <span className="font-semibold text-neon-success">
                        Correct!
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">✗</span>
                      <span className="font-semibold text-neon-error">
                        Incorrect. The answer is {correctAnswer.toUpperCase()}.
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-neon-primary/10 rounded-lg p-4 mb-4 border border-neon-primary/20">
                <h4 className="font-semibold text-neon-primary mb-2">
                  Explanation
                </h4>
                <p className="text-foreground">{explanation}</p>
              </div>

              {/* Common Mistake (if wrong and available) */}
              {!isCorrect && commonMistake && (
                <div className="bg-neon-warning/10 rounded-lg p-4 border border-neon-warning/20">
                  <h4 className="font-semibold text-neon-warning mb-2">
                    Common Mistake
                  </h4>
                  <p className="text-foreground">{commonMistake}</p>
                </div>
              )}

              {/* Next Question Navigation - Mode Dependent */}
              {onNext && (
                <div className="mt-6">
                  {mode === "quick" ? (
                    // Quick mode: Auto-advance with countdown
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Next question in {countdown}s...
                      </span>
                      <button
                        onClick={onNext}
                        className="px-4 py-2 bg-neon-primary text-white rounded-lg hover:bg-neon-primary/90 transition-all glow-primary-sm text-sm font-medium"
                      >
                        Skip →
                      </button>
                    </div>
                  ) : mode === "calm" ? (
                    // Calm mode: Gentle prompt
                    <button
                      onClick={onNext}
                      className="w-full py-4 bg-neon-success/15 hover:bg-neon-success/25 text-neon-success rounded-xl font-medium transition-all hover:glow-success-sm flex items-center justify-center gap-2"
                    >
                      <span>🌱</span>
                      Ready for another?
                    </button>
                  ) : (
                    // Standard mode: Clear next button
                    <button
                      onClick={onNext}
                      className="w-full py-3 bg-neon-primary text-white hover:bg-neon-primary/90 rounded-lg font-medium transition-all glow-primary-sm hover:glow-primary flex items-center justify-center gap-2"
                    >
                      Next Question
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
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);

QuestionCard.displayName = "QuestionCard";