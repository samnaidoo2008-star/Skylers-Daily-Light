import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flower2,
  ArrowRight,
  BookOpen,
  Heart,
  Sun,
  Star,
  Flame,
  Check,
  RotateCcw,
  Compass
} from 'lucide-react';
import { ambientAudio } from '../utils/audioSynthesizer';
import {
  ALL_BLESSING_ORBS,
  ORB_COLLECTIONS,
  BlessingOrbData,
  getDailyOrbs
} from '../data/blessingOrbs';
import { getTodayKey, formatLongDate } from '../utils/dateUtils';

interface WordPuzzle {
  word: string;
  hint: string;
  flower: string;
  flowerColor: string;
  scripture: string;
  reflection: string;
}

const FAITH_WORDS: WordPuzzle[] = [
  {
    word: 'PEACE',
    hint: 'A stillness of heart that passes human understanding',
    flower: 'White Lily of Stillness',
    flowerColor: '#80B996',
    scripture: '“Peace I leave with you; My peace I give you.” — John 14:27',
    reflection: 'Take a long, gentle breath. You do not have to carry everything right now. God’s peace surrounds and guards your mind.'
  },
  {
    word: 'GRACE',
    hint: 'Unmerited kindness and fresh morning mercy',
    flower: 'Blush Rose of Grace',
    flowerColor: '#D47E95',
    scripture: '“My grace is sufficient for you, for my power is made perfect in weakness.” — 2 Corinthians 12:9',
    reflection: 'Release any guilt or perfectionism. You are covered in lavish grace, accepted and cherished unconditionally.'
  },
  {
    word: 'FAITH',
    hint: 'Trusting God with steady confidence even in unseen steps',
    flower: 'Golden Sunflower of Trust',
    flowerColor: '#D99B26',
    scripture: '“Now faith is confidence in what we hope for and assurance about what we do not see.” — Hebrews 11:1',
    reflection: 'Even faith as tiny as a mustard seed moves great mountains. Take the next small, faithful step with confidence.'
  },
  {
    word: 'LIGHT',
    hint: 'The radiant presence that dispels every shadow',
    flower: 'Morning Star Orchid',
    flowerColor: '#E6A838',
    scripture: '“The light shines in the darkness, and the darkness has not overcome it.” — John 1:5',
    reflection: 'No cloud is dense enough to quench the divine light inside your soul. You are illuminating the world around you.'
  },
  {
    word: 'SHINE',
    hint: 'Reflecting the gentle warmth of heaven to those you meet',
    flower: 'Luminous Peony',
    flowerColor: '#E59168',
    scripture: '“Let your light shine before others, that they may see your good deeds and glorify your Father.” — Matthew 5:16',
    reflection: 'Your quiet kindness and warm smile are answers to someone’s unspoken prayer today. Keep shining.'
  },
  {
    word: 'HOPE',
    hint: 'An anchor for the soul, firm and secure',
    flower: 'Lavender Blossom of Promise',
    flowerColor: '#8B70BF',
    scripture: '“Those who hope in the Lord will renew their strength.” — Isaiah 40:31',
    reflection: 'Better days, unexpected blessings, and restored joy are already in motion. Keep your heart pointed toward the dawn.'
  },
  {
    word: 'COURAGE',
    hint: 'Stepping forward boldly because God walks with you',
    flower: 'Desert Cedar Bloom',
    flowerColor: '#4F8A72',
    scripture: '“Be strong and courageous. Do not be afraid; do not be discouraged.” — Joshua 1:9',
    reflection: 'You are so much stronger and more resilient than you feel right now. The Creator of the universe is by your side.'
  },
  {
    word: 'JOY',
    hint: 'A bubbling wellspring of happiness grounded in love',
    flower: 'Buttercup of Gladness',
    flowerColor: '#EBB438',
    scripture: '“The joy of the Lord is your strength.” — Nehemiah 8:10',
    reflection: 'Find joy in the little miracles today—a warm cup of tea, the breeze, birdsong, and the simple gift of life.'
  }
];

interface FloatingOrbItem {
  id: string;
  data: BlessingOrbData;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number;
  duration: number; // seconds for gentle float
  delay: number; // seconds offset
  driftType: 1 | 2 | 3 | 4;
}

interface UpliftingGameProps {
  onSendToDiary?: (text: string) => void;
}

