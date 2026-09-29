export type ThemeId =
  | 'morning-light'
  | 'sketchbook-linen'
  | 'sepia-parchment'
  | 'charcoal-slate'
  | 'ancient-parchment'
  | 'graphite-minimal'
  | 'botanical-olive'
  | 'lavender-dusk'
  | 'water-lilies'
  | 'provence-poppy'
  | 'rose-garden'
  | 'celestial-grace'
  | 'sage-sanctuary'
  | 'golden-dusk'
  | 'midnight-sanctuary'
  | 'velvet-rose'
  | 'starry-night'
  | 'emerald-stillness'
  | 'desert-dusk'
  | 'sapphire-vespers'
  | 'monastery-candlelight';

export interface ThemeColors {
  canvas: string;
  card: string;
  cardSubtle: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentSubtle: string;
  accentBorder: string;
  accentText: string;
  navBg: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  isDark: boolean;
  category: 'light' | 'dark' | 'sketch';
  swatch: {
    bg: string;
    card: string;
    accent: string;
    secondary: string;
  };
  colors: ThemeColors;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  // --- 1. Luminous Light Themes ---
  'morning-light': {
    id: 'morning-light',
    name: 'Morning Light',
    tagline: 'Warm Alabaster & Champagne Gold',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#FAF7F2',
      card: '#FFFFFF',
      accent: '#9A7736',
      secondary: '#EAE0D2'
    },
    colors: {
      canvas: '#FAF7F2',
      card: '#FFFFFF',
      cardSubtle: '#F6F1EA',
      border: '#EAE0D2',
      borderSubtle: '#F3EBE1',
      textPrimary: '#2C2621',
      textMuted: '#7C7267',
      accent: '#9A7736',
      accentHover: '#846525',
      accentSubtle: '#FAF4E8',
      accentBorder: '#ECD9B8',
      accentText: '#9A7736',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'botanical-olive': {
    id: 'botanical-olive',
    name: 'Olive Grove Serenity',
    tagline: 'Tuscan Stone & Silvery Olive Leaves',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#F7F8F4',
      card: '#FFFFFF',
      accent: '#5B7348',
      secondary: '#DCE4D4'
    },
    colors: {
      canvas: '#F7F8F4',
      card: '#FFFFFF',
      cardSubtle: '#EFF2EC',
      border: '#DCE4D4',
      borderSubtle: '#E8EFE3',
      textPrimary: '#242C1E',
      textMuted: '#687760',
      accent: '#5B7348',
      accentHover: '#495D39',
      accentSubtle: '#F2F6EF',
      accentBorder: '#C9D8C0',
      accentText: '#5B7348',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'lavender-dusk': {
    id: 'lavender-dusk',
    name: 'Provencal Lavender',
    tagline: 'French Lavender Mist & Golden Honey',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#F8F6FA',
      card: '#FFFFFF',
      accent: '#73568E',
      secondary: '#E6DEF0'
    },
    colors: {
      canvas: '#F8F6FA',
      card: '#FFFFFF',
      cardSubtle: '#F2EDF7',
      border: '#E6DEF0',
      borderSubtle: '#EEE8F6',
      textPrimary: '#2C2038',
      textMuted: '#746485',
      accent: '#73568E',
      accentHover: '#5E4377',
      accentSubtle: '#F6F0FC',
      accentBorder: '#D8C9EA',
      accentText: '#73568E',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'water-lilies': {
    id: 'water-lilies',
    name: 'Giverny Water Lilies',
    tagline: 'Impressionist Pond Azure & Soft Lotus Pink',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#F4F8F7',
      card: '#FFFFFF',
      accent: '#3B8B88',
      secondary: '#D3E6E3'
    },
    colors: {
      canvas: '#F4F8F7',
      card: '#FFFFFF',
      cardSubtle: '#ECF3F2',
      border: '#D3E6E3',
      borderSubtle: '#E2EFEB',
      textPrimary: '#1E2C2B',
      textMuted: '#5C7472',
      accent: '#3B8B88',
      accentHover: '#2E7370',
      accentSubtle: '#EEF7F6',
      accentBorder: '#B8DAD6',
      accentText: '#3B8B88',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'provence-poppy': {
    id: 'provence-poppy',
    name: 'Provencal Poppy Meadow',
    tagline: 'Warm Tuscan Sunlight & Scarlet Wildflower',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#FBF8F3',
      card: '#FFFFFF',
      accent: '#C84630',
      secondary: '#EAD9CE'
    },
    colors: {
      canvas: '#FBF8F3',
      card: '#FFFFFF',
      cardSubtle: '#F6EFE5',
      border: '#EAD9CE',
      borderSubtle: '#F3E7DE',
      textPrimary: '#331F19',
      textMuted: '#7E6157',
      accent: '#C84630',
      accentHover: '#A83522',
      accentSubtle: '#FDF2EE',
      accentBorder: '#F3C4B8',
      accentText: '#C84630',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'rose-garden': {
    id: 'rose-garden',
    name: 'Sharon Rose',
    tagline: 'Soft Blush & Cashmere Petal',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#FAF5F6',
      card: '#FFFFFF',
      accent: '#9B4F67',
      secondary: '#EADBDD'
    },
    colors: {
      canvas: '#FAF5F6',
      card: '#FFFFFF',
      cardSubtle: '#F6ECEE',
      border: '#EADBDD',
      borderSubtle: '#F3E8EA',
      textPrimary: '#301C23',
      textMuted: '#7E646B',
      accent: '#9B4F67',
      accentHover: '#823F54',
      accentSubtle: '#FDF1F4',
      accentBorder: '#F4D0D8',
      accentText: '#9B4F67',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'celestial-grace': {
    id: 'celestial-grace',
    name: 'Celestial Grace',
    tagline: 'Ethereal Periwinkle & Lavender Mist',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#F7F8FC',
      card: '#FFFFFF',
      accent: '#4F61A1',
      secondary: '#DFE3F2'
    },
    colors: {
      canvas: '#F7F8FC',
      card: '#FFFFFF',
      cardSubtle: '#EFF2FB',
      border: '#DFE3F2',
      borderSubtle: '#E8ECF7',
      textPrimary: '#1E2436',
      textMuted: '#656D89',
      accent: '#4F61A1',
      accentHover: '#3E4E8A',
      accentSubtle: '#F1F4FD',
      accentBorder: '#CAD4F5',
      accentText: '#4F61A1',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'sage-sanctuary': {
    id: 'sage-sanctuary',
    name: 'Sage Sanctuary',
    tagline: 'Botanical Eucalyptus & Still Waters',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#F6F9F7',
      card: '#FFFFFF',
      accent: '#396753',
      secondary: '#DCE8E0'
    },
    colors: {
      canvas: '#F6F9F7',
      card: '#FFFFFF',
      cardSubtle: '#EEF5F1',
      border: '#DCE8E0',
      borderSubtle: '#E6EFE9',
      textPrimary: '#1C2C24',
      textMuted: '#5E7367',
      accent: '#396753',
      accentHover: '#2C5242',
      accentSubtle: '#EFF6F2',
      accentBorder: '#C5DECFAF',
      accentText: '#396753',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },
  'golden-dusk': {
    id: 'golden-dusk',
    name: 'Golden Dusk',
    tagline: 'Sunlit Amber & Warm Terracotta',
    isDark: false,
    category: 'light',
    swatch: {
      bg: '#FAF6F1',
      card: '#FFFFFF',
      accent: '#935825',
      secondary: '#E8DAC8'
    },
    colors: {
      canvas: '#FAF6F1',
      card: '#FFFFFF',
      cardSubtle: '#F5ECE1',
      border: '#E8DAC8',
      borderSubtle: '#F0E5D7',
      textPrimary: '#2F2218',
      textMuted: '#7B695A',
      accent: '#935825',
      accentHover: '#7B481C',
      accentSubtle: '#FCF5ED',
      accentBorder: '#F2D7B8',
      accentText: '#935825',
      navBg: 'rgba(255, 255, 255, 0.94)'
    }
  },

  // --- 2. Hand-Drawn Sketch Themes ---
  'sketchbook-linen': {
    id: 'sketchbook-linen',
    name: 'Pencil Sketchbook',
    tagline: 'Graphite Lines on Textured Cream Paper',
    isDark: false,
    category: 'sketch',
    swatch: {
      bg: '#F5F2EB',
      card: '#FDFBF7',
      accent: '#59554F',
      secondary: '#D8D3C8'
    },
    colors: {
      canvas: '#F5F2EB',
      card: '#FDFBF7',
      cardSubtle: '#EFECE3',
      border: '#D5CFBE',
      borderSubtle: '#E2DDCF',
      textPrimary: '#2B2824',
      textMuted: '#6D685E',
      accent: '#5A564F',
      accentHover: '#423F3A',
      accentSubtle: '#EBE7DD',
      accentBorder: '#C9C3B3',
      accentText: '#423F3A',
      navBg: 'rgba(245, 242, 235, 0.96)'
    }
  },
  'ancient-parchment': {
    id: 'ancient-parchment',
    name: 'Illuminated Vellum',
    tagline: 'Historic Gold Leaf & Burnt Umber Ink',
    isDark: false,
    category: 'sketch',
    swatch: {
      bg: '#F5ECE0',
      card: '#FBF6EE',
      accent: '#8C6131',
      secondary: '#DFCDB6'
    },
    colors: {
      canvas: '#F5ECE0',
      card: '#FBF6EE',
      cardSubtle: '#EDE0CE',
      border: '#DFCDB6',
      borderSubtle: '#E9DDD0',
      textPrimary: '#3A281A',
      textMuted: '#7E6753',
      accent: '#8C6131',
      accentHover: '#734E25',
      accentSubtle: '#F6EBDD',
      accentBorder: '#D8C2A7',
      accentText: '#8C6131',
      navBg: 'rgba(245, 236, 224, 0.96)'
    }
  },
  'sepia-parchment': {
    id: 'sepia-parchment',
    name: 'Sepia Ink & Quill',
    tagline: 'Antique Parchment & Walnut Ink Sketch',
    isDark: false,
    category: 'sketch',
    swatch: {
      bg: '#F6EFE3',
      card: '#FCF8F0',
      accent: '#825632',
      secondary: '#E4D5BE'
    },
    colors: {
      canvas: '#F6EFE3',
      card: '#FCF8F0',
      cardSubtle: '#EFE4D2',
      border: '#DECDAF',
      borderSubtle: '#E9DEC9',
      textPrimary: '#382618',
      textMuted: '#7E6652',
      accent: '#825632',
      accentHover: '#684223',
      accentSubtle: '#F4E8D3',
      accentBorder: '#D8C09D',
      accentText: '#825632',
      navBg: 'rgba(246, 239, 227, 0.96)'
    }
  },
  'graphite-minimal': {
    id: 'graphite-minimal',
    name: 'Bristol Drawing',
    tagline: 'Architectural Graphite Lines on Crisp Bristol',
    isDark: false,
    category: 'sketch',
    swatch: {
      bg: '#F7F7F8',
      card: '#FFFFFF',
      accent: '#3E434D',
      secondary: '#D9DDE2'
    },
    colors: {
      canvas: '#F7F7F8',
      card: '#FFFFFF',
      cardSubtle: '#EFEFF1',
      border: '#D9DDE2',
      borderSubtle: '#E5E8EC',
      textPrimary: '#22252A',
      textMuted: '#5F6773',
      accent: '#3E434D',
      accentHover: '#2A2E35',
      accentSubtle: '#ECEEF1',
      accentBorder: '#C8CDD5',
      accentText: '#3E434D',
      navBg: 'rgba(255, 255, 255, 0.96)'
    }
  },
  'charcoal-slate': {
    id: 'charcoal-slate',
    name: 'Charcoal Studio',
    tagline: 'Deep Charcoal Slate & Chalk Highlights',
    isDark: true,
    category: 'sketch',
    swatch: {
      bg: '#181A1D',
      card: '#22252A',
      accent: '#D4CBBF',
      secondary: '#363B43'
    },
    colors: {
      canvas: '#181A1D',
      card: '#22252A',
      cardSubtle: '#2B2F36',
      border: '#3D424D',
      borderSubtle: '#2E323A',
      textPrimary: '#F0ECE4',
      textMuted: '#A2AAB8',
      accent: '#D4CBBF',
      accentHover: '#EBE5DC',
      accentSubtle: '#2B2E35',
      accentBorder: '#525866',
      accentText: '#E6E0D5',
      navBg: 'rgba(24, 26, 29, 0.96)'
    }
  },

  // --- 3. Peaceful Dark Modes ---
  'midnight-sanctuary': {
    id: 'midnight-sanctuary',
    name: 'Midnight Sanctuary',
    tagline: 'Deep Obsidian & Radiant Celestial Gold',
    isDark: true,
    category: 'dark',
    swatch: {
      bg: '#0E1118',
      card: '#161B26',
      accent: '#E4BA65',
      secondary: '#2B3346'
    },
    colors: {
      canvas: '#0E1118',
      card: '#161B26',
      cardSubtle: '#1E2433',
      border: '#2B3346',
      borderSubtle: '#222938',
      textPrimary: '#F3F5FA',
      textMuted: '#9BA4BA',
      accent: '#E4BA65',
      accentHover: '#F0CC82',
      accentSubtle: '#27231B',
      accentBorder: '#5A4822',
      accentText: '#F2CE80',
      navBg: 'rgba(22, 27, 38, 0.94)'
    }
  },
  'sapphire-vespers': {
    id: 'sapphire-vespers',
    name: 'Sapphire Cathedral',
    tagline: 'Stained-Glass Ultramarine & Silver Halo',
    isDark: true,
    category: 'dark',
    swatch: {
      bg: '#0B111E',
      card: '#131E35',
      accent: '#6B93F7',
      secondary: '#23355C'
    },
    colors: {
      canvas: '#0B111E',
      card: '#131E35',
      cardSubtle: '#1A2947',
      border: '#23355C',
      borderSubtle: '#1A2846',
      textPrimary: '#F1F4FD',
      textMuted: '#95A6CC',
      accent: '#6B93F7',
      accentHover: '#8EAEFB',
      accentSubtle: '#182542',
      accentBorder: '#38538E',
      accentText: '#87A8F9',
      navBg: 'rgba(19, 30, 53, 0.94)'
    }
  },
  'monastery-candlelight': {
    id: 'monastery-candlelight',
    name: 'Monastery Candlelight',
    tagline: 'Beeswax Amber Glow & Ancient Abbey Hearth',
    isDark: true,
    category: 'dark',
    swatch: {
      bg: '#16110D',
      card: '#241C16',
      accent: '#F5A842',
      secondary: '#443325'
    },
    colors: {
      canvas: '#16110D',
      card: '#241C16',
      cardSubtle: '#30251E',
      border: '#443325',
      borderSubtle: '#33261C',
      textPrimary: '#FAF5EE',
      textMuted: '#BAA798',
      accent: '#F5A842',
      accentHover: '#FABD6E',
      accentSubtle: '#2E2218',
      accentBorder: '#694827',
      accentText: '#F7B45B',
      navBg: 'rgba(36, 28, 22, 0.94)'
    }
  },
  'velvet-rose': {
    id: 'velvet-rose',
    name: 'Velvet Night Rose',
    tagline: 'Deep Plum Charcoal & Rose Gold',
    isDark: true,
    category: 'dark',
    swatch: {
      bg: '#130D12',
      card: '#1D141C',
      accent: '#F08DA7',
      secondary: '#3D2A39'
    },
    colors: {
      canvas: '#130D12',
      card: '#1D141C',
      cardSubtle: '#291C27',
      border: '#3D2A39',
      borderSubtle: '#2E202B',
      textPrimary: '#FBF2F5',
      textMuted: '#B39DA5',
      accent: '#F08DA7',
      accentHover: '#FAABC0',
      accentSubtle: '#2D1924',
      accentBorder: '#69314C',
      accentText: '#F7A3B9',
      navBg: 'rgba(29, 20, 28, 0.94)'
    }
  },
  'starry-night': {
    id: 'starry-night',
    name: 'Starry Twilight',
    tagline: 'Deep Cobalt & Heavenly Indigo',
    isDark: true,
    category: 'dark',
    swatch: {
      bg: '#0A0F1D',
      card: '#131B2F',
      accent: '#84A3FF',
      secondary: '#273557'
    },
    colors: {
      canvas: '#0A0F1D',
      card: '#131B2F',
      cardSubtle: '#1C2742',
      border: '#273557',
      borderSubtle: '#1D2844',
      textPrimary: '#F2F5FD',
      textMuted: '#9AA7C7',
      accent: '#84A3FF',
      accentHover: '#A5BCFF',
      accentSubtle: '#172346',
      accentBorder: '#354E8A',
      accentText: '#9EBAFF',
      navBg: 'rgba(19, 27, 47, 0.94)'
    }
  },
  'emerald-stillness': {
    id: 'emerald-stillness',
    name: 'Emerald Stillness',
    tagline: 'Deep Forest Pine & Luminous Mint Jade',
    isDark: true,
    category: 'dark',
    swatch: {
      bg: '#0B1410',
      card: '#121F19',
      accent: '#5CE2A4',
      secondary: '#263E32'
    },
    colors: {
      canvas: '#0B1410',
      card: '#121F19',
      cardSubtle: '#1A2C24',
      border: '#263E32',
      borderSubtle: '#1E3128',
      textPrimary: '#F1F7F4',
      textMuted: '#92ADA0',
      accent: '#5CE2A4',
      accentHover: '#7EEDB8',
      accentSubtle: '#122C21',
      accentBorder: '#286348',
      accentText: '#77E9B4',
      navBg: 'rgba(18, 31, 25, 0.94)'
    }
  },
  'desert-dusk': {
    id: 'desert-dusk',
    name: 'Desert Twilight',
    tagline: 'Warm Charcoal & Desert Bronze Glow',
    isDark: true,
    category: 'dark',
    swatch: {
      bg: '#14100E',
      card: '#1F1A17',
      accent: '#EFA167',
      secondary: '#3F3530'
    },
    colors: {
      canvas: '#14100E',
      card: '#1F1A17',
      cardSubtle: '#2B2420',
      border: '#3F3530',
      borderSubtle: '#2E2723',
      textPrimary: '#FBF6F2',
      textMuted: '#B7A69E',
      accent: '#EFA167',
      accentHover: '#F7BA8C',
      accentSubtle: '#2D201A',
      accentBorder: '#613E2C',
      accentText: '#F5B07E',
      navBg: 'rgba(31, 26, 23, 0.94)'
    }
  }
};

const THEME_STORAGE_KEY = 'skylers_daily_light_theme';

export function getStoredTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
    if (saved && THEMES[saved]) return saved;
  } catch {
    // Ignore error
  }
  return 'morning-light';
}

export function setStoredTheme(themeId: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {
    // Ignore error
  }
}

export function applyThemeToDocument(themeId: ThemeId): void {
  const theme = THEMES[themeId] || THEMES['morning-light'];
  const root = document.documentElement;

  root.setAttribute('data-theme', theme.id);
  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set explicit CSS variables on root
  root.style.setProperty('--theme-canvas', theme.colors.canvas);
  root.style.setProperty('--theme-card', theme.colors.card);
  root.style.setProperty('--theme-card-subtle', theme.colors.cardSubtle);
  root.style.setProperty('--theme-border', theme.colors.border);
  root.style.setProperty('--theme-border-subtle', theme.colors.borderSubtle);
  root.style.setProperty('--theme-text-primary', theme.colors.textPrimary);
  root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-accent-hover', theme.colors.accentHover);
  root.style.setProperty('--theme-accent-subtle', theme.colors.accentSubtle);
  root.style.setProperty('--theme-accent-border', theme.colors.accentBorder);
  root.style.setProperty('--theme-accent-text', theme.colors.accentText);
  root.style.setProperty('--theme-nav-bg', theme.colors.navBg);

  if (document.body) {
    document.body.style.backgroundColor = theme.colors.canvas;
    document.body.style.color = theme.colors.textPrimary;
  }
}
