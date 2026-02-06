import { TimeBudget, StressLevel } from "@/types";

/**
 * Time-related patterns
 * Ordered from most specific to least specific
 */
const TIME_PATTERNS = {
  // Exact minutes: "10 minutes", "10 min", "10m"
  exactMinutes: /(\d+)\s*(?:minutes?|mins?|m\b)/i,

  // Exact hours: "1 hour", "2 hours", "1h"
  exactHours: /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h\b)/i,

  // Word-based time: "half an hour", "quarter hour"
  halfHour: /half\s*(?:an?\s*)?hour/i,
  quarterHour: /quarter\s*(?:of\s*an?\s*)?hour/i,

  // Relative terms
  quick: /\b(quick|fast|rapid|brief|short|few minutes|couple minutes|5 min)\b/i,
  medium: /\b(some time|a while|bit of time|30 min|half hour)\b/i,
  long: /\b(long|hour|lots of time|plenty of time|deep|thorough)\b/i,
};

const STRESS_PATTERNS = {
  high: [
    /\b(can'?t do this|giving up|give up|hopeless|impossible|failing|failed)\b/i,
    /\b(hate this|too hard|way too|overwhelmed|drowning|panic|panicking)\b/i,
    /\b(never going to|will never|no hope|lost cause)\b/i,
    /\b(crying|freaking out|breaking down|meltdown)\b/i,
  ],
  medium: [
    /\b(struggling|confused|frustrated|stuck|difficult|hard time)\b/i,
    /\b(don'?t understand|doesn'?t make sense|lost|anxious|worried)\b/i,
    /\b(stressed|stress|nervous|scared|afraid)\b/i,
    /\b(help me|need help|so confused)\b/i,
  ],
  low: [
    /\b(tired|exhausted|bored|sleepy|unmotivated|meh)\b/i,
    /\b(not feeling it|don'?t feel like|low energy)\b/i,
    /\b(blah|ugh|sigh)\b/i,
  ],
};

export function parseTime(input: string): {
  budget: TimeBudget;
  minutes: number | null;
} {
  const normalizedInput = input.toLowerCase().trim();

  const minutesMatch = normalizedInput.match(TIME_PATTERNS.exactMinutes);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1], 10);
    return {
      budget: categorizeDuration(minutes),
      minutes,
    };
  }

  const hoursMatch = normalizedInput.match(TIME_PATTERNS.exactHours);
  if (hoursMatch) {
    const hours = parseFloat(hoursMatch[1]);
    const minutes = Math.round(hours * 60);
    return {
      budget: categorizeDuration(minutes),
      minutes,
    };
  }

  if (TIME_PATTERNS.halfHour.test(normalizedInput)) {
    return { budget: "standard", minutes: 30 };
  }
  if (TIME_PATTERNS.quarterHour.test(normalizedInput)) {
    return { budget: "quick", minutes: 15 };
  }

  if (TIME_PATTERNS.quick.test(normalizedInput)) {
    return { budget: "quick", minutes: null };
  }
  if (TIME_PATTERNS.long.test(normalizedInput)) {
    return { budget: "deep", minutes: null };
  }
  if (TIME_PATTERNS.medium.test(normalizedInput)) {
    return { budget: "standard", minutes: null };
  }

  return { budget: "standard", minutes: null };
}


function categorizeDuration(minutes: number): TimeBudget {
  if (minutes <= 15) return "quick";
  if (minutes <= 45) return "standard";
  return "deep";
}


export function detectStress(input: string): StressLevel {
  const normalizedInput = input.toLowerCase();

  // Check high stress first (most urgent)
  for (const pattern of STRESS_PATTERNS.high) {
    if (pattern.test(normalizedInput)) {
      return "high";
    }
  }

  // Check medium stress
  for (const pattern of STRESS_PATTERNS.medium) {
    if (pattern.test(normalizedInput)) {
      return "medium";
    }
  }

  // Check low stress
  for (const pattern of STRESS_PATTERNS.low) {
    if (pattern.test(normalizedInput)) {
      return "low";
    }
  }

  return "none";
}

export function extractTopicPreferences(input: string): {
  subject: "physics" | "chemistry" | "math" | null;
  topics: string[];
} {
  const normalizedInput = input.toLowerCase();

  let subject: "physics" | "chemistry" | "math" | null = null;

  if (
    /\b(physics|phys|mechanics|waves|optics|thermodynamics|electr)/i.test(
      normalizedInput,
    )
  ) {
    subject = "physics";
  } else if (
    /\b(chemistry|chem|organic|inorganic|reactions|molecules)/i.test(
      normalizedInput,
    )
  ) {
    subject = "chemistry";
  } else if (
    /\b(math|maths|mathematics|calculus|algebra|geometry|trigonometry)/i.test(
      normalizedInput,
    )
  ) {
    subject = "math";
  }

  const topics: string[] = [];


  if (
    /\b(mechanics|motion|force|newton|velocity|acceleration)/i.test(
      normalizedInput,
    )
  ) {
    topics.push("Mechanics");
  }
  if (/\b(waves|sound|light|oscillation)/i.test(normalizedInput)) {
    topics.push("Waves");
  }
  if (/\b(thermo|heat|temperature|entropy)/i.test(normalizedInput)) {
    topics.push("Thermodynamics");
  }
  if (/\b(electr|current|voltage|circuit|magnetic)/i.test(normalizedInput)) {
    topics.push("Electricity");
  }

  if (
    /\b(organic|carbon|hydrocarbon|alcohol|aldehyde)/i.test(normalizedInput)
  ) {
    topics.push("Organic Chemistry");
  }
  if (/\b(inorganic|metal|periodic|element)/i.test(normalizedInput)) {
    topics.push("Inorganic Chemistry");
  }
  if (
    /\b(physical chemistry|equilibrium|kinetics|rate)/i.test(normalizedInput)
  ) {
    topics.push("Physical Chemistry");
  }

  if (
    /\b(calculus|derivative|integral|differentiat|integrat)/i.test(
      normalizedInput,
    )
  ) {
    topics.push("Calculus");
  }
  if (/\b(algebra|equation|polynomial|quadratic)/i.test(normalizedInput)) {
    topics.push("Algebra");
  }
  if (/\b(geometry|triangle|circle|angle|coordinate)/i.test(normalizedInput)) {
    topics.push("Geometry");
  }
  if (/\b(trigonometry|trig|sin|cos|tan)/i.test(normalizedInput)) {
    topics.push("Trigonometry");
  }

  return { subject, topics };
}

export function analyzeUserInput(input: string): {
  time: { budget: TimeBudget; minutes: number | null };
  stress: StressLevel;
  preferences: {
    subject: "physics" | "chemistry" | "math" | null;
    topics: string[];
  };
} {
  return {
    time: parseTime(input),
    stress: detectStress(input),
    preferences: extractTopicPreferences(input),
  };
}
