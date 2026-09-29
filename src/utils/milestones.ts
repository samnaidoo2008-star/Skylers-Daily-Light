import { DiaryEntry, Milestone } from '../types';

export interface UserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalGratitudes: number;
  completedGoals: number;
  peacefulCount: number;
  joyfulCount: number;
  mostFrequentMood: string;
}

export function computeStreak(entries: DiaryEntry[]): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 };

  const dates = Array.from(new Set(entries.map(e => e.date))).sort();
  if (dates.length === 0) return { current: 0, longest: 0 };

  // Calculate longest
  let maxStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 3600 * 24);

    if (Math.round(diff) === 1) {
      currentRun++;
      if (currentRun > maxStreak) maxStreak = currentRun;
    } else {
      currentRun = 1;
    }
  }

  // Calculate current streak from today or yesterday
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const hasToday = dates.includes(today);
  const hasYesterday = dates.includes(yesterday);

  let currentStreak = 0;
  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? new Date(today) : new Date(yesterday);
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    current: currentStreak,
    longest: Math.max(maxStreak, currentStreak)
  };
}

export function calculateUserStats(entries: DiaryEntry[]): UserStats {
  const { current, longest } = computeStreak(entries);

  let totalGratitudes = 0;
  let completedGoals = 0;
  let peacefulCount = 0;
  let joyfulCount = 0;
  const moodCounts: Record<string, number> = {};

  entries.forEach(e => {
    totalGratitudes += (e.thankfulNotes || []).length;
    (e.achieveGoals || []).forEach(g => {
      if (g.done) completedGoals++;
    });
    if (e.mood === 'peaceful' || e.mood === 'seeking-rest') peacefulCount++;
    if (e.mood === 'joyful' || e.mood === 'blessed') joyfulCount++;
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  let mostFrequentMood = 'Peaceful';
  let topCount = 0;
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > topCount) {
      topCount = count;
      mostFrequentMood = mood;
    }
  });

  return {
    totalEntries: entries.length,
    currentStreak: current,
    longestStreak: longest,
    totalGratitudes,
    completedGoals,
    peacefulCount,
    joyfulCount,
    mostFrequentMood
  };
}

export function getMilestones(entries: DiaryEntry[]): Milestone[] {
  const stats = calculateUserStats(entries);

  const rawMilestones: Omit<Milestone, 'isUnlocked'>[] = [
    {
      id: 'first-light',
      title: 'First Morning Light',
      description: 'Recorded your very first daily reflection',
      category: 'entries',
      target: 1,
      current: stats.totalEntries,
      icon: '🌅',
      verse: '“Let there be light,” and there was light. - Genesis 1:3'
    },
    {
      id: 'faith-sprout',
      title: 'Seed of Faith',
      description: 'Maintained a 3-day reflection streak',
      category: 'streak',
      target: 3,
      current: stats.currentStreak,
      icon: '🌱',
      verse: 'Faith as small as a mustard seed can move mountains. - Matthew 17:20'
    },
    {
      id: 'golden-dawn',
      title: 'Full Bloom of Grace',
      description: 'Reflected faithfully for 7 consecutive days',
      category: 'streak',
      target: 7,
      current: stats.currentStreak,
      icon: '🌸',
      verse: 'He makes everything beautiful in its time. - Ecclesiastes 3:11'
    },
    {
      id: 'light-bearer',
      title: 'Light Bearer',
      description: 'Reached a remarkable 14-day devotion streak',
      category: 'streak',
      target: 14,
      current: stats.currentStreak,
      icon: '✨',
      verse: 'You are the light of the world. - Matthew 5:14'
    },
    {
      id: 'spring-gratitude',
      title: 'Heart of Thanksgiving',
      description: 'Counted 10 moments of thankfulness',
      category: 'gratitude',
      target: 10,
      current: stats.totalGratitudes,
      icon: '🕊️',
      verse: 'Enter His gates with thanksgiving and His courts with praise. - Psalm 100:4'
    },
    {
      id: 'cup-overflows',
      title: 'My Cup Runneth Over',
      description: 'Recorded 25 blessings and praises',
      category: 'gratitude',
      target: 25,
      current: stats.totalGratitudes,
      icon: '🍯',
      verse: 'You anoint my head with oil; my cup overflows. - Psalm 23:5'
    },
    {
      id: 'faithful-steps',
      title: 'Faithful Intentions',
      description: 'Accomplished 5 daily purposeful prayers or goals',
      category: 'goals',
      target: 5,
      current: stats.completedGoals,
      icon: '👣',
      verse: 'Commit your way to the Lord; trust in Him. - Psalm 37:5'
    },
    {
      id: 'devoted-heart',
      title: 'Sanctuary of Devotion',
      description: 'Completed 10 total reflective journal entries',
      category: 'entries',
      target: 10,
      current: stats.totalEntries,
      icon: '📖',
      verse: 'May the words of my mouth and the meditation of my heart be pleasing. - Psalm 19:14'
    }
  ];

  return rawMilestones.map(m => ({
    ...m,
    isUnlocked: m.current >= m.target
  }));
}
