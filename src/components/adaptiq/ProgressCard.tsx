import * as React from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const progressCardSchema = z.object({
  totalAttempted: z.number().describe("Total questions attempted"),
  totalCorrect: z.number().describe("Total correct answers"),
  currentStreak: z.number().describe("Current streak in days"),
  strongTopics: z
    .array(
      z.object({
        subject: z.string(),
        topic: z.string(),
        accuracy: z.number(),
      }),
    )
    .optional()
    .describe("Topics with high accuracy"),
  weakTopics: z
    .array(
      z.object({
        subject: z.string(),
        topic: z.string(),
        accuracy: z.number(),
      }),
    )
    .optional()
    .describe("Topics needing improvement"),
  daysUntilExam: z.number().optional().describe("Days remaining until exam"),
  variant: z
    .enum(["default", "compact", "calm"])
    .optional()
    .describe("Display variant"),
});

export type ProgressCardProps = z.infer<typeof progressCardSchema>;

const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "stroke-blue-500",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-gray-200"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={cn("fill-none", color)}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  );
};

const StatItem = ({
  label,
  value,
  icon,
  color = "text-gray-800",
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className={cn("text-xl font-semibold", color)}>{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

const TopicBadge = ({
  subject,
  topic,
  accuracy,
  type,
}: {
  subject: string;
  topic: string;
  accuracy: number;
  type: "strong" | "weak";
}) => {
  const color =
    type === "strong"
      ? "bg-green-50 border-green-200 text-green-800"
      : "bg-red-50 border-red-200 text-red-800";
  return (
    <div className={cn("px-3 py-2 rounded-lg border text-sm", color)}>
      <span className="font-medium">{topic}</span>
      <span className="text-xs ml-2 opacity-75">({accuracy}%) </span>
    </div>
  );
};

export const ProgressCard = React.forwardRef<HTMLDivElement, ProgressCardProps>(
  (
    {
      totalAttempted,
      totalCorrect,
      currentStreak,
      strongTopics = [],
      weakTopics = [],
      daysUntilExam,
      variant = "default",
    },
    ref,
  ) => {
    const accuracy =
      totalAttempted > 0
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : 0;

    const progressColor =
      accuracy >= 80
        ? "stroke-green-500"
        : accuracy >= 60
          ? "stroke-yellow-500"
          : "stroke-red-500";

    if (variant === "compact") {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{accuracy}%</p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {totalAttempted}
                </p>
                <p className="text-xs text-gray-500">Attempted</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">
                  {currentStreak}🔥
                </p>
                <p className="text-xs text-gray-500">Day streak</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (variant === "calm") {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 p-6 shadow-sm"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              Look how far you&apos;ve come! 🌟
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <p className="text-3xl font-bold text-emerald-700">
                {totalAttempted}
              </p>
              <p className="text-sm text-emerald-600">Questions solved</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <p className="text-3xl font-bold text-emerald-700">
                {totalCorrect}
              </p>
              <p className="text-sm text-emerald-600">Correct answers</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <p className="text-3xl font-bold text-orange-500">
                {currentStreak}🔥
              </p>
              <p className="text-sm text-emerald-600">Day streak</p>
            </div>
          </div>

          {strongTopics.length > 0 && (
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 mb-2">
                Your strengths 💪
              </h4>
              <div className="flex flex-wrap gap-2">
                {strongTopics.slice(0, 3).map((t, i) => (
                  <TopicBadge key={i} {...t} type="strong" />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Your Progress
        </h3>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Circular progress */}
          <div className="flex flex-col items-center">
            <CircularProgress percentage={accuracy} color={progressColor} />
            <p className="text-sm text-gray-500 mt-2">Overall Accuracy</p>
          </div>

          {/* Right: Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <StatItem
              label="Questions Attempted"
              value={totalAttempted}
              icon="📝"
            />
            <StatItem
              label="Correct Answers"
              value={totalCorrect}
              icon="✅"
              color="text-green-600"
            />
            <StatItem
              label="Day Streak"
              value={`${currentStreak} 🔥`}
              icon="📆"
              color="text-orange-500"
            />
            {daysUntilExam !== undefined && daysUntilExam !== null && (
              <StatItem
                label="Days Until Exam"
                value={daysUntilExam}
                icon="🎯"
                color={daysUntilExam <= 7 ? "text-red-600" : "text-blue-600"}
              />
            )}
          </div>
        </div>

        {/* Topics section */}
        {(strongTopics.length > 0 || weakTopics.length > 0) && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Strong topics */}
              {strongTopics.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Strong Topics 💪
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {strongTopics.slice(0, 3).map((t, i) => (
                      <TopicBadge key={i} {...t} type="strong" />
                    ))}
                  </div>
                </div>
              )}

              {/* Weak topics */}
              {weakTopics.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Needs Practice 📚
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {weakTopics.slice(0, 3).map((t, i) => (
                      <TopicBadge key={i} {...t} type="weak" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  },
);

ProgressCard.displayName = "ProgressCard";
