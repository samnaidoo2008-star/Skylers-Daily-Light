import React, { useState } from 'react';
import { Affirmation } from '../types';
import { LIGHT_ARTWORKS, LightArtwork } from '../data/assets';
import { Sparkles, Copy, Check, Heart, BookOpen, Volume2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, PenLine } from 'lucide-react';
import { ambientAudio } from '../utils/audioSynthesizer';
import { addDays, formatLongDate, getTodayKey } from '../utils/dateUtils';
import { ArtworkSelectorModal } from './ArtworkSelectorModal';

interface DailyAffirmationCardProps {
  affirmation: Affirmation;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onStartDiary: (promptSnippet?: string) => void;
  hasEntryToday: boolean;
  selectedArtworkId: string;
  onSelectArtwork: (artwork: LightArtwork) => void;
}

export const DailyAffirmationCard: React.FC<DailyAffirmationCardProps> = ({
  affirmation,
  selectedDate,
  onDateChange,
  onStartDiary,
  hasEntryToday,
  selectedArtworkId,
  onSelectArtwork
}) => {
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);

  const formattedDate = formatLongDate(selectedDate);

  const handleCopy = () => {
    const text = `"${affirmation.affirmation}"\n\nScripture: ${affirmation.scripture} (${affirmation.verseRef})\n— Skyler’s Daily Light`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    ambientAudio.playGentleChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrevDay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = addDays(selectedDate, -1);
    onDateChange(prev);
  };

  const handleNextDay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = addDays(selectedDate, 1);
    onDateChange(next);
  };

  const handleToday = (e: React.MouseEvent) => {
    e.preventDefault();
    onDateChange(getTodayKey());
  };

  // Uses persistent selected artwork that stays on her selection
  const currentArtwork = LIGHT_ARTWORKS.find(a => a.id === selectedArtworkId) || LIGHT_ARTWORKS[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Date Navigator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl px-3 sm:px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          {/* Previous Day Arrow Button */}
          <button
            type="button"
            onClick={handlePrevDay}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] active:scale-95 text-[var(--theme-text-primary)] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Previous day"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--theme-text-primary)]" />
          </button>

          {/* Current Date Label */}
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[var(--theme-text-primary)] select-none">
            <CalendarIcon className="w-4 h-4 text-[var(--theme-accent)]" />
            <span className="tracking-tight">{formattedDate}</span>
          </div>

          {/* Next Day Arrow Button */}
          <button
            type="button"
            onClick={handleNextDay}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] active:scale-95 text-[var(--theme-text-primary)] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Next day"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5 text-[var(--theme-text-primary)]" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToday}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer shadow-xs"
          >
            Today
          </button>
          <div className="text-xs text-[var(--theme-text-muted)] hidden sm:flex items-center gap-1.5">
            <span>Theme:</span>
            <span className="font-semibold text-[var(--theme-accent)]">{affirmation.theme}</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--theme-card)] border border-[var(--theme-border)] shadow-xs">
        {/* Top visual artwork banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[var(--theme-card-subtle)]">
          <img
            src={currentArtwork.src}
            alt={currentArtwork.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {/* Gentle cinematic gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Floating actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Open Artwork Gallery Modal */}
            <button
              type="button"
              onClick={() => setIsArtworkModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-[#2C2720] shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              title="Choose from sketches & paintings"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Change Artwork</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-xs cursor-pointer"
              title={isFavorited ? 'Saved to favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#E86161] text-[#E86161]' : 'text-white/80'}`} />
            </button>
          </div>

          {/* Banner bottom title and medium badge */}
          <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-white/90">
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-md flex items-center gap-1">
                {currentArtwork.category === 'sketch' ? <PenLine className="w-3 h-3" /> : null}
                <span>{currentArtwork.category === 'sketch' ? 'Fine Art Sketch' : 'Devotional Painting'}</span>
              </span>
              <span>·</span>
              <span>{currentArtwork.medium}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white font-display">
              {affirmation.title}
            </h1>
          </div>
        </div>

        {/* Affirmation & Scripture Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Affirmation Quote Box */}
          <div className="p-6 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] relative">
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => ambientAudio.playGentleChime()}
                className="w-8 h-8 rounded-full bg-[var(--theme-card)] hover:opacity-90 text-[var(--theme-accent)] border border-[var(--theme-accent-border)] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Play gentle chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[var(--theme-accent)] uppercase block mb-2">
              Spoken In Faith
            </span>
            <p className="text-lg sm:text-xl text-[var(--theme-text-primary)] font-serif leading-relaxed italic pr-8">
              “{affirmation.affirmation}”
            </p>
          </div>

          {/* Scripture Verse Card */}
          <div className="p-6 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-[var(--theme-accent)] uppercase">
                Holy Scripture
              </span>
              <span className="text-xs font-semibold text-[var(--theme-accent)] bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] px-2.5 py-0.5 rounded-full">
                {affirmation.verseRef}
              </span>
            </div>
            <p className="text-base sm:text-lg text-[var(--theme-text-primary)] leading-relaxed font-serif">
              “{affirmation.scripture}”
            </p>
          </div>

          {/* Reflection Question */}
          <div className="p-5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--theme-accent)] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Soul Reflection</span>
            </div>
            <p className="text-sm sm:text-base text-[var(--theme-text-primary)] leading-relaxed">
              {affirmation.reflectionPrompt}
            </p>
          </div>

          {/* Bottom Action Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--theme-border)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--theme-card-subtle)] hover:border-[var(--theme-accent)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Verse & Affirmation</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStartDiary(affirmation.reflectionPrompt)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--theme-accent)] hover:opacity-90 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {hasEntryToday ? 'View / Edit Diary Entry' : 'Write In Today’s Diary'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Selector Modal (includes 8 sketches & 4 paintings) */}
      <ArtworkSelectorModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        selectedArtworkSrc={currentArtwork.src}
        onSelectArtwork={onSelectArtwork}
      />
    </div>
  );
};
