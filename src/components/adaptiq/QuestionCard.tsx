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
    card: "bg-white border-gray-200",
    correct: "bg-green-50 border-green-500",
    incorrect: "bg-red-50 border-red-500",
    optionHover: "hover:bg-gray-50 hover:border-gray-400",
    accent: "text-blue-600",
  },
  quick: {
    card: "bg-gray-900 border-gray-700",
    correct: "bg-green-900/50 border-green-500",
    incorrect: "bg-red-900/50 border-red-500",
    optionHover: "hover:bg-gray-800 hover:border-gray-500",
    accent: "text-blue-400",
  },
  calm: {
    card: "bg-emerald-50 border-emerald-200",
    correct: "bg-emerald-100 border-emerald-500",
    incorrect: "bg-amber-50 border-amber-400",
    optionHover: "hover:bg-emerald-100 hover:border-emerald-400",
    accent: "text-emerald-700",
  },
};

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
          "border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all",
          styles.optionHover,
        );
      }

      if (option === correctAnswer) {
        return "border-2 border-green-500 bg-green-50 rounded-lg p-4";
      }

      if (option === selectedAnswer && option !== correctAnswer) {
        return "border-2 border-red-500 bg-red-50 rounded-lg p-4";
      }

      return "border-2 border-gray-200 rounded-lg p-4 opacity-50";
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
          "rounded-xl border-2 p-6 shadow-sm transition-all",
          isAnswered
            ? isCorrect
              ? styles.correct
              : styles.incorrect
            : styles.card,
          mode === "quick" && "text-white",
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
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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
              mode === "quick" ? "text-white" : "text-gray-800",
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
                      ? "bg-green-500 text-white"
                      : isAnswered && key === selectedAnswer
                        ? "bg-red-500 text-white"
                        : mode === "quick"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600",
                  )}
                >
                  {optionLabels[index]}
                </span>
                <span
                  className={cn(
                    "pt-1",
                    mode === "quick" && !isAnswered ? "text-gray-200" : "",
                  )}
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
                        Incorrect. The answer is {correctAnswer.toUpperCase()}.
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Explanation
                </h4>
                <p className="text-blue-800">{explanation}</p>
              </div>

              {/* Common Mistake (if wrong and available) */}
              {!isCorrect && commonMistake && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">
                    Common Mistake
                  </h4>
                  <p className="text-amber-800">{commonMistake}</p>
                </div>
              )}

              {/* Next Question Navigation - Mode Dependent */}
              {onNext && (
                <div className="mt-6">
                  {mode === "quick" ? (
                    // Quick mode: Auto-advance with countdown
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-sm",
                          mode === "quick" ? "text-gray-400" : "text-gray-500",
                        )}
                      >
                        Next question in {countdown}s...
                      </span>
                      <button
                        onClick={onNext}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Skip →
                      </button>
                    </div>
                  ) : mode === "calm" ? (
                    // Calm mode: Gentle prompt
                    <button
                      onClick={onNext}
                      className="w-full py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🌱</span>
                      Ready for another?
                    </button>
                  ) : (
                    // Standard mode: Clear next button
                    <button
                      onClick={onNext}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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