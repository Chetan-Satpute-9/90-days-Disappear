export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  note?: string;
}

export interface DailyEntry {
  date: string; // ISO string
  habits: Habit[];
  score: number;
  reflection: string[];
  journal?: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  disciplineScore: number; // 0-100
}

export const DEFAULT_HABITS = [
  "No Porn",
  "No Alcohol",
  "3–4 Eggs",
  "3L Water",
  "7 Hours Sleep",
  "10K Steps",
  "300 Pushups",
  "Cold Shower",
  "1000 Words Writing",
  "5 Daily Wins"
];

export const REWARDS = [
  { day: 7, title: "Consistency Starter", icon: "🌱" },
  { day: 30, title: "Disciplined", icon: "⚔️" },
  { day: 60, title: "Unstoppable", icon: "🔥" },
  { day: 90, title: "Reborn", icon: "👑" },
];
