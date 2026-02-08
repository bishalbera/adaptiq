import * as React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export const examPanicModeSchema = z.object({
  examName: z
    .string()
    .optional()
    .describe('Name of the exam (e.g., "JEE Mains")'),
  hoursUntilExam: z.number().describe("Hours until the exam"),
  userName: z.string().optional().describe("User name for personalization"),
  totalSolved: z.number().describe("Total questions user has solved"),
  accuracy: z.number().describe("User accuracy percentage (0-100)"),
  strongTopics: z
    .array(z.string())
    .optional()
    .describe("Topics user is strong in"),
  weakTopics: z
    .array(z.string())
    .optional()
    .describe("Topics user should review"),
  bestMockScore: z.number().optional().describe("Best mock test score"),
  recentScores: z.array(z.number()).optional().describe("Recent test scores"),
  onStartFocusReview: z
    .function()
    .optional()
    .describe("Start focused review session"),
  onQuickPractice: z
    .function()
    .optional()
    .describe("Start quick confidence-building practice"),
  onViewStudyPlan: z
    .function()
    .optional()
    .describe("View emergency study plan"),
  onContinue: z.function().optional().describe("Exit panic mode and continue"),
});

export type ExamPanicModeProps = z.infer<typeof examPanicModeSchema>;

const panicReliefSteps = [
  {
    icon: "🫁",
    title: "Breathe",
    instruction: "Take 3 deep breaths. In for 4, hold for 4, out for 4.",
  },
  {
    icon: "💪",
    title: "Ground yourself",
    instruction: "Name 5 things you can see right now.",
  },
  {
    icon: "🧠",
    title: "Reframe",
    instruction: "This exam is one moment. You've prepared. You're ready.",
  },
  {
    icon: "🎯",
    title: "Focus",
    instruction: "Pick ONE thing to review. Quality over quantity.",
  },
];

const lastMinuteTips = [
  { icon: "😴", tip: "Sleep is more valuable than cramming. Rest your brain." },
  { icon: "🍎", tip: "Eat well, stay hydrated. Your brain needs fuel." },
  { icon: "📱", tip: "Prepare your materials tonight. Reduce morning stress." },
  { icon: "⏰", tip: "Arrive early. Give yourself time to settle." },
  { icon: "✅", tip: "During the exam: skip hard questions, come back later." },
  {
    icon: "🧘",
    tip: "If you blank out: close eyes, breathe, start with what you know.",
  },
];

