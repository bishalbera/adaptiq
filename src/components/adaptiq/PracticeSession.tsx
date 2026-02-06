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
  1: { label: "Easy", color: "bg-green-100 text-green-800" },
  2: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  3: { label: "Hard", color: "bg-red-100 text-red-800" },
};

const subjectColors = {
  physics: "bg-blue-100 text-blue-800",
  chemistry: "bg-purple-100 text-purple-800",
  math: "bg-orange-100 text-orange-800",
};

const modeStyles = {
  standard: {
    card: "bg-white border-gray-200",
    correct: "bg-green-50 border-green-500",
    incorrect: "bg-red-50 border-red-500",
    optionHover: "hover:bg-gray-50 hover:border-gray-400",
    text: "text-gray-800",
  },
  quick: {
    card: "bg-gray-900 border-gray-700",
    correct: "bg-green-900/50 border-green-500",
    incorrect: "bg-red-900/50 border-red-500",
    optionHover: "hover:bg-gray-800 hover:border-gray-500",
    text: "text-white",
  },
  calm: {
    card: "bg-emerald-50 border-emerald-200",
    correct: "bg-emerald-100 border-emerald-500",
    incorrect: "bg-amber-50 border-amber-400",
    optionHover: "hover:bg-emerald-100 hover:border-emerald-400",
    text: "text-gray-800",
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
        className="rounded-xl border-2 border-gray-200 bg-white p-8 text-center"
      >
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Loading questions...
        </h3>
        <p className="text-gray-500 text-sm">
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
        className="rounded-xl border-2 border-gray-200 bg-white p-8 text-center"
      >
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Preparing question...
        </h3>
        <p className="text-gray-500 text-sm">Almost ready!</p>
      </div>
    );
  }

  const getOptionStyle = (option: "a" | "b" | "c" | "d") => {
    if (!isAnswered) {
      return cn(
        "border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all",
        styles.optionHover,
        validMode === "quick" && "border-gray-600",
      );
    }

    if (option === currentQuestion?.correctAnswer) {
      return "border-2 border-green-500 bg-green-50 rounded-lg p-4";
    }

    if (
      option === selectedAnswer &&
      option !== currentQuestion?.correctAnswer
    ) {
      return "border-2 border-red-500 bg-red-50 rounded-lg p-4";
    }

    return cn(
      "border-2 border-gray-200 rounded-lg p-4 opacity-50",
      validMode === "quick" && "border-gray-600",
    );
  };

  if (sessionComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-xl border-2 p-8 text-center",
          validMode === "calm"
            ? "bg-emerald-50 border-emerald-200"
            : "bg-white border-gray-200",
        )}
      >
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Session Complete!
        </h2>
        <p className="text-gray-600 mb-6">
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              validMode === "quick" ? "text-gray-400" : "text-gray-600",
            )}
          >
            {currentIndex + 1}/{questions.length}
          </span>
          {score.total > 0 && (
            <span className="text-sm font-medium text-green-600">
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
            "rounded-xl border-2 p-6 shadow-sm transition-all",
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
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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
                        ? "bg-green-500 text-white"
                        : isAnswered && key === selectedAnswer
                          ? "bg-red-500 text-white"
                          : validMode === "quick"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {optionLabels[index]}
                  </span>
                  <span
                    className={cn(
                      "pt-1",
                      validMode === "quick" && !isAnswered
                        ? "text-gray-200"
                        : "",
                    )}
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
                    isCorrect ? "bg-green-100" : "bg-red-100",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <span className="text-2xl">✓</span>
                        <span className="font-semibold text-green-800">
                          Correct!
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">✗</span>
                        <span className="font-semibold text-red-800">
                          Incorrect. The answer is{" "}
                          {currentQuestion.correctAnswer.toUpperCase()}.
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Explanation - hide in quick mode for speed */}
                {validMode !== "quick" && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Explanation
                    </h4>
                    <p className="text-blue-800">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Common Mistake */}
                {!isCorrect &&
                  currentQuestion.commonMistake &&
                  validMode !== "quick" && (
                    <div className="bg-amber-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-amber-900 mb-2">
                        Common Mistake
                      </h4>
                      <p className="text-amber-800">
                        {currentQuestion.commonMistake}
                      </p>
                    </div>
                  )}

                {/* Next Question Navigation */}
                <div className="mt-4">
                  {validMode === "quick" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Next in {countdown}s...
                      </span>
                      <button
                        onClick={goToNextQuestion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {currentIndex < questions.length - 1
                          ? "Skip →"
                          : "Finish"}
                      </button>
                    </div>
                  ) : validMode === "calm" ? (
                    <button
                      onClick={goToNextQuestion}
                      className="w-full py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🌱</span>
                      {currentIndex < questions.length - 1
                        ? "Ready for another?"
                        : "See Results"}
                    </button>
                  ) : (
                    <button
                      onClick={goToNextQuestion}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
