export const SUBJECTS = ["physics", "chemistry", "math"] as const;
export type Subject = (typeof SUBJECTS)[number];

export type Difficulty = 1 | 2 | 3;

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  text: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: "a" | "b" | "c" | "d";
  explanation: string;
  commonMistake?: string;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export type MistakeType = "conceptual" | "calculation" | "careless" | "misread";

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: "a" | "b" | "c" | "d";
  isCorrect: boolean;
  timestamp: number;
  timeSpent: number;
  mistakeType?: MistakeType;
}

export interface TopicStats {
  attempted: number;
  correct: number;
}

export interface UserProgress {
  totalAttempted: number;
  totalCorrect: number;
  topicStats: Record<Subject, Record<string, TopicStats>>;
  currentStreak: number;
  lastPracticeDate: string | null;
  examDate: string | null;
  recentMistakes: Array<{
    questionId: string;
    mistakeType: MistakeType;
    topic: string;
    timestamp: number;
  }>;
  currentMood: MoodLevel | null;
  recentAnswers: AnswerRecord[];
}

export type TimeBudget = "quick" | "standard" | "deep";

export type StressLevel = "none" | "low" | "medium" | "high";

export type PracticeMode =
  | "quickfire" // 10 min or less
  | "standard" // Normal practice
  | "deep" // Extended with explanations
  | "calm" // Stress-response mode
  | "exam-prep"; // Final week before exam

export interface SessionContext {
  timeBudget: TimeBudget;
  timeMinutes: number | null;
  stressLevel: StressLevel;
  practiceMode: PracticeMode;
  daysUntilExam: number | null;
  currentMood: MoodLevel | null;
  suggestedDifficulty: Difficulty;
  suggestedTopics: string[];
}

export interface AnswerFeedback {
  isCorrect: boolean;
  selectedAnswer: "a" | "b" | "c" | "d";
  correctAnswer: "a" | "b" | "c" | "d";
  explanation: string;
  commonMistake?: string;
  similarMistakeCount?: number;
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  totalAttempted: 0,
  totalCorrect: 0,
  topicStats: {
    physics: {},
    chemistry: {},
    math: {},
  },
  currentStreak: 0,
  lastPracticeDate: null,
  examDate: null,
  recentMistakes: [],
  currentMood: null,
  recentAnswers: [],
};
