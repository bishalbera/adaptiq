"use client";

import { z } from "zod";
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SessionQuestion {
  id: string;
  subject: "physics" | "chemistry" | "math";
  topic: string;
  subtopic: string;
  difficulty: number;
  text: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: "a" | "b" | "c" | "d";
  explanation: string;
  commonMistake?: string;
}

export const practiceSessionSchema = z.object({
  questions: z
    .array(
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
    )
    .describe("Array of questions for the session"),
  mode: z
    .enum(["standard", "quick", "calm"])
    .optional()
    .describe("Practice mode"),
  showProgress: z.boolean().optional().describe("Show progress indicator"),
});

export type PracticeSessionProps = z.infer<typeof practiceSessionSchema>;

const QUICK_MODE_DELAY = 3;

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

const modeStyles = {
  standard: {
    card: "glass",
    correct: "bg-neon-success/10 border-neon-success glow-success-sm",
    incorrect: "bg-neon-error/10 border-neon-error glow-error-sm",
    optionHover: "hover:bg-white/5 hover:border-white/20",
    text: "text-foreground",
  },
  quick: {
    card: "glass-strong",
    correct: "bg-neon-success/10 border-neon-success glow-success-sm",
    incorrect: "bg-neon-error/10 border-neon-error glow-error-sm",
    optionHover: "hover:bg-white/8 hover:border-white/20",
    text: "text-foreground",
  },
  calm: {
    card: "bg-neon-success/5 backdrop-blur-xl border border-neon-success/20",
    correct: "bg-neon-success/10 border-neon-success",
    incorrect: "bg-neon-warning/10 border-neon-warning",
    optionHover: "hover:bg-neon-success/10 hover:border-neon-success/30",
    text: "text-foreground",
  },
};

export const PracticeSession = React.forwardRef<
  HTMLDivElement,
  PracticeSessionProps
