import { DiaryEntry } from '../types';

const STORAGE_KEY_ENTRIES = 'skylers_daily_light_entries';
const STORAGE_KEY_SECURITY = 'skylers_daily_light_security';

interface SecurityConfig {
  hasPin: boolean;
  pinHash: string;
}

// Simple SHA-256 equivalent or salt hash for local PIN protection
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode('skyler_salt_' + pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Seed initial entries if empty for an inspiring first experience
export function getInitialSeedEntries(): DiaryEntry[] {
  const today = new Date();
  const formatDate = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'entry-seed-1',
      date: formatDate(0), // Today
      mood: 'peaceful',
      feelingNote: 'Resting in God’s quiet faithfulness. Feeling a calm peace settle over my morning thoughts.',
      achieveGoals: [
        { id: 'g1', text: 'Spend 15 minutes in quiet morning prayer', done: true },
        { id: 'g2', text: 'Encourage a colleague with a kind note', done: false },
        { id: 'g3', text: 'Take an afternoon walk thanking God for nature', done: false }
      ],
      thankfulNotes: [
        'The gentle morning sunrise through the window',
        'Warm chamomile tea and comforting quietness',
        'A reassuring text message from a dear friend'
      ],
      lookForwardNotes: 'Looking forward to evening fellowship and peaceful rest under His wings.',
      scriptureNote: 'Peace I leave with you; my peace I give to you. - John 14:27',
      coverImage: '/src/assets/images/daily_light_hero_1790594897369.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'entry-seed-2',
      date: formatDate(1), // Yesterday
      mood: 'grateful',
      feelingNote: 'My heart feels full of gratitude for the little provisions that carry me through busy moments.',
      achieveGoals: [
        { id: 'g4', text: 'Read Psalm 23 slowly before working', done: true },
        { id: 'g5', text: 'Prepare dinner with a thankful attitude', done: true }
      ],
      thankfulNotes: [
        'Patience granted during a challenging phone call',
        'Laughter with family around the dinner table',
        'Good health and breath in my lungs'
      ],
      lookForwardNotes: 'A fresh morning with new mercies awaiting tomorrow.',
      coverImage: '/src/assets/images/gratitude_blooms_1790594920758.jpg',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'entry-seed-3',
      date: formatDate(2), // 2 days ago
      mood: 'blessed',
      feelingNote: 'Felt deeply anchored in God’s promise of protection and unconditional love.',
      achieveGoals: [
        { id: 'g6', text: 'Journal thoughts and blessings', done: true },
        { id: 'g7', text: 'Bless a stranger with an unexpected kindness', done: true }
      ],
      thankfulNotes: [
        'Finding calm in the middle of unexpected changes',
        'Warm sunlight after a rainy morning',
        'Music that elevates my spirit'
      ],
      lookForwardNotes: 'Waking up refreshed for another week of grace.',
      coverImage: '/src/assets/images/peaceful_sanctuary_1790594909516.jpg',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'entry-seed-4',
      date: formatDate(4), // 4 days ago
      mood: 'hopeful',
      feelingNote: 'Trusting God with things I cannot control. Faith is holding fast to what He has spoken.',
      achieveGoals: [
        { id: 'g8', text: 'Release anxious thoughts into His care', done: true },
        { id: 'g9', text: 'Listen to inspirational worship melodies', done: true }
      ],
      thankfulNotes: [
        'Clarity after a season of questioning',
        'Fresh autumn breeze and beautiful golden skies'
      ],
      lookForwardNotes: 'Seeing God’s good plans unfold day by day.',
      coverImage: '/src/assets/images/faith_mountain_1790594931568.jpg',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date(Date.now() - 345600000).toISOString()
    }
  ];
}

export function loadEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (!raw) {
      const seeded = getInitialSeedEntries();
      saveEntries(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialSeedEntries();
  } catch {
    return getInitialSeedEntries();
  }
}

export function saveEntries(entries: DiaryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save entries to localStorage', e);
  }
}

export function getEntryForDate(dateStr: string): DiaryEntry | undefined {
  const entries = loadEntries();
  return entries.find(e => e.date === dateStr);
}

export function upsertEntry(entry: DiaryEntry): DiaryEntry[] {
  const entries = loadEntries();
  const index = entries.findIndex(e => e.date === entry.date);

  let updated: DiaryEntry[];
  if (index >= 0) {
    updated = [...entries];
    updated[index] = {
      ...entry,
      updatedAt: new Date().toISOString()
    };
  } else {
    updated = [
      {
        ...entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      ...entries
    ];
  }

  // Sort descending by date
  updated.sort((a, b) => b.date.localeCompare(a.date));
  saveEntries(updated);
  return updated;
}

export function deleteEntry(id: string): DiaryEntry[] {
  const entries = loadEntries();
  const filtered = entries.filter(e => e.id !== id);
  saveEntries(filtered);
  return filtered;
}

// Security Configuration
export function getSecurityConfig(): SecurityConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECURITY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore error
  }
  return { hasPin: false, pinHash: '' };
}

export async function setPasscode(pin: string): Promise<boolean> {
  if (pin.length !== 4) return false;
  const hash = await hashPin(pin);
  const config: SecurityConfig = { hasPin: true, pinHash: hash };
  localStorage.setItem(STORAGE_KEY_SECURITY, JSON.stringify(config));
  return true;
}

export async function checkPasscode(pin: string): Promise<boolean> {
  const config = getSecurityConfig();
  if (!config.hasPin) return true;
  const hash = await hashPin(pin);
  return hash === config.pinHash;
}

export function removePasscode(): void {
  localStorage.removeItem(STORAGE_KEY_SECURITY);
}
