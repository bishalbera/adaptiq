import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const POST = async (req: NextRequest) => {
  try {
    const { type, data } = await req.json();
    let prompt: string;
    let systemPrompt: string;

    switch (type) {
      case "classifyMistake":
        systemPrompt = `You are an expert tutor analyzing student mistakes on JEE exam questions.
Classify the mistake into exactly ONE of these categories:
- conceptual: Student doesn't understand the underlying concept or principle
- calculation: Student understood the concept but made arithmetic/algebraic error
- careless: Student rushed, didn't read carefully, picked similar-looking answer
- misread: Student misunderstood what the question was asking

Also provide a brief, encouraging explanation of the mistake and a specific tip to avoid it next time.

Respond in JSON format only:
{
  "mistakeType": "conceptual" | "calculation" | "careless" | "misread",
  "explanation": "Why they likely made this mistake",
  "tip": "Specific actionable advice",
  "encouragement": "Brief encouraging message"
}`;

        prompt = `Question: ${data.questionText}
Topic: ${data.topic}
Subject: ${data.subject}

Student selected: ${data.selectedAnswer.toUpperCase()}) ${data.selectedOption}
Correct answer: ${data.correctAnswer.toUpperCase()}) ${data.correctOption}

Explanation of correct answer: ${data.explanation}
${data.commonMistake ? `Common mistake on this question: ${data.commonMistake}` : ""}

Analyze why the student likely chose the wrong answer and classify the mistake type.`;
        break;

      case "generateEncouragement":
        systemPrompt = `You are a supportive, empathetic tutor helping a student who is struggling.
Generate a personalized encouraging message based on their current state and progress.
Keep it brief (2-3 sentences), genuine, and specific to their situation.
Don't be patronizing. Be warm but real.

Respond in JSON format only:
{
  "message": "The encouraging message",
  "suggestedAction": "One specific thing they could do right now"
}`;

        prompt = `Student situation:
- Mood: ${data.mood || "unknown"}
- Recent accuracy: ${data.accuracy}%
- Questions solved: ${data.totalSolved}
- Current streak: ${data.streak} days
- Strong topics: ${data.strongTopics?.join(", ") || "none identified yet"}
- Struggling with: ${data.weakTopics?.join(", ") || "none identified"}
- Stress level: ${data.stressLevel || "unknown"}
${data.recentMistakes ? `- Recent mistakes: ${data.recentMistakes}` : ""}

Generate an encouraging, personalized message for this student.`;
        break;

      case "analyzeStudyPattern":
        systemPrompt = `You are an expert learning coach analyzing a student's study patterns.
Based on their practice history, provide actionable insights.

Respond in JSON format only:
{
  "strengths": ["strength1", "strength2"],
  "areasToImprove": ["area1", "area2"],
  "recommendedFocus": "Most important thing to focus on",
  "studyTip": "Personalized study strategy tip",
  "estimatedReadiness": "low" | "medium" | "high"
}`;

        prompt = `Student's practice data:
- Total questions attempted: ${data.totalAttempted}
- Overall accuracy: ${data.accuracy}%
- Time spent: ${data.totalMinutes} minutes
- Topics practiced: ${JSON.stringify(data.topicBreakdown)}
- Mistake patterns: ${JSON.stringify(data.mistakePatterns)}
- Days until exam: ${data.daysUntilExam || "unknown"}

Analyze their study pattern and provide recommendations.`;
        break;

      case "detectPanicLevel":
        systemPrompt = `You are an empathetic AI detecting student stress and panic levels.
Analyze the student's message for signs of anxiety, stress, or panic about their exam.

Respond in JSON format only:
{
  "panicLevel": "none" | "low" | "medium" | "high" | "crisis",
  "detectedEmotions": ["emotion1", "emotion2"],
  "needsIntervention": boolean,
  "suggestedApproach": "calm" | "encouraging" | "practical" | "crisis-support",
  "keyTriggers": ["what specifically is causing stress"]
}`;

        prompt = `Student's message: "${data.message}"

Context:
- Exam in: ${data.hoursUntilExam || "unknown"} hours
- Current accuracy: ${data.accuracy || "unknown"}%
- Recent session performance: ${data.recentPerformance || "unknown"}

Detect their emotional state and panic level.`;
        break;

      default:
        return NextResponse.json(
          { error: "Unknown analysis type" },
          { status: 400 },
        );
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
      system: systemPrompt,
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    const result = JSON.parse(textContent.text);

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI Analysis error:", err);
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
