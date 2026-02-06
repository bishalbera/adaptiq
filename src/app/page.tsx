"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getQuestionStats } from "@/data/questions";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const stats = getQuestionStats();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-60 dark:opacity-70 adaptiq-hero-bg max-md:hidden"
      />
      {/* Header */}
      <header className="relative p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">
            Adapt<span className="text-blue-500">IQ</span>
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/chat"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start practicing
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6">
            Exam prep that
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              adapts to you
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            An AI-powered study companion that reshapes the interface based on
            your time, focus, and stress level. JEE-style practice is included,
            but the product story stays broader.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-black/10 dark:shadow-black/40"
          >
            Start practicing
            <svg
              className="w-5 h-5"
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
          </Link>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            emoji="⏱️"
            title="Time-Aware"
            description="Got 10 minutes? Get rapid-fire mode. Got an hour? Deep practice with explanations."
          />
          <FeatureCard
            emoji="🧘"
            title="Stress-Aware"
            description="Feeling overwhelmed? The app transforms into a calming, supportive interface."
          />
          <FeatureCard
            emoji="📊"
            title="Adaptive Difficulty"
            description="Questions adjust based on your mood and performance. Bad day? Easier questions."
          />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-8 shadow-sm border border-border"
        >
          <h3 className="text-center text-muted-foreground mb-6">
            Built-in question bank
          </h3>
          <p className="text-center text-muted-foreground/80 mb-6 text-sm">
            Today we ship a Physics / Chemistry / Math starter pack inspired by
            JEE-style problems. More exam packs can plug in later.
          </p>
          <div className="grid grid-cols-4 gap-4 text-center">
            <StatBox label="Total Questions" value={stats.total} />
            <StatBox
              label="Physics"
              value={stats.bySubject.physics}
              color="text-blue-600"
            />
            <StatBox
              label="Chemistry"
              value={stats.bySubject.chemistry}
              color="text-purple-600"
            />
            <StatBox
              label="Math"
              value={stats.bySubject.math}
              color="text-orange-600"
            />
          </div>
        </motion.div>

        {/* How It Works */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>
          <div className="space-y-4">
            <StepCard
              number={1}
              title="Just type naturally"
              description="Say things like 'I have 10 minutes for physics' or 'I'm stressed about calculus'"
            />
            <StepCard
              number={2}
              title="AI understands context"
              description="The app detects your time, subject preference, and emotional state"
            />
            <StepCard
              number={3}
              title="UI transforms"
              description="The interface adapts - quick mode, calm mode, deep practice, whatever you need"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Built for the UI Strikes Back Hackathon
          </p>
          <p className="text-muted-foreground/80 text-sm">
            Powered by{" "}
            <a
              href="https://tambo.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Tambo AI
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl p-6 shadow-sm border border-border"
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}

function StatBox({
  label,
  value,
  color = "text-foreground",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="shrink-0 w-10 h-10 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
