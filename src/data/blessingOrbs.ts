export interface BlessingOrbData {
  id: string;
  theme: 'peace' | 'strength' | 'grace' | 'joy' | 'rest' | 'hope' | 'love' | 'light';
  title: string;
  blessing: string;
  scripture: string;
  verseRef: string;
  gradient: {
    from: string;
    to: string;
    glow: string;
    border: string;
    text: string;
  };
  symbol: 'dove' | 'star' | 'heart' | 'sun' | 'sparkle' | 'leaf' | 'cross' | 'candle';
}

export const ORB_COLLECTIONS: Record<string, { label: string; icon: string; description: string }> = {
  daily: {
    label: "Today's Sacred Rotation",
    icon: '✨',
    description: 'Fresh divine inspirations tailored specifically for today'
  },
  peace: {
    label: 'Peace & Still Waters',
    icon: '🕊️',
    description: 'Calming assurances to dissolve anxiety and still your thoughts'
  },
  strength: {
    label: 'Courage & Endurance',
    icon: '🛡️',
    description: 'Empowering promises when the road feels steep or weary'
  },
  joy: {
    label: 'Praise & Heavenly Joy',
    icon: '☀️',
    description: 'Radiant reminders of gratitude, wonder, and celebration'
  },
  rest: {
    label: 'Sabbath Rest & Comfort',
    icon: '🌿',
    description: 'Gentle permission to lay your burdens down and rest in God'
  }
};

