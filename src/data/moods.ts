import { MoodMeta, MoodType } from '../types';

export const MOODS: Record<MoodType, MoodMeta> = {
  peaceful: {
    type: 'peaceful',
    label: 'Peaceful',
    description: 'Resting in the stillness of His presence',
    emoji: '🕊️',
    bgColor: '#EAF5F2', // Soft pastel sage/mint
    lightBg: '#F3F9F7',
    textColor: '#235848',
    accentBorder: '#B8DFD5',
    blessing: 'The peace of God, which surpasses all understanding, guard your heart and mind today.'
  },
  joyful: {
    type: 'joyful',
    label: 'Joyful',
    description: 'Radiant with heavenly light and laughter',
    emoji: '☀️',
    bgColor: '#FEF7E6', // Cheerful pastel buttercup yellow
    lightBg: '#FFFBF0',
    textColor: '#7D5507',
    accentBorder: '#F9DF9C',
    blessing: 'The joy of the Lord is your inexhaustible strength and song!'
  },
  blessed: {
    type: 'blessed',
    label: 'Blessed',
    description: 'Aware of unmerited favor and gentle goodness',
    emoji: '✨',
    bgColor: '#FFF0EA', // Soft warm pastel peach
    lightBg: '#FFF7F4',
    textColor: '#8C4825',
    accentBorder: '#F8CEBC',
    blessing: 'You are richly blessed, tenderly cared for, and deeply cherished.'
  },
  grateful: {
    type: 'grateful',
    label: 'Grateful',
    description: 'Overwhelmed with thanksgiving for small wonders',
    emoji: '🌸',
    bgColor: '#FDF0F5', // Soft pastel blush rose
    lightBg: '#FFF7FB',
    textColor: '#7E2B52',
    accentBorder: '#F6C6DC',
    blessing: 'Give thanks with a joyful heart, for every good and perfect gift comes from above.'
  },
  hopeful: {
    type: 'hopeful',
    label: 'Hopeful',
    description: 'Looking toward the dawn with steady trust',
    emoji: '🌱',
    bgColor: '#EFF7ED', // Pastel spring green
    lightBg: '#F7FCF6',
    textColor: '#2E5E2B',
    accentBorder: '#C1E6BB',
    blessing: 'May the God of hope fill you with all joy and peace as you trust in Him.'
  },
  contemplative: {
    type: 'contemplative',
    label: 'Contemplative',
    description: 'Quietly pondering divine truths and quiet wisdom',
    emoji: '📖',
    bgColor: '#F3EFFC', // Soft pastel lavender
    lightBg: '#FAF7FE',
    textColor: '#51327E',
    accentBorder: '#D8C6FA',
    blessing: 'Be still before the Lord and wait patiently for Him in the quiet of this day.'
  },
  'seeking-rest': {
    type: 'seeking-rest',
    label: 'Seeking Rest',
    description: 'Laying weary burdens down at the altar',
    emoji: '☁️',
    bgColor: '#EEF4FD', // Soft pastel celestial blue
    lightBg: '#F6F9FE',
    textColor: '#204B7E',
    accentBorder: '#C0D8FA',
    blessing: 'Come to Me, all you who are weary and burdened, and I will give you rest.'
  },
  persevering: {
    type: 'persevering',
    label: 'Persevering',
    description: 'Pressing on with quiet, resolute grace',
    emoji: '🏔️',
    bgColor: '#F8F1EB', // Soft pastel sand/clay
    lightBg: '#FCF9F6',
    textColor: '#66452B',
    accentBorder: '#DFC7B3',
    blessing: 'Those who hope in the Lord will renew their strength and mount up on wings like eagles.'
  }
};

export const MOOD_LIST = Object.values(MOODS);