function GuidedBreathing({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = React.useState<
    "ready" | "inhale" | "hold" | "exhale" | "done"
  >("ready");
  const [cycleCount, setCycleCount] = React.useState(0);
  const totalCycles = 3;

  React.useEffect(() => {
    if (phase === "ready" || phase === "done") return;

    const timings = { inhale: 4000, hold: 4000, exhale: 4000 };
    const nextPhase = {
      inhale: "hold",
      hold: "exhale",
      exhale: "inhale",
    } as const;

    const timer = setTimeout(() => {
      if (phase === "exhale") {
        const newCount = cycleCount + 1;
        setCycleCount(newCount);
        if (newCount >= totalCycles) {
          setPhase("done");
          setTimeout(onComplete, 2000);
          return;
        }
      }
      setPhase(nextPhase[phase] as typeof phase);
    }, timings[phase]);

    return () => clearTimeout(timer);
  }, [phase, cycleCount, onComplete]);

  if (phase === "ready") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPhase("inhale")}
        className="w-full py-4 bg-gradient-to-r from-neon-secondary to-neon-primary text-white rounded-xl font-medium glow-secondary-sm"
      >
        Start Guided Breathing (1 min)
      </motion.button>
    );
  }

  const phaseColors = {
    inhale: "from-neon-primary to-neon-primary/70",
    hold: "from-neon-secondary to-neon-secondary/70",
    exhale: "from-neon-success to-neon-success/70",
    done: "from-neon-warning to-neon-warning/70",
  };

  return (
    <div className="flex flex-col items-center py-8">
      <motion.div
        animate={{
          scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 0.8 : 1.2,
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className={cn(
          "w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center glow-secondary",
          phaseColors[phase],
        )}
      >
        <span className="text-white text-xl font-medium capitalize">
          {phase === "done" ? "✨" : phase}
        </span>
      </motion.div>
      <p className="mt-4 text-muted-foreground">
        {phase === "done"
          ? "Great job! You did it."
          : `Breath ${cycleCount + 1} of ${totalCycles}`}
      </p>
    </div>
  );
}

/**
 * Countdown with perspective
 */
function ExamCountdown({
  hours,
  examName,
}: {
  hours: number;
  examName?: string;
}) {
  const getPerspective = (h: number) => {
    if (h <= 2)
      return {
        message: "Focus on rest now. You're as prepared as you'll be.",
        color: "text-neon-warning",
      };
    if (h <= 6)
      return {
        message:
          "Time for light review and early sleep. Trust your preparation.",
        color: "text-neon-primary",
      };
    if (h <= 12)
      return {
        message: "Plenty of time! Focus on your weak spots, then rest.",
        color: "text-neon-success",
      };
    if (h <= 24)
      return {
        message: "A full day ahead. Strategic review, breaks, and good sleep.",
        color: "text-neon-success",
      };
    if (h <= 48)
      return {
        message: "Two days is a lot! You can cover key topics comfortably.",
        color: "text-neon-primary",
      };
    return {
      message: "You have time. Breathe. Systematic review will serve you well.",
      color: "text-neon-primary",
    };
  };

  const perspective = getPerspective(hours);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return (
    <div className="text-center glass rounded-xl p-6">
      <p className="text-sm text-muted-foreground mb-2">
        Time until {examName || "exam"}
      </p>
      <div className="flex items-center justify-center gap-4 mb-4">
        {days > 0 && (
          <div className="text-center">
            <span className="text-4xl font-bold text-foreground">{days}</span>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        )}
        <div className="text-center">
          <span className="text-4xl font-bold text-foreground">
            {remainingHours}
          </span>
          <p className="text-xs text-muted-foreground">hours</p>
        </div>
      </div>
      <p className={cn("text-sm font-medium", perspective.color)}>
        {perspective.message}
      </p>
    </div>
  );
}

/**
 * Confidence stats display
 */
function ConfidenceBooster({
  totalSolved,
  accuracy,
  bestMockScore,
  strongTopics,
}: {
  totalSolved: number;
  accuracy: number;
  bestMockScore?: number;
  strongTopics?: string[];
}) {
  return (
    <div className="glass rounded-xl p-6 border border-neon-success/20">
      <h3 className="font-semibold text-neon-success mb-4 flex items-center gap-2">
        <span>💪</span> Remember How Far You&apos;ve Come
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-neon-success/10 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-neon-success">{totalSolved}</p>
          <p className="text-xs text-neon-success/70">Questions mastered</p>
        </div>
        <div className="bg-neon-primary/10 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-neon-primary">{accuracy}%</p>
          <p className="text-xs text-neon-primary/70">Accuracy rate</p>
        </div>
      </div>
      {bestMockScore && (
        <div className="bg-neon-secondary/10 rounded-lg p-3 text-center mb-4">
          <p className="text-sm text-neon-secondary">
            Best mock score:{" "}
            <span className="font-bold text-lg">{bestMockScore}</span>
          </p>
        </div>
      )}
      {strongTopics && strongTopics.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-neon-success/80 mb-2">
            Topics you&apos;ve nailed:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {strongTopics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-neon-success/15 text-neon-success rounded-full text-xs font-medium"
              >
                ✓ {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Emergency study plan
 */
function EmergencyPlan({
  hoursUntilExam,
  weakTopics,
  onStartFocusReview,
}: {
  hoursUntilExam: number;
  weakTopics?: string[];
  onStartFocusReview?: () => void;
}) {
  const getPlan = (hours: number) => {
    if (hours <= 6) {
      return [
        { time: "Now", action: "Light review of formulas only", icon: "📝" },
        { time: "Then", action: "Prepare materials, relax", icon: "🎒" },
        {
          time: "Tonight",
          action: "Early sleep (8 hours minimum)",
          icon: "😴",
        },
      ];
    }
    if (hours <= 12) {
      return [
        { time: "2 hours", action: "Quick review of weak topics", icon: "📚" },
        { time: "1 hour", action: "Formula sheet walkthrough", icon: "📝" },
        { time: "Then", action: "Relaxation and early dinner", icon: "🍽️" },
        { time: "Evening", action: "8+ hours of sleep", icon: "😴" },
      ];
    }
    if (hours <= 24) {
      return [
        { time: "Morning", action: "Focus on 2-3 weak topics", icon: "🎯" },
        { time: "Afternoon", action: "1 timed practice set", icon: "⏱️" },
        { time: "Evening", action: "Light formula review", icon: "📝" },
        { time: "Night", action: "Full 8 hours sleep", icon: "😴" },
      ];
    }
    return [
      {
        time: "Day 1",
        action: "Cover all weak topics systematically",
        icon: "📚",
      },
      {
        time: "Day 1 PM",
        action: "Full mock test under exam conditions",
        icon: "📋",
      },
      { time: "Day 2", action: "Review mock, focus on gaps", icon: "🔍" },
      { time: "Day 2 PM", action: "Light review, prepare, rest", icon: "🧘" },
    ];
  };

  const plan = getPlan(hoursUntilExam);

  return (
    <div className="glass rounded-xl p-6 border border-neon-primary/20">
      <h3 className="font-semibold text-neon-primary mb-4 flex items-center gap-2">
        <span>📋</span> Your Emergency Plan
      </h3>
      <div className="space-y-3">
        {plan.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-3 glass-subtle rounded-lg p-3"
          >
            <span className="text-xl">{step.icon}</span>
            <div>
              <p className="text-xs text-neon-primary font-medium">{step.time}</p>
              <p className="text-sm text-foreground">{step.action}</p>
            </div>
          </div>
        ))}
      </div>
      {weakTopics && weakTopics.length > 0 && (
        <div className="mt-4 p-3 bg-neon-warning/10 rounded-lg border border-neon-warning/20">
          <p className="text-xs text-neon-warning font-medium mb-2">
            Priority review topics:
          </p>
          <div className="flex flex-wrap gap-2">
            {weakTopics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-neon-warning/15 text-neon-warning rounded text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
      {onStartFocusReview && (
        <button
          onClick={() => onStartFocusReview()}
          className="w-full mt-4 py-3 bg-neon-primary text-white hover:bg-neon-primary/90 rounded-lg font-medium transition-all glow-primary-sm hover:glow-primary"
        >
          Start Focus Review →
        </button>
      )}
    </div>
  );
}

export const ExamPanicMode = React.forwardRef<
  HTMLDivElement,
  ExamPanicModeProps
>(
  (
    {
      examName,
      hoursUntilExam,
      userName,
      totalSolved,
      accuracy,
      strongTopics,
      weakTopics,
      bestMockScore,
      onStartFocusReview,
      onQuickPractice,
      onContinue,
    },
    ref,
  ) => {
    const [activeTab, setActiveTab] = React.useState<
      "relief" | "confidence" | "plan" | "tips"
    >("relief");
    const [showBreathing, setShowBreathing] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(0);

    // Guard against streaming partial props
    const isReady =
      typeof hoursUntilExam === "number" &&
      typeof totalSolved === "number" &&
      typeof accuracy === "number";

    if (!isReady) {
      return (
        <div
          ref={ref}
          className="glass rounded-2xl p-8 border border-neon-secondary/20"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="animate-pulse text-4xl">🫂</div>
            <span className="text-neon-secondary">
              Preparing your calm space...
            </span>
          </div>
        </div>
      );
    }

    const tabs = [
      { id: "relief" as const, label: "Calm Down", icon: "🧘" },
      { id: "confidence" as const, label: "You Got This", icon: "💪" },
      { id: "plan" as const, label: "Action Plan", icon: "📋" },
      { id: "tips" as const, label: "Exam Tips", icon: "💡" },
    ];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl border border-neon-secondary/20 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-neon-secondary to-neon-primary px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>🫂</span>
                {userName ? `${userName}, ` : ""}It&apos;s Going to Be Okay
              </h2>
              <p className="text-white/70 text-sm mt-1">
                Feeling overwhelmed is normal. Let&apos;s work through this
                together.
              </p>
            </div>
          </div>
        </div>

        {/* Exam Countdown */}
        <div className="p-6 border-b border-white/10">
          <ExamCountdown hours={hoursUntilExam} examName={examName} />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 glass-subtle">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-1",
                activeTab === tab.id
                  ? "bg-neon-secondary/15 text-neon-secondary border-b-2 border-neon-secondary"
                  : "text-muted-foreground hover:bg-white/5",
              )}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "relief" && (
              <motion.div
                key="relief"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {showBreathing ? (
                  <GuidedBreathing onComplete={() => setShowBreathing(false)} />
                ) : (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">
                        Quick Panic Relief
                      </h3>
                      {panicReliefSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all",
                            currentStep === i
                              ? "bg-neon-secondary/15 border-neon-secondary/40 glow-secondary-sm"
                              : "glass border-white/10 hover:border-neon-secondary/30",
                          )}
                          onClick={() => setCurrentStep(i)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{step.icon}</span>
                            <div>
                              <p className="font-medium text-foreground">
                                {step.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {step.instruction}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowBreathing(true)}
                      className="w-full py-4 bg-gradient-to-r from-neon-secondary to-neon-primary text-white rounded-xl font-medium transition-all glow-secondary-sm hover:glow-secondary"
                    >
                      🫁 Start Guided Breathing
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "confidence" && (
              <motion.div
                key="confidence"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <ConfidenceBooster
                  totalSolved={totalSolved}
                  accuracy={accuracy}
                  bestMockScore={bestMockScore}
                  strongTopics={strongTopics}
                />
                {onQuickPractice && (
                  <button
                    onClick={() => onQuickPractice()}
                    className="w-full py-3 bg-neon-success text-white hover:bg-neon-success/90 rounded-lg font-medium transition-all glow-success-sm hover:glow-success"
                  >
                    ✨ Quick Confidence Practice (Easy Questions)
                  </button>
                )}
              </motion.div>
            )}

            {activeTab === "plan" && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <EmergencyPlan
                  hoursUntilExam={hoursUntilExam}
                  weakTopics={weakTopics}
                  onStartFocusReview={onStartFocusReview}
                />
              </motion.div>
            )}

            {activeTab === "tips" && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Last-Minute Exam Tips
                </h3>
                {lastMinuteTips.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 glass rounded-lg"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm text-foreground">{item.tip}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {onContinue && (
          <div className="px-6 pb-6">
            <button
              onClick={() => onContinue()}
              className="w-full py-3 glass text-foreground rounded-lg font-medium transition-all hover:bg-white/10"
            >
              I&apos;m feeling better, continue studying
            </button>
          </div>
        )}
      </motion.div>
    );
  },
);

ExamPanicMode.displayName = "ExamPanicMode";