export const ALL_BLESSING_ORBS: BlessingOrbData[] = [
  // Peace & Calm
  {
    id: 'orb-peace-1',
    theme: 'peace',
    title: 'Sanctuary of Calm',
    blessing: 'You do not have to carry the whole world today. Exhale and receive the quiet peace of Christ.',
    scripture: '“Peace I leave with you; my peace I give you. I do not give to you as the world gives.”',
    verseRef: 'John 14:27',
    gradient: {
      from: '#0D9488',
      to: '#14B8A6',
      glow: 'rgba(20, 184, 166, 0.45)',
      border: 'rgba(94, 234, 212, 0.6)',
      text: '#CCFBF1'
    },
    symbol: 'dove'
  },
  {
    id: 'orb-peace-2',
    theme: 'peace',
    title: 'Still Waters',
    blessing: 'He leads you beside tranquil streams where your soul can drink deeply and recover its serenity.',
    scripture: '“He leads me beside the still waters. He restores my soul.”',
    verseRef: 'Psalm 23:2-3',
    gradient: {
      from: '#0284C7',
      to: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.45)',
      border: 'rgba(125, 211, 252, 0.6)',
      text: '#E0F2FE'
    },
    symbol: 'sparkle'
  },
  {
    id: 'orb-peace-3',
    theme: 'peace',
    title: 'Guard of the Heart',
    blessing: 'The peace of God, transcending all human logic, stands like an angelic guard over your heart.',
    scripture: '“And the peace of God, which surpasses all understanding, will guard your hearts and minds.”',
    verseRef: 'Philippians 4:7',
    gradient: {
      from: '#059669',
      to: '#34D399',
      glow: 'rgba(52, 211, 153, 0.45)',
      border: 'rgba(167, 243, 208, 0.6)',
      text: '#D1FAE5'
    },
    symbol: 'leaf'
  },

  // Strength & Courage
  {
    id: 'orb-strength-1',
    theme: 'strength',
    title: 'Eagle’s Wings',
    blessing: 'When your energy feels exhausted, divine power is already preparing you to soar above the turbulence.',
    scripture: '“Those who hope in the Lord will renew their strength. They will soar on wings like eagles.”',
    verseRef: 'Isaiah 40:31',
    gradient: {
      from: '#D97706',
      to: '#FBBF24',
      glow: 'rgba(251, 191, 36, 0.5)',
      border: 'rgba(253, 230, 138, 0.7)',
      text: '#FEF3C7'
    },
    symbol: 'cross'
  },
  {
    id: 'orb-strength-2',
    theme: 'strength',
    title: 'Never Forsaken',
    blessing: 'Step boldly into the unknown today; the Almighty goes before you and covers your retreat.',
    scripture: '“Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you.”',
    verseRef: 'Joshua 1:9',
    gradient: {
      from: '#EA580C',
      to: '#FB923C',
      glow: 'rgba(251, 146, 60, 0.45)',
      border: 'rgba(254, 215, 170, 0.65)',
      text: '#FFEDD5'
    },
    symbol: 'sun'
  },
  {
    id: 'orb-strength-3',
    theme: 'strength',
    title: 'Power in Weakness',
    blessing: 'Your weakness is not a defect; it is the sacred canvas where God’s great strength is unveiled.',
    scripture: '“My grace is sufficient for you, for my power is made perfect in weakness.”',
    verseRef: '2 Corinthians 12:9',
    gradient: {
      from: '#B45309',
      to: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.45)',
      border: 'rgba(252, 211, 77, 0.65)',
      text: '#FEF3C7'
    },
    symbol: 'star'
  },

  // Grace & Unmerited Mercy
  {
    id: 'orb-grace-1',
    theme: 'grace',
    title: 'Morning Mercies',
    blessing: 'Yesterday’s mistakes are wiped clean. Today begins with an ocean of unblemished morning mercy.',
    scripture: '“The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning.”',
    verseRef: 'Lamentations 3:22-23',
    gradient: {
      from: '#BE185D',
      to: '#F472B6',
      glow: 'rgba(244, 114, 182, 0.45)',
      border: 'rgba(251, 207, 232, 0.65)',
      text: '#FCE7F3'
    },
    symbol: 'heart'
  },
  {
    id: 'orb-grace-2',
    theme: 'grace',
    title: 'Lavishly Beloved',
    blessing: 'You do not need to earn divine love. You are already God’s cherished masterpiece.',
    scripture: '“See what great love the Father has lavished on us, that we should be called children of God!”',
    verseRef: '1 John 3:1',
    gradient: {
      from: '#9333EA',
      to: '#C084FC',
      glow: 'rgba(192, 132, 252, 0.45)',
      border: 'rgba(233, 213, 255, 0.65)',
      text: '#F3E8FF'
    },
    symbol: 'sparkle'
  },
  {
    id: 'orb-grace-3',
    theme: 'grace',
    title: 'Unfailing Kindness',
    blessing: 'Though mountains shake and hills be removed, God’s steadfast covenant of kindness will never leave you.',
    scripture: '“Though the mountains be shaken, my unfailing love for you will not be shaken.”',
    verseRef: 'Isaiah 54:10',
    gradient: {
      from: '#7C3AED',
      to: '#A78BFA',
      glow: 'rgba(167, 139, 250, 0.45)',
      border: 'rgba(221, 214, 254, 0.65)',
      text: '#EDE9FE'
    },
    symbol: 'cross'
  },

  // Joy & Gladness
  {
    id: 'orb-joy-1',
    theme: 'joy',
    title: 'Fountain of Gladness',
    blessing: 'Allow laughter and gratitude to bubble up in your chest. Joy is the serious business of heaven.',
    scripture: '“The joy of the Lord is your strength.”',
    verseRef: 'Nehemiah 8:10',
    gradient: {
      from: '#CA8A04',
      to: '#FACC15',
      glow: 'rgba(250, 204, 21, 0.5)',
      border: 'rgba(254, 240, 138, 0.7)',
      text: '#FEF9C3'
    },
    symbol: 'sun'
  },
  {
    id: 'orb-joy-2',
    theme: 'joy',
    title: 'Morning Dancing',
    blessing: 'Even if the night brought tears, the dawn has arrived carrying dancing shoes for your spirit.',
    scripture: '“Weeping may stay for the night, but rejoicing comes in the morning.”',
    verseRef: 'Psalm 30:5',
    gradient: {
      from: '#E11D48',
      to: '#FB7185',
      glow: 'rgba(251, 113, 133, 0.45)',
      border: 'rgba(254, 205, 211, 0.65)',
      text: '#FFE4E6'
    },
    symbol: 'sparkle'
  },

  // Rest & Restoration
  {
    id: 'orb-rest-1',
    theme: 'rest',
    title: 'The Sacred Pause',
    blessing: 'Rest is not wasted time; it is an act of holy trust that God works even while you sleep.',
    scripture: '“Come to me, all you who are weary and burdened, and I will give you rest.”',
    verseRef: 'Matthew 11:28',
    gradient: {
      from: '#0891B2',
      to: '#22D3EE',
      glow: 'rgba(34, 211, 238, 0.45)',
      border: 'rgba(165, 243, 252, 0.65)',
      text: '#CFFAFE'
    },
    symbol: 'candle'
  },
  {
    id: 'orb-rest-2',
    theme: 'rest',
    title: 'Shadow of the Almighty',
    blessing: 'You dwell in the secret shelter of the Most High. No storm can penetrate this sanctuary.',
    scripture: '“Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.”',
    verseRef: 'Psalm 91:1',
    gradient: {
      from: '#4338CA',
      to: '#818CF8',
      glow: 'rgba(129, 140, 248, 0.45)',
      border: 'rgba(199, 210, 254, 0.65)',
      text: '#E0E7FF'
    },
    symbol: 'dove'
  },

  // Light & Guidance
  {
    id: 'orb-light-1',
    theme: 'light',
    title: 'Lantern for Your Path',
    blessing: 'You only need light for the very next step. Trust the road will open as your feet move forward.',
    scripture: '“Your word is a lamp for my feet, a light on my path.”',
    verseRef: 'Psalm 119:105',
    gradient: {
      from: '#D97706',
      to: '#FCD34D',
      glow: 'rgba(252, 211, 77, 0.55)',
      border: 'rgba(254, 243, 199, 0.75)',
      text: '#FFFBEB'
    },
    symbol: 'candle'
  },
  {
    id: 'orb-light-2',
    theme: 'light',
    title: 'Unquenchable Light',
    blessing: 'The holy light within you cannot be quenched by any circumstance. Shine without hesitation.',
    scripture: '“The light shines in the darkness, and the darkness has not overcome it.”',
    verseRef: 'John 1:5',
    gradient: {
      from: '#F59E0B',
      to: '#FEF08A',
      glow: 'rgba(254, 240, 138, 0.55)',
      border: 'rgba(254, 249, 195, 0.8)',
      text: '#FEFCE8'
    },
    symbol: 'sun'
  },

  // Hope & Future
  {
    id: 'orb-hope-1',
    theme: 'hope',
    title: 'Anchor of the Soul',
    blessing: 'Your hope is not wishful thinking; it is anchored deep in the immovable rock of Christ.',
    scripture: '“We have this hope as an anchor for the soul, firm and secure.”',
    verseRef: 'Hebrews 6:19',
    gradient: {
      from: '#059669',
      to: '#6EE7B7',
      glow: 'rgba(110, 231, 183, 0.45)',
      border: 'rgba(209, 250, 229, 0.7)',
      text: '#ECFDF5'
    },
    symbol: 'cross'
  },
  {
    id: 'orb-hope-2',
    theme: 'hope',
    title: 'Future and a Hope',
    blessing: 'The chapters ahead of you are written by the Author of Grace, filled with peace and purpose.',
    scripture: '“For I know the plans I have for you, declares the Lord, plans for good and not for harm, to give you a future and a hope.”',
    verseRef: 'Jeremiah 29:11',
    gradient: {
      from: '#2563EB',
      to: '#60A5FA',
      glow: 'rgba(96, 165, 250, 0.45)',
      border: 'rgba(191, 219, 254, 0.7)',
      text: '#EFF6FF'
    },
    symbol: 'star'
  },
  {
    id: 'orb-love-1',
    theme: 'love',
    title: 'Infinite Tender Love',
    blessing: 'Nothing in height or depth, past or present, can ever separate you from God’s tender embrace.',
    scripture: '“Neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God.”',
    verseRef: 'Romans 8:39',
    gradient: {
      from: '#DB2777',
      to: '#F472B6',
      glow: 'rgba(244, 114, 182, 0.5)',
      border: 'rgba(251, 207, 232, 0.75)',
      text: '#FDF2F8'
    },
    symbol: 'heart'
  },
  {
    id: 'orb-love-2',
    theme: 'love',
    title: 'Gentle Shepherd',
    blessing: 'He gathers you in His arms and carries you close to His heart, leading you with infinite tenderness.',
    scripture: '“He gathers the lambs in his arms and carries them close to his heart.”',
    verseRef: 'Isaiah 40:11',
    gradient: {
      from: '#C026D3',
      to: '#E879F9',
      glow: 'rgba(232, 121, 249, 0.45)',
      border: 'rgba(245, 208, 254, 0.7)',
      text: '#FAF5FF'
    },
    symbol: 'dove'
  }
];

// Daily Deterministic Orb Selector based on date string (YYYY-MM-DD)
export function getDailyOrbs(dateStr: string, count: number = 8): BlessingOrbData[] {
  // Simple deterministic hash based on date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  const pool = [...ALL_BLESSING_ORBS];
  const selected: BlessingOrbData[] = [];

  for (let i = 0; i < count; i++) {
    const index = (hash + i * 7) % pool.length;
    selected.push(pool[index]);
  }

  return selected;
}
