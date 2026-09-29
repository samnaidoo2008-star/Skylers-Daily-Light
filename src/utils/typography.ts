export type FontFamilyId =
  | 'editorial-serif'
  | 'classic-scripture'
  | 'cormorant-elegance'
  | 'modern-sanctuary'
  | 'handwritten-journal';

export type TextScaleId = 'standard' | 'comfortable' | 'spacious';

export interface TypographyConfig {
  fontId: FontFamilyId;
  scaleId: TextScaleId;
}

export interface FontOption {
  id: FontFamilyId;
  name: string;
  tagline: string;
  sampleText: string;
  displayFont: string;
  serifFont: string;
}

export interface TextScaleOption {
  id: TextScaleId;
  name: string;
  percentage: string;
  scaleValue: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'editorial-serif',
    name: 'Editorial Serif',
    tagline: 'Warm luxury devotion with high-character curves',
    sampleText: 'The Lord is my shepherd, I shall not want.',
    displayFont: "'Fraunces', Georgia, serif",
    serifFont: "'Fraunces', Georgia, serif"
  },
  {
    id: 'classic-scripture',
    name: 'Classic Scripture',
    tagline: 'Liturgical and timeless cathedral style',
    sampleText: 'Thy word is a lamp unto my feet, and a light unto my path.',
    displayFont: "'Playfair Display', Georgia, serif",
    serifFont: "'Playfair Display', Georgia, serif"
  },
  {
    id: 'cormorant-elegance',
    name: 'Cormorant Grace',
    tagline: 'Delicate, poetic, and peaceful antique letterforms',
    sampleText: 'Be still, and know that I am God.',
    displayFont: "'Cormorant Garamond', 'Garamond', Georgia, serif",
    serifFont: "'Cormorant Garamond', 'Garamond', Georgia, serif"
  },
  {
    id: 'modern-sanctuary',
    name: 'Modern Clean',
    tagline: 'Crisp, contemporary, and easily readable everywhere',
    sampleText: 'Every good and perfect gift is from above.',
    displayFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
    serifFont: "'Plus Jakarta Sans', -apple-system, sans-serif"
  },
  {
    id: 'handwritten-journal',
    name: 'Artisan Journal',
    tagline: 'Intimate sketchbook cursive & personal prayer diary',
    sampleText: 'In quietness and in trust shall be your strength.',
    displayFont: "'Caveat', 'Playpen Sans', cursive, serif",
    serifFont: "'Caveat', 'Playpen Sans', cursive, serif"
  }
];

export const SCALE_OPTIONS: TextScaleOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    percentage: '100%',
    scaleValue: '1'
  },
  {
    id: 'comfortable',
    name: 'Comfortable',
    percentage: '110%',
    scaleValue: '1.08'
  },
  {
    id: 'spacious',
    name: 'Large & Relaxed',
    percentage: '122%',
    scaleValue: '1.18'
  }
];

const TYPOGRAPHY_STORAGE_KEY = 'skylers_daily_light_typography';

export function getStoredTypography(): TypographyConfig {
  try {
    const raw = localStorage.getItem(TYPOGRAPHY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.fontId && parsed.scaleId) return parsed;
    }
  } catch {
    // Ignore
  }
  return {
    fontId: 'editorial-serif',
    scaleId: 'standard'
  };
}

export function setStoredTypography(config: TypographyConfig): void {
  try {
    localStorage.setItem(TYPOGRAPHY_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore
  }
}

export function applyTypographyToDocument(config: TypographyConfig): void {
  const fontMeta = FONT_OPTIONS.find(f => f.id === config.fontId) || FONT_OPTIONS[0];
  const scaleMeta = SCALE_OPTIONS.find(s => s.id === config.scaleId) || SCALE_OPTIONS[0];

  const root = document.documentElement;
  root.style.setProperty('--font-serif', fontMeta.serifFont);
  root.style.setProperty('--font-display', fontMeta.displayFont);
  root.style.setProperty('--app-text-scale', scaleMeta.scaleValue);
  root.style.fontSize = `${16 * parseFloat(scaleMeta.scaleValue)}px`;
}
