import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";

export const calmModeSchema = z.object({
  userName: z.string().optional().describe("User name for personalization"),
  totalSolved: z.number().describe("Total questions user has solved"),
  currentStreak: z.number().describe("Current day streak"),
  strongTopic: z.string().optional().describe("A topic user is good at"),
  onTakeBreak: z
    .function()
    .optional()
    .describe("Callback when user wants a break"),
  onEasyPractice: z
    .function()
    .optional()
    .describe("Callback to start easy practice"),
  onContinueNormally: z
    .function()
    .optional()
    .describe("Callback to exit calm mode"),
  breakDurationMinutes: z
    .number()
    .optional()
    .describe("Suggested break duration"),
});

export type CalmModeProps = z.infer<typeof calmModeSchema>;

function BreathingExercise() {
  const [phase, setPhase] = React.useState<"inhale" | "hold" | "exhale">(
    "inhale",
  );
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (!isActive) return;

    const phases: Array<{
      name: "inhale" | "hold" | "exhale";
      duration: number;
    }> = [
      { name: "inhale", duration: 4000 },
      { name: "hold", duration: 4000 },
      { name: "exhale", duration: 4000 },
    ];

    let currentIndex = 0;

    const cycle = () => {
      setPhase(phases[currentIndex].name);
      currentIndex = (currentIndex + 1) % phases.length;
    };

    cycle();
    const interval = setInterval(cycle, 4000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="text-emerald-600 underline text-sm hover:text-emerald-700"
      >
        Try a breathing exercise
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{
          scale: phase === "inhale" ? 1.3 : phase === "exhale" ? 0.8 : 1,
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"
      >
        <span className="text-white text-lg font-medium capitalize">
          {phase}
        </span>
      </motion.div>
      <button
        onClick={() => setIsActive(false)}
        className="text-gray-500 text-sm hover:text-gray-700"
      >
        Stop
      </button>
    </div>
  );
}

function BreakTimer({
  minutes,
  onComplete,
}: {
  minutes: number;
  onComplete: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = React.useState(minutes * 60);
  const [isRunning, setIsRunning] = React.useState(true);

  React.useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      if (secondsLeft <= 0) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, onComplete]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="text-center">
      <p className="text-4xl font-mono font-bold text-emerald-700">
        {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
      </p>
      <div className="flex gap-2 justify-center mt-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          End Break
        </button>
      </div>
    </div>
  );
}

export const CalmMode = React.forwardRef<HTMLDivElement, CalmModeProps>(
  (
    {
      userName,
      totalSolved,
      currentStreak,
      strongTopic,
      onTakeBreak,
      onEasyPractice,
      onContinueNormally,
      breakDurationMinutes = 5,
    },
    ref,
  ) => {
    const [showBreakTimer, setShowBreakTimer] = React.useState(false);

    const encouragements = [
      "It's okay to feel overwhelmed. Learning is hard work.",
      "Every expert was once a beginner.",
      "You're doing better than you think.",
      "Progress isn't always linear. Keep going.",
      "Taking breaks is part of learning effectively.",
    ];

    const randomEncouragement =
      encouragements[Math.floor(Math.random() * encouragements.length)];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[400px] bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border-2 border-emerald-200 p-8"
      >
        <AnimatePresence mode="wait">
          {showBreakTimer ? (
            <motion.div
              key="break"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[300px]"
            >
              <h2 className="text-2xl font-semibold text-emerald-800 mb-2">
                Take a breath 🌿
              </h2>
              <p className="text-emerald-600 mb-8">
                Step away, stretch, hydrate. You&apos;ve earned it.
              </p>
              <BreakTimer
                minutes={breakDurationMinutes}
                onComplete={() => setShowBreakTimer(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-5xl mb-4"
                >
                  🌱
                </motion.div>
                <h2 className="text-2xl font-semibold text-emerald-800 mb-2">
                  Hey{userName ? `, ${userName}` : ""}, take a moment.
                </h2>
                <p className="text-emerald-600 italic">
                  &quot;{randomEncouragement}&quot;
                </p>
              </div>

              <div className="bg-white/60 rounded-xl p-6 mb-6">
                <h3 className="font-medium text-emerald-800 mb-4 text-center">
                  Look what you&apos;ve accomplished 🌟
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-3xl font-bold text-emerald-700">
                      {totalSolved}
                    </p>
                    <p className="text-sm text-emerald-600">Problems solved</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">
                      {currentStreak} 🔥
                    </p>
                    <p className="text-sm text-orange-600">Day streak</p>
                  </div>
                </div>
                {strongTopic && (
                  <p className="text-center mt-4 text-emerald-700">
                    You&apos;re especially good at{" "}
                    <strong>{strongTopic}</strong>!
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowBreakTimer(true)}
                  className="w-full py-4 px-6 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>🧘</span>
                  Take a {breakDurationMinutes}-minute break
                </button>

                {onEasyPractice && (
                  <button
                    onClick={() => onEasyPractice()}
                    className="w-full py-4 px-6 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✨</span>
                    Try some easy wins
                    {strongTopic && (
                      <span className="text-sm opacity-75">
                        ({strongTopic})
                      </span>
                    )}
                  </button>
                )}

                {onContinueNormally && (
                  <button
                    onClick={() => onContinueNormally()}
                    className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    I&apos;m okay, continue normally
                  </button>
                )}
              </div>

              <div className="mt-8 text-center">
                <BreathingExercise />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);

CalmMode.displayName = "CalmMode";