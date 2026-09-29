export type MoodType =
  | 'peaceful'
  | 'joyful'
  | 'blessed'
  | 'grateful'
  | 'hopeful'
  | 'contemplative'
  | 'seeking-rest'
  | 'persevering';

export type ThemeId = 'morning-light' | 'celestial-grace' | 'rose-garden' | 'sage-sanctuary' | 'golden-dusk';

export interface GoalItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  feelingNote: string;
  achieveGoals: GoalItem[];
  thankfulNotes: string[];
  lookForwardNotes: string;
  scriptureNote?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Affirmation {
  id: string;
  dayOfYear: number;
  title: string;
  affirmation: string;
  scripture: string;
  verseRef: string;
  reflectionPrompt: string;
  theme: 'Peace' | 'Faith' | 'Joy' | 'Strength' | 'Grace' | 'Hope' | 'Gratitude' | 'Love';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'entries' | 'gratitude' | 'goals';
  target: number;
  current: number;
  isUnlocked: boolean;
  icon: string;
  verse: string;
  unlockedAt?: string;
}

export interface MoodMeta {
  type: MoodType;
  label: string;
  description: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  accentBorder: string;
  lightBg: string;
  blessing: string;
}