export const UpliftingGame: React.FC<UpliftingGameProps> = ({ onSendToDiary }) => {
  const [activeMode, setActiveMode] = useState<'catcher' | 'puzzle'>('catcher');

  // Word puzzle state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isWordSolved, setIsWordSolved] = useState(false);
  const [bloomedFlowers, setBloomedFlowers] = useState<string[]>([
    'White Lily of Stillness',
    'Golden Sunflower of Trust'
  ]);
  const [soulSunshine, setSoulSunshine] = useState(45);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Orbs state
  const todayKey = getTodayKey();
  const [selectedCollection, setSelectedCollection] = useState<string>('daily');
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrbItem[]>([]);
  const [selectedOrb, setSelectedOrb] = useState<BlessingOrbData | null>(null);
  const [copiedOrbPrompt, setCopiedOrbPrompt] = useState(false);
  const [orbsCaughtCount, setOrbsCaughtCount] = useState(0);

  const currentPuzzle = FAITH_WORDS[currentWordIndex % FAITH_WORDS.length];

  // Initialize orbs whenever collection or date changes
  useEffect(() => {
    let pool: BlessingOrbData[] = [];
    if (selectedCollection === 'daily') {
      pool = getDailyOrbs(todayKey, 9);
    } else {
      pool = ALL_BLESSING_ORBS.filter(o => o.theme === selectedCollection);
      if (pool.length < 8) {
        pool = [...pool, ...ALL_BLESSING_ORBS].slice(0, 9);
      }
    }

    // Assign organic non-overlapping starting coordinates & float timings
    const positions = [
      { x: 12, y: 22, size: 68 },
      { x: 38, y: 16, size: 74 },
      { x: 65, y: 24, size: 70 },
      { x: 86, y: 20, size: 66 },
      { x: 22, y: 52, size: 76 },
      { x: 50, y: 46, size: 82 },
      { x: 78, y: 56, size: 72 },
      { x: 34, y: 78, size: 68 },
      { x: 68, y: 80, size: 70 }
    ];

    const items: FloatingOrbItem[] = pool.slice(0, 9).map((data, idx) => {
      const pos = positions[idx] || { x: 50, y: 50, size: 70 };
      return {
        id: `${data.id}-${idx}`,
        data,
        x: pos.x,
        y: pos.y,
        size: pos.size,
        duration: 16 + (idx % 5) * 3, // 16s to 28s slow floating cycle
        delay: -(idx * 2.3),
        driftType: ((idx % 4) + 1) as 1 | 2 | 3 | 4
      };
    });

    setFloatingOrbs(items);
    if (!selectedOrb && items.length > 0) {
      setSelectedOrb(items[0].data);
    }
  }, [selectedCollection, todayKey]);

  useEffect(() => {
    const letters = currentPuzzle.word.split('');
    let shuffled = [...letters].sort(() => Math.random() - 0.5);
    if (shuffled.join('') === currentPuzzle.word && letters.length > 2) {
      shuffled = [...letters].reverse();
    }
    setScrambledLetters(shuffled);
    setSelectedIndices([]);
    setIsWordSolved(false);
  }, [currentWordIndex]);

  const handleLetterClick = (idx: number) => {
    if (isWordSolved) return;
    if (selectedIndices.includes(idx)) {
      const at = selectedIndices.indexOf(idx);
      setSelectedIndices(selectedIndices.slice(0, at));
      return;
    }

    const nextSelected = [...selectedIndices, idx];
    setSelectedIndices(nextSelected);

    const currentSpelled = nextSelected.map(i => scrambledLetters[i]).join('');
    if (currentSpelled === currentPuzzle.word) {
      setIsWordSolved(true);
      ambientAudio.playGentleChime();
      setSoulSunshine(prev => Math.min(100, prev + 15));
      if (!bloomedFlowers.includes(currentPuzzle.flower)) {
        setBloomedFlowers(prev => [...prev, currentPuzzle.flower]);
      }
    }
  };

  const handleResetCurrentWord = () => {
    setSelectedIndices([]);
  };

  const handleNextWord = () => {
    setCurrentWordIndex(prev => prev + 1);
  };

  const handleSelectOrb = (orbData: BlessingOrbData) => {
    setSelectedOrb(orbData);
    setOrbsCaughtCount(prev => prev + 1);
    ambientAudio.playGentleChime();
  };

  const handleSendOrbToDiary = () => {
    if (!selectedOrb || !onSendToDiary) return;
    const text = `--- 🕊️ Sanctuary Blessing of ${selectedOrb.title} ---\n“${selectedOrb.blessing}”\nScripture: ${selectedOrb.scripture} (${selectedOrb.verseRef})\n`;
    onSendToDiary(text);
    setCopiedOrbPrompt(true);
    setTimeout(() => setCopiedOrbPrompt(false), 2500);
  };

  // Render symbol icon inside orb
  const renderOrbSymbol = (symbol: BlessingOrbData['symbol']) => {
    switch (symbol) {
      case 'dove':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C9.5 2 7.2 3.1 5.6 4.9L3.5 2.8 2 4.2l3.4 3.4C4.5 9 4 10.4 4 12c0 4.4 3.6 8 8 8s8-3.6 8-8c0-2.3-.9-4.3-2.4-5.8L21 2.8 19.5 1.4l-2.1 2.1C15.8 2.6 13.9 2 12 2zm0 3c1.4 0 2.8.5 3.9 1.4L12 10.3 8.1 6.4C9.2 5.5 10.6 5 12 5z" />
          </svg>
        );
      case 'cross':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
          </svg>
        );
      case 'sun':
        return <Sun className="w-6 h-6 text-white drop-shadow-md" />;
      case 'heart':
        return <Heart className="w-6 h-6 text-white drop-shadow-md fill-white/80" />;
      case 'star':
        return <Star className="w-6 h-6 text-white drop-shadow-md fill-white/80" />;
      case 'candle':
        return <Flame className="w-6 h-6 text-white drop-shadow-md" />;
      case 'sparkle':
      default:
        return <Sparkles className="w-6 h-6 text-white drop-shadow-md" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Dynamic Keyframe Styles for Organic Slow Floating */}
      <style>{`
        @keyframes slowDrift1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(14px, -18px) scale(1.04); }
          66% { transform: translate(-12px, 12px) scale(0.98); }
        }
        @keyframes slowDrift2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-18px, 14px) scale(0.97); }
          66% { transform: translate(16px, -12px) scale(1.03); }
        }
        @keyframes slowDrift3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(15px, 18px) scale(1.05); }
        }
        @keyframes slowDrift4 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-14px, -16px) scale(0.96); }
        }
        .orb-float-1 { animation: slowDrift1 var(--duration, 20s) ease-in-out infinite var(--delay, 0s); }
        .orb-float-2 { animation: slowDrift2 var(--duration, 24s) ease-in-out infinite var(--delay, 0s); }
        .orb-float-3 { animation: slowDrift3 var(--duration, 22s) ease-in-out infinite var(--delay, 0s); }
        .orb-float-4 { animation: slowDrift4 var(--duration, 26s) ease-in-out infinite var(--delay, 0s); }
      `}</style>

      {/* Sanctuary Garden Header */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-muted)] uppercase tracking-wider">
            <span>Spiritual Sanctuary</span>
            <span>·</span>
            <span className="text-[var(--theme-accent)]">Rest & Reflection Games</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--theme-text-primary)] mt-1">
            Faith Sanctuary Garden
          </h1>
          <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
            Calm your thoughts with floating blessings of grace and bloomed devotionals.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveMode('catcher')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'catcher'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs border border-[var(--theme-border)]'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Blessing Orbs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('puzzle')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'puzzle'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs border border-[var(--theme-border)]'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
            <span>Word of Grace</span>
          </button>
        </div>
      </div>

      {/* MODE 1: REDESIGNED FLOATING ORBS OF GRACE */}
      {activeMode === 'catcher' && (
        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          {/* Top Bar with Collection Selector & Daily Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                  Sanctuary Blessing Catcher
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                  Daily Rotation: {formatLongDate(todayKey)}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[var(--theme-text-primary)] mt-1">
                Luminous Orbs of Daily Grace
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                Each radiant orb drifts slowly with a scripture and peace whisper for today.
              </p>
            </div>

            {/* Orb Theme Selection Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] rounded-2xl">
              {Object.entries(ORB_COLLECTIONS).map(([key, col]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCollection(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCollection === key
                      ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs border border-[var(--theme-border)]'
                      : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                  }`}
                  title={col.description}
                >
                  <span>{col.icon}</span>
                  <span className="hidden sm:inline">{col.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deep Floating Sanctuary Canvas */}
          <div className="relative h-80 sm:h-96 rounded-3xl bg-radial from-slate-900 via-[#131b26] to-[#0b1016] border border-slate-800 overflow-hidden shadow-inner p-4 select-none">
            {/* Ambient Background Starfield & Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-teal-500/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Slow Floating Orbs */}
            {floatingOrbs.map(orb => {
              const isCurrent = selectedOrb?.id === orb.data.id;
              return (
                <div
                  key={orb.id}
                  style={
                    {
                      left: `${orb.x}%`,
                      top: `${orb.y}%`,
                      '--duration': `${orb.duration}s`,
                      '--delay': `${orb.delay}s`
                    } as React.CSSProperties
                  }
                  className={`absolute -translate-x-1/2 -translate-y-1/2 orb-float-${orb.driftType}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectOrb(orb.data)}
                    style={{
                      width: `${orb.size}px`,
                      height: `${orb.size}px`,
                      background: `radial-gradient(circle at 35% 35%, ${orb.data.gradient.to}, ${orb.data.gradient.from})`,
                      boxShadow: isCurrent
                        ? `0 0 35px 8px ${orb.data.gradient.glow}, inset 0 2px 8px rgba(255,255,255,0.7)`
                        : `0 0 22px 3px ${orb.data.gradient.glow}, inset 0 2px 6px rgba(255,255,255,0.5)`,
                      borderColor: isCurrent ? '#FFFFFF' : orb.data.gradient.border
                    }}
                    className={`relative rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer group active:scale-95 ${
                      isCurrent
                        ? 'ring-4 ring-white/60 scale-110 z-20'
                        : 'hover:scale-120 hover:z-10 opacity-95 hover:opacity-100'
                    }`}
                    title={`${orb.data.title} (Tap to unveil)`}
                  >
                    {/* Inner Glass Specular Reflection */}
                    <div className="absolute top-1 left-2.5 right-2.5 h-1/3 rounded-full bg-white/30 blur-[1px] pointer-events-none" />

                    {/* Central Icon */}
                    <div className="relative z-10 transition-transform duration-300 group-hover:scale-115">
                      {renderOrbSymbol(orb.data.symbol)}
                    </div>

                    {/* Subtle Pulsing Halo Ring */}
                    <div
                      style={{ borderColor: orb.data.gradient.border }}
                      className="absolute inset-[-4px] rounded-full border border-dashed opacity-40 animate-spin [animation-duration:18s] pointer-events-none"
                    />
                  </button>
                </div>
              );
            })}

            {/* Instruction Tagline in corner */}
            <div className="absolute top-3 left-4 text-[11px] font-medium text-slate-300/80 pointer-events-none flex items-center gap-1.5 backdrop-blur-md bg-black/30 px-3 py-1 rounded-full border border-white/10">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Tap any glowing orb to reveal its heavenly promise</span>
            </div>

            {/* Stats counter badge */}
            <div className="absolute top-3 right-4 text-[11px] font-medium text-amber-300 backdrop-blur-md bg-black/40 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
              <span>🕊️</span>
              <span>{orbsCaughtCount} Graces Received</span>
            </div>
          </div>

          {/* Revealed Divine Blessing Card */}
          {selectedOrb ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--theme-card-subtle)] border-2 border-[var(--theme-accent-border)] shadow-md space-y-4 animate-in fade-in duration-300 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${selectedOrb.gradient.from}, ${selectedOrb.gradient.to})`,
                      boxShadow: `0 0 16px ${selectedOrb.gradient.glow}`
                    }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white border border-white/30 shrink-0"
                  >
                    {renderOrbSymbol(selectedOrb.symbol)}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                      Spiritual Theme: {selectedOrb.theme.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold font-display text-[var(--theme-text-primary)]">
                      {selectedOrb.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--theme-card)] border border-[var(--theme-border)] text-[var(--theme-text-muted)]">
                  Sacred Scripture Anchor
                </span>
              </div>

              {/* Blessing Text */}
              <div className="p-5 rounded-2xl bg-[var(--theme-card)] border border-[var(--theme-border)] shadow-xs space-y-2">
                <p className="text-base sm:text-lg font-serif italic leading-relaxed text-[var(--theme-text-primary)]">
                  “{selectedOrb.blessing}”
                </p>
                <div className="pt-2 border-t border-[var(--theme-border)] flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-serif text-[var(--theme-text-primary)]">
                    {selectedOrb.scripture}
                  </p>
                  <span className="text-xs font-bold text-[var(--theme-accent)]">
                    — {selectedOrb.verseRef}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs text-[var(--theme-text-muted)]">
                  Hold this promise close to your thoughts throughout the day.
                </span>

                {onSendToDiary && (
                  <button
                    type="button"
                    onClick={handleSendOrbToDiary}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[var(--theme-accent)] hover:opacity-90 text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    {copiedOrbPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added to Today's Diary!</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Add This Blessing to Diary</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[var(--theme-text-muted)]">
              Tap any glowing orb in the sanctuary above to unveil its blessing.
            </div>
          )}
        </div>
      )}

      {/* MODE 2: FAITH WORD PUZZLE */}
      {activeMode === 'puzzle' && (
        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                Word of Grace Puzzle
              </span>
              <h2 className="text-xl font-bold font-display text-[var(--theme-text-primary)] mt-0.5">
                Unscramble the Spiritual Seed
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                Hint: {currentPuzzle.hint}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-[var(--theme-text-muted)]">Soul Radiance</span>
              <p className="text-lg font-bold text-amber-500 font-display">
                {soulSunshine}%
              </p>
            </div>
          </div>

          {/* Letter Slots */}
          <div className="flex items-center justify-center gap-2 py-4">
            {currentPuzzle.word.split('').map((_, idx) => {
              const letter = selectedIndices[idx] !== undefined ? scrambledLetters[selectedIndices[idx]] : '';
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-bold font-display transition-all ${
                    isWordSolved
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : letter
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                      : 'border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-[var(--theme-text-muted)] border-dashed'
                  }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          {/* Scrambled Letter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {scrambledLetters.map((char, idx) => {
              const isUsed = selectedIndices.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isUsed || isWordSolved}
                  onClick={() => handleLetterClick(idx)}
                  className={`w-12 h-12 rounded-2xl text-base font-bold transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                    isUsed
                      ? 'opacity-30 border border-transparent bg-transparent cursor-not-allowed'
                      : 'bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] hover:scale-105 active:scale-95'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetCurrentWord}
              disabled={isWordSolved || selectedIndices.length === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] border border-[var(--theme-border)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Letters</span>
            </button>
          </div>

          {/* Solved Celebration Card */}
          {isWordSolved && (
            <div className="p-6 rounded-3xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
                  style={{ backgroundColor: currentPuzzle.flowerColor }}
                >
                  <Flower2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                    Blossomed: {currentPuzzle.flower}
                  </span>
                  <h3 className="text-xl font-bold font-display text-[var(--theme-text-primary)]">
                    {currentPuzzle.word} Awakened
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--theme-card)] border border-[var(--theme-border)] space-y-2">
                <p className="text-sm text-[var(--theme-text-primary)] font-serif leading-relaxed italic">
                  “{currentPuzzle.reflection}”
                </p>
                <p className="text-xs font-semibold text-[var(--theme-accent)]">
                  {currentPuzzle.scripture}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {onSendToDiary && (
                  <button
                    type="button"
                    onClick={() => {
                      onSendToDiary(`${currentPuzzle.word}: ${currentPuzzle.reflection}`);
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--theme-card)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                    <span>{copiedPrompt ? 'Added to Today’s Diary!' : 'Add Insight to Diary'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextWord}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[var(--theme-accent)] hover:opacity-90 shadow-xs transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <span>Bloom Next Flower</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skyler's Bloomed Garden */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] flex items-center justify-center text-[var(--theme-accent)]">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--theme-text-primary)]">
                Skyler’s Bloomed Garden ({bloomedFlowers.length})
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Spiritual blooms cultivated in quiet meditation
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {bloomedFlowers.map((flower, idx) => (
            <div
              key={idx}
              className="p-3 bg-[var(--theme-card-subtle)] rounded-2xl border border-[var(--theme-border)] flex items-center gap-2.5 shadow-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--theme-accent-subtle)] flex items-center justify-center text-xs text-[var(--theme-accent)]">
                🌸
              </div>
              <span className="text-xs font-semibold text-[var(--theme-text-primary)] truncate">
                {flower}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
