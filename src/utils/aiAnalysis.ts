import { MistakeType } from "@/types";

export interface MistakeClassification {
  mistakeType: MistakeType;
  explanation: string;
  tip: string;
  encouragement: string;
}

export interface EncouragementResult {
  message: string;
  suggestedAction: string;
}

export interface StudyPatternAnalysis {
  strengths: string[];
  areasToImprove: string[];
  recommendedFocus: string;
  studyTip: string;
  estimatedReadiness: "low" | "medium" | "high";
}

export interface PanicDetection {
  panicLevel: "none" | "low" | "medium" | "high" | "crisis";
  detectedEmotions: string[];
  needsIntervention: boolean;
  suggestedApproach: "calm" | "encouraging" | "practical" | "crisis-support";
  keyTriggers: string[];
}

async function callAnalyzeAPI<T>(
  type: string,
  data: Record<string, unknown>,
): Promise<T> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || "Analysis failed");
  }

  return response.json();
}

export async function classifyMistakeAI(params: {
  questionText: string;
  topic: string;
  subject: string;
  selectedAnswer: string;
  selectedOption: string;
  correctAnswer: string;
  correctOption: string;
  explanation: string;
  commonMistake?: string;
}): Promise<MistakeClassification> {
  return callAnalyzeAPI<MistakeClassification>("classifyMistake", params);
}

export async function generateEncouragementAI(params: {
  mood?: string;
  accuracy: number;
  totalSolved: number;
  streak: number;
  strongTopics?: string[];
  weakTopics?: string[];
  stressLevel?: string;
  recentMistakes?: string;
}): Promise<EncouragementResult> {
  return callAnalyzeAPI<EncouragementResult>("generateEncouragement", params);
}

export async function analyzeStudyPatternAI(params: {
  totalAttempted: number;
  accuracy: number;
  totalMinutes: number;
  topicBreakdown: Record<string, { attempted: number; correct: number }>;
  mistakePatterns: Record<MistakeType, number>;
  daysUntilExam?: number;
}): Promise<StudyPatternAnalysis> {
  return callAnalyzeAPI<StudyPatternAnalysis>("analyzeStudyPattern", params);
}

export async function detectPanicLevelAI(params: {
  message: string;
  hoursUntilExam?: number;
  accuracy?: number;
  recentPerformance?: string;
}): Promise<PanicDetection> {
  return callAnalyzeAPI<PanicDetection>("detectPanicLevel", params);
}


