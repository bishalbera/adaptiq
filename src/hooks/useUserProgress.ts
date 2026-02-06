"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserProgress,
  DEFAULT_USER_PROGRESS,
  AnswerRecord,
  TopicStats,
  Subject,
  MistakeType,
} from "@/types";

const STORAGE_KEY = "adaptiq-user-progress";

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProgress;
        setProgress({
          ...DEFAULT_USER_PROGRESS,
          ...parsed,
          topicStats: {
            physics: { ...parsed.topicStats?.physics },
            chemistry: { ...parsed.topicStats?.chemistry },
            math: { ...parsed.topicStats?.math },
          },
        });
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  }, [progress, isLoaded]);

  const recordAnswer = useCallback(
    (
      questionId: string,
      subject: Subject,
      topic: string,
      selectedAnswer: "a" | "b" | "c" | "d",
      correctAnswer: "a" | "b" | "c" | "d",
      timeSpent: number,
      mistakeType?: MistakeType,
    ) => {
      const isCorrect = selectedAnswer === correctAnswer;

      setProgress((prev) => {
        const subjectStats = { ...prev.topicStats[subject] };
        const currentTopicStats: TopicStats = subjectStats[topic] || {
          attempted: 0,
          correct: 0,
        };

        subjectStats[topic] = {
          attempted: currentTopicStats.attempted + 1,
          correct: currentTopicStats.correct + (isCorrect ? 1 : 0),
        };

        const answerRecord: AnswerRecord = {
          questionId,
          selectedAnswer,
          isCorrect,
          timestamp: Date.now(),
          timeSpent,
          mistakeType: isCorrect ? undefined : mistakeType,
        };

        let recentMistakes = [...prev.recentMistakes];
        if (!isCorrect && mistakeType) {
          recentMistakes = [
            { questionId, mistakeType, topic, timestamp: Date.now() },
            ...recentMistakes,
          ].slice(0, 20);
        }

        const recentAnswers = [answerRecord, ...prev.recentAnswers].slice(
          0,
          50,
        );

        const today = new Date().toISOString().split("T")[0];
        const lastDate = prev.lastPracticeDate;
        let newStreak = prev.currentStreak;

        if (lastDate !== today) {
          if (lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            if (lastDate === yesterdayStr) {
              newStreak = prev.currentStreak + 1;
            } else {
              newStreak = 1;
            }
          } else {
            newStreak = 1;
          }
        }

        return {
          ...prev,
          totalAttempted: prev.totalAttempted + 1,
          totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
          topicStats: {
            ...prev.topicStats,
            [subject]: subjectStats,
          },
          currentStreak: newStreak,
          lastPracticeDate: today,
          recentMistakes,
          recentAnswers,
        };
      });
    },
    [],
  );

  const setExamDate = useCallback((date: string | null) => {
    setProgress((prev) => ({ ...prev, examDate: date }));
  }, []);

  const setMood = useCallback((mood: UserProgress["currentMood"]) => {
    setProgress((prev) => ({ ...prev, currentMood: mood }));
  }, []);

  const getDaysUntilExam = useCallback((): number | null => {
    if (!progress.examDate) return null;

    const examDate = new Date(progress.examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);

    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, [progress.examDate]);

  const getAccuracy = useCallback((): number => {
    if (progress.totalAttempted === 0) return 0;
    return Math.round((progress.totalCorrect / progress.totalAttempted) * 100);
  }, [progress.totalAttempted, progress.totalCorrect]);

  const getTopicAccuracy = useCallback(
    (subject: Subject, topic: string): number | null => {
      const stats = progress.topicStats[subject]?.[topic];
      if (!stats || stats.attempted === 0) return null;
      return Math.round((stats.correct / stats.attempted) * 100);
    },
    [progress.topicStats],
  );

  const getWeakTopics = useCallback((): Array<{
    subject: Subject;
    topic: string;
    accuracy: number;
  }> => {
    const weak: Array<{ subject: Subject; topic: string; accuracy: number }> =
      [];

    for (const subject of ["physics", "chemistry", "math"] as Subject[]) {
      const subjectStats = progress.topicStats[subject];
      for (const [topic, stats] of Object.entries(subjectStats)) {
        if (stats.attempted >= 3) {
          // Minimum attempts to be significant
          const accuracy = Math.round((stats.correct / stats.attempted) * 100);
          if (accuracy < 60) {
            weak.push({ subject, topic, accuracy });
          }
        }
      }
    }

    return weak.sort((a, b) => a.accuracy - b.accuracy);
  }, [progress.topicStats]);

  const getStrongTopics = useCallback((): Array<{
    subject: Subject;
    topic: string;
    accuracy: number;
  }> => {
    const strong: Array<{ subject: Subject; topic: string; accuracy: number }> =
      [];

    for (const subject of ["physics", "chemistry", "math"] as Subject[]) {
      const subjectStats = progress.topicStats[subject];
      for (const [topic, stats] of Object.entries(subjectStats)) {
        if (stats.attempted >= 3) {
          const accuracy = Math.round((stats.correct / stats.attempted) * 100);
          if (accuracy >= 80) {
            strong.push({ subject, topic, accuracy });
          }
        }
      }
    }

    return strong.sort((a, b) => b.accuracy - a.accuracy);
  }, [progress.topicStats]);

  const getMistakePattern = useCallback((): {
    type: MistakeType;
    count: number;
  } | null => {
    if (progress.recentMistakes.length < 3) return null;

    const counts: Record<MistakeType, number> = {
      conceptual: 0,
      calculation: 0,
      careless: 0,
      misread: 0,
    };

    for (const mistake of progress.recentMistakes) {
      counts[mistake.mistakeType]++;
    }

    const maxType = (Object.keys(counts) as MistakeType[]).reduce((a, b) =>
      counts[a] > counts[b] ? a : b,
    );

    if (counts[maxType] < 2) return null;

    return { type: maxType, count: counts[maxType] };
  }, [progress.recentMistakes]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_USER_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    progress,
    isLoaded,
    recordAnswer,
    setExamDate,
    setMood,
    getDaysUntilExam,
    getAccuracy,
    getTopicAccuracy,
    getWeakTopics,
    getStrongTopics,
    getMistakePattern,
    resetProgress,
  };
}
