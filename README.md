# AdaptIQ

**Adaptive JEE Exam Preparation Platform** — Built for the Tambo "UI Strikes Back" Hackathon

AdaptIQ is an AI-powered study companion that dynamically transforms its UI based on your context: time available, stress level, exam proximity, and emotional state. It doesn't just quiz you—it understands you.

## The Problem

Traditional exam prep apps treat every student the same. But a student with 10 minutes before class needs a different experience than someone with 2 hours on a weekend. A stressed student needs encouragement, not pressure. AdaptIQ adapts.

## Key Features

### Context-Aware UI Components

| Component | Triggers When | What It Does |
|-----------|---------------|--------------|
| **PracticeSession** | User wants to practice | Multi-question flow with mode-dependent behavior |
| **QuestionCard** | Single question needed | Displays one question with instant feedback |
| **ProgressCard** | User asks about progress | Stats, streaks, strong/weak topics |
| **CalmMode** | Stress detected | Soothing UI, breathing exercises, accomplishments |
| **ExamPanicMode** | Pre-exam crisis | Emergency intervention with countdown, tips, action plan |
| **MistakeAnalysis** | Wrong answer analysis | Deep dive into WHY they got it wrong |

### Three Practice Modes

- **Quick Mode**: Dark theme, auto-advances after 3 seconds, minimal explanations
- **Standard Mode**: Full explanations, manual "Next Question" button
- **Calm Mode**: Soothing colors, gentle prompts, encouraging messages

### AI-Powered Analysis

AdaptIQ uses Claude AI for intelligent analysis:

| Tool | Purpose |
|------|---------|
| `classifyMistakeAI` | Understands WHY you got it wrong (conceptual vs calculation vs careless) |
| `detectPanicLevelAI` | Reads emotional state from natural language |
| `generateEncouragementAI` | Personalized, empathetic encouragement |
| `analyzeStudyPatternAI` | Learning coach insights and recommendations |

## Tech Stack

- **Next.js 15** with App Router
- **Tambo AI SDK** for Generative UI
- **Anthropic Claude** for AI analysis
- **Framer Motion** for animations
- **Tailwind CSS v4** for styling
- **Zod** for schema validation
- **TypeScript** strict mode

## Project Structure

```
src/
├── app/
│   ├── api/analyze/     # AI analysis endpoint
│   ├── chat/            # Main chat interface
│   └── page.tsx         # Landing page
├── components/
│   └── adaptiq/         # AdaptIQ components
│       ├── PracticeSession.tsx
│       ├── QuestionCard.tsx
│       ├── ProgressCard.tsx
│       ├── CalmMode.tsx
│       ├── ExamPanicMode.tsx
│       └── MistakeAnalysis.tsx
├── data/
│   └── questions.ts     # 50 real JEE questions
├── hooks/
│   └── useUserProgress.ts
├── lib/
│   └── tambo.ts         # Component & tool registration
├── types/
│   └── index.ts         # TypeScript definitions
└── utils/
    ├── parseUserInput.ts
    └── aiAnalysis.ts    # AI client utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Tambo API key ([get one free](https://tambo.co/dashboard))
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd adaptiq

# Install dependencies
npm install

# Set up environment variables
cp example.env.local .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage Examples

Try these prompts in the chat:

| Prompt | What Happens |
|--------|--------------|
| "I have 10 minutes, give me some quick physics practice" | Quick mode session with physics questions |
| "I'm stressed about chemistry" | CalmMode with encouragement + easy practice |
| "My JEE is tomorrow and I'm freaking out" | ExamPanicMode with emergency support |
| "Why did I get that wrong?" | MistakeAnalysis with AI-powered explanation |
| "How am I doing?" | ProgressCard with stats and insights |
| "Practice 5 math questions" | Standard PracticeSession |

## How Tambo Works

AdaptIQ uses Tambo's Generative UI to let AI decide which component to render:

```typescript
// Components are registered with descriptions
{
  name: 'ExamPanicMode',
  description: `CRITICAL: Emergency intervention for pre-exam panic...
    WHEN TO USE: User mentions exam tomorrow, expresses panic...`,
  component: ExamPanicMode,
  propsSchema: examPanicModeSchema,
}
```

The AI reads these descriptions and decides:
1. Which component fits the user's context
2. What props to generate
3. Which tools to call for data

## Architecture Decisions

### Why Generative UI?

Traditional chatbots return text. AdaptIQ returns **experiences**. When a student panics, they don't need a paragraph—they need a breathing exercise, a countdown, and a plan.

### Why AI-Powered Analysis?

Heuristic rules can't understand "I'm going to blank out tomorrow." Claude can detect the panic, identify triggers, and suggest the right intervention.

### Why Mode-Dependent Behavior?

Time-constrained students abandon apps that make them wait. Quick mode auto-advances. Calm mode never rushes. Same questions, different experiences.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- Built with [Tambo AI](https://tambo.co)
- Real JEE questions from public past papers

---

**Built for the Tambo "UI Strikes Back" Hackathon**