>(({ questions = [], mode = "standard", showProgress = true }, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<
    "a" | "b" | "c" | "d" | null
  >(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [countdown, setCountdown] = React.useState(QUICK_MODE_DELAY);
  const [score, setScore] = React.useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = React.useState(false);
  const [, setStartTime] = React.useState(Date.now());

  const validMode = mode && modeStyles[mode] ? mode : "standard";
  const styles = modeStyles[validMode];
  const hasQuestions = questions && questions.length > 0;
  const currentQuestion = hasQuestions ? questions[currentIndex] : null;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  const goToNextQuestion = React.useCallback(() => {
    if (!hasQuestions) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCountdown(QUICK_MODE_DELAY);
      setStartTime(Date.now());
    } else {
      setSessionComplete(true);
    }
  }, [currentIndex, questions.length, hasQuestions]);

  React.useEffect(() => {
    if (!isAnswered || validMode !== "quick" || !hasQuestions) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          goToNextQuestion();
          return QUICK_MODE_DELAY;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, validMode, goToNextQuestion, hasQuestions]);

  const handleSelectOption = React.useCallback(
    (option: "a" | "b" | "c" | "d") => {
      if (isAnswered || !currentQuestion) return;

      setSelectedAnswer(option);
      setIsAnswered(true);
      setScore((prev) => ({
        correct:
          prev.correct + (option === currentQuestion.correctAnswer ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [isAnswered, currentQuestion],
  );

  if (!hasQuestions) {
    return (
      <div
        ref={ref}
        className="glass rounded-xl p-8 text-center"
      >
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Loading questions...
        </h3>
        <p className="text-muted-foreground text-sm">
          Please wait while we fetch your practice questions.
        </p>
      </div>
    );
  }

  const isQuestionReady =
    currentQuestion &&
    currentQuestion.subject &&
    currentQuestion.text &&
    currentQuestion.options &&
    currentQuestion.correctAnswer;

  if (!isQuestionReady) {
    return (
      <div
        ref={ref}
        className="glass rounded-xl p-8 text-center"
      >
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Preparing question...
        </h3>
        <p className="text-muted-foreground text-sm">Almost ready!</p>
      </div>
    );
  }

  const getOptionStyle = (option: "a" | "b" | "c" | "d") => {
    if (!isAnswered) {
      return cn(
        "border border-white/10 rounded-lg p-4 cursor-pointer transition-all",
        styles.optionHover,
      );
    }

    if (option === currentQuestion?.correctAnswer) {
      return "border border-neon-success bg-neon-success/10 rounded-lg p-4";
    }

    if (
      option === selectedAnswer &&
      option !== currentQuestion?.correctAnswer
    ) {
      return "border border-neon-error bg-neon-error/10 rounded-lg p-4";
    }

    return "border border-white/5 rounded-lg p-4 opacity-50";
  };

  if (sessionComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "glass rounded-xl p-8 text-center",
        )}
      >
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Session Complete!
        </h2>
        <p className="text-muted-foreground mb-6">
          You got {score.correct} out of {score.total} correct ({percentage}%)
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setScore({ correct: 0, total: 0 });
              setSessionComplete(false);
              setCountdown(QUICK_MODE_DELAY);
            }}
            className="px-6 py-3 bg-neon-primary text-white rounded-lg hover:bg-neon-primary/90 transition-all glow-primary-sm hover:glow-primary"
          >
            Practice Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return <div>No questions available</div>;
  }

  const optionLabels = ["A", "B", "C", "D"];
  const optionKeys: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];

  return (
    <div ref={ref} className="space-y-4">
      {/* Progress Bar */}
      {showProgress && (
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neon-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span
            className={cn(
              "text-sm font-medium text-muted-foreground",
            )}
          >
            {currentIndex + 1}/{questions.length}
          </span>
          {score.total > 0 && (
            <span className="text-sm font-medium text-neon-success">
              {score.correct}/{score.total} ✓
            </span>
          )}
        </div>
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={cn(
            "rounded-xl p-6 transition-all",
            isAnswered
              ? isCorrect
                ? styles.correct
                : styles.incorrect
              : styles.card,
          )}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                subjectColors[currentQuestion.subject],
              )}
            >
              {currentQuestion.subject.charAt(0).toUpperCase() +
                currentQuestion.subject.slice(1)}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground">
              {currentQuestion.topic}
            </span>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                difficultyConfig[currentQuestion.difficulty as 1 | 2 | 3].color,
              )}
            >
              {difficultyConfig[currentQuestion.difficulty as 1 | 2 | 3].label}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <p
              className={cn("text-lg font-medium leading-relaxed", styles.text)}
            >
              {currentQuestion.text}
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
                      isAnswered && key === currentQuestion.correctAnswer
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
                    {currentQuestion.options[key]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feedback Section */}
          <AnimatePresence>
            {isAnswered && (
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
                          Incorrect. The answer is{" "}
                          {currentQuestion.correctAnswer.toUpperCase()}.
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Explanation - hide in quick mode for speed */}
                {validMode !== "quick" && (
                  <div className="bg-neon-primary/10 rounded-lg p-4 mb-4 border border-neon-primary/20">
                    <h4 className="font-semibold text-neon-primary mb-2">
                      Explanation
                    </h4>
                    <p className="text-foreground">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Common Mistake */}
                {!isCorrect &&
                  currentQuestion.commonMistake &&
                  validMode !== "quick" && (
                    <div className="bg-neon-warning/10 rounded-lg p-4 mb-4 border border-neon-warning/20">
                      <h4 className="font-semibold text-neon-warning mb-2">
                        Common Mistake
                      </h4>
                      <p className="text-foreground">
                        {currentQuestion.commonMistake}
                      </p>
                    </div>
                  )}

                {/* Next Question Navigation */}
                <div className="mt-4">
                  {validMode === "quick" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Next in {countdown}s...
                      </span>
                      <button
                        onClick={goToNextQuestion}
                        className="px-4 py-2 bg-neon-primary text-white rounded-lg hover:bg-neon-primary/90 transition-all glow-primary-sm text-sm font-medium"
                      >
                        {currentIndex < questions.length - 1
                          ? "Skip →"
                          : "Finish"}
                      </button>
                    </div>
                  ) : validMode === "calm" ? (
                    <button
                      onClick={goToNextQuestion}
                      className="w-full py-4 bg-neon-success/15 hover:bg-neon-success/25 text-neon-success rounded-xl font-medium transition-all hover:glow-success-sm flex items-center justify-center gap-2"
                    >
                      <span>🌱</span>
                      {currentIndex < questions.length - 1
                        ? "Ready for another?"
                        : "See Results"}
                    </button>
                  ) : (
                    <button
                      onClick={goToNextQuestion}
                      className="w-full py-3 bg-neon-primary text-white hover:bg-neon-primary/90 rounded-lg font-medium transition-all glow-primary-sm hover:glow-primary flex items-center justify-center gap-2"
                    >
                      {currentIndex < questions.length - 1 ? (
                        <>
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
                        </>
                      ) : (
                        "See Results"
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

PracticeSession.displayName = "PracticeSession";
