"use client";

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
  color = "stroke-neon-primary",
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
          className="fill-none stroke-white/10"
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
        <span className="text-2xl font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
};

const StatItem = ({
  label,
  value,
  icon,
  color = "text-foreground",
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
        <p className="text-sm text-muted-foreground">{label}</p>
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
      ? "bg-neon-success/10 border-neon-success/20 text-neon-success"
      : "bg-neon-error/10 border-neon-error/20 text-neon-error";
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
      strongTopics: _strongTopics,
      weakTopics: _weakTopics,
      daysUntilExam,
      variant = "default",
    },
    ref,
  ) => {
    const strongTopics = _strongTopics ?? [];
    const weakTopics = _weakTopics ?? [];

    const accuracy =
      totalAttempted > 0
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : 0;

    const progressColor =
      accuracy >= 80
        ? "stroke-neon-success"
        : accuracy >= 60
          ? "stroke-neon-warning"
          : "stroke-neon-error";

    if (variant === "compact") {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-lg p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {totalAttempted}
                </p>
                <p className="text-xs text-muted-foreground">Attempted</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-warning">
                  {currentStreak}🔥
                </p>
                <p className="text-xs text-muted-foreground">Day streak</p>
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
          className="bg-neon-success/5 backdrop-blur-xl rounded-xl border border-neon-success/20 p-6"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-neon-success mb-2">
              Look how far you&apos;ve come! 🌟
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-neon-success/10 rounded-lg">
              <p className="text-3xl font-bold text-neon-success text-glow-success">
                {totalAttempted}
              </p>
              <p className="text-sm text-neon-success/70">Questions solved</p>
            </div>
            <div className="text-center p-4 bg-neon-success/10 rounded-lg">
              <p className="text-3xl font-bold text-neon-success text-glow-success">
                {totalCorrect}
              </p>
              <p className="text-sm text-neon-success/70">Correct answers</p>
            </div>
            <div className="text-center p-4 bg-neon-warning/10 rounded-lg">
              <p className="text-3xl font-bold text-neon-warning">
                {currentStreak}🔥
              </p>
              <p className="text-sm text-neon-success/70">Day streak</p>
            </div>
          </div>

          {strongTopics.length > 0 && (
            <div className="glass rounded-lg p-4">
              <h4 className="font-medium text-neon-success mb-2">
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
        className="glass rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Your Progress
        </h3>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Circular progress */}
          <div className="flex flex-col items-center">
            <CircularProgress percentage={accuracy} color={progressColor} />
            <p className="text-sm text-muted-foreground mt-2">Overall Accuracy</p>
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
              color="text-neon-success"
            />
            <StatItem
              label="Day Streak"
              value={`${currentStreak} 🔥`}
              icon="📆"
              color="text-neon-warning"
            />
            {daysUntilExam !== undefined && daysUntilExam !== null && (
              <StatItem
                label="Days Until Exam"
                value={daysUntilExam}
                icon="🎯"
                color={daysUntilExam <= 7 ? "text-neon-error" : "text-neon-primary"}
              />
            )}
          </div>
        </div>

        {/* Topics section */}
        {(strongTopics.length > 0 || weakTopics.length > 0) && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Strong topics */}
              {strongTopics.length > 0 && (
                <div>
                  <h4 className="font-medium text-neon-success mb-2">
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
                  <h4 className="font-medium text-neon-error mb-2">
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
