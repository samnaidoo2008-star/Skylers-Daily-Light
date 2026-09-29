import React, { useState, useEffect, useMemo } from 'react';
import { DiaryEntry, Milestone } from './types';
import { loadEntries, upsertEntry, deleteEntry, saveEntries, getSecurityConfig } from './utils/storage';
import { getAffirmationForDate } from './data/affirmations';
import { computeStreak, getMilestones } from './utils/milestones';
import { ambientAudio } from './utils/audioSynthesizer';
import { TopNav, NavTab } from './components/TopNav';
import { DailyAffirmationCard } from './components/DailyAffirmationCard';
import { CalendarView } from './components/CalendarView';
import { DiarySection } from './components/DiarySection';
import { UpliftingGame } from './components/UpliftingGame';
import { MoodAndChartsView } from './components/MoodAndChartsView';
import { MilestonesView } from './components/MilestonesView';
import { AudioPlayerWidget } from './components/AudioPlayerWidget';
import { EncouragementModal } from './components/EncouragementModal';
import { PasscodeModal } from './components/PasscodeModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { TypographySelectorModal } from './components/TypographySelectorModal';
import { SanctuaryCompanionChat } from './components/SanctuaryCompanionChat';
import { getStoredTheme, setStoredTheme, applyThemeToDocument, THEMES, ThemeId } from './utils/theme';
import { getStoredTypography, setStoredTypography, applyTypographyToDocument, TypographyConfig } from './utils/typography';
import { LIGHT_ARTWORKS, LightArtwork } from './data/assets';
import { getTodayKey } from './utils/dateUtils';
import { Lock, Music, Palette, Type, MessageCircleHeart } from 'lucide-react';

const ARTWORK_STORAGE_KEY = 'skylers_selected_artwork_id';

function getStoredArtworkId(): string {
  try {
    const saved = localStorage.getItem(ARTWORK_STORAGE_KEY);
    if (saved && LIGHT_ARTWORKS.some(a => a.id === saved)) return saved;
  } catch {
    // Ignore
  }
  return LIGHT_ARTWORKS[0].id;
}

function setStoredArtworkId(id: string): void {
  try {
    localStorage.setItem(ARTWORK_STORAGE_KEY, id);
  } catch {
    // Ignore
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('affirmation');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayKey());
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadEntries());
  const [securityConfig, setSecurityConfig] = useState(() => getSecurityConfig());
  const [isLocked, setIsLocked] = useState<boolean>(() => getSecurityConfig().hasPin);

  // Theme management
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => getStoredTheme());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Typography management
  const [typographyConfig, setTypographyConfig] = useState<TypographyConfig>(() => getStoredTypography());
  const [isTypographyModalOpen, setIsTypographyModalOpen] = useState(false);

  // Persistent Selected Artwork: stays on the chosen one across all interactions
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>(() => getStoredArtworkId());

  // Modals
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isEncouragementModalOpen, setIsEncouragementModalOpen] = useState(false);
  const [lastSavedEntry, setLastSavedEntry] = useState<DiaryEntry | null>(null);
  const [newlyUnlockedMilestones, setNewlyUnlockedMilestones] = useState<Milestone[]>([]);
  const [diaryPromptSnippet, setDiaryPromptSnippet] = useState<string>('');

  // Audio playing indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Apply theme and typography immediately to document root
  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    applyTypographyToDocument(typographyConfig);
  }, [typographyConfig]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAudioPlaying(ambientAudio.getStatus().isPlaying);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const reloadSecurity = () => {
    const config = getSecurityConfig();
    setSecurityConfig(config);
    if (!config.hasPin) {
      setIsLocked(false);
    }
  };

  const handleSelectTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    setStoredTheme(themeId);
    applyThemeToDocument(themeId);
  };

  const handleSelectArtwork = (art: LightArtwork) => {
    setSelectedArtworkId(art.id);
    setStoredArtworkId(art.id);
  };

  const handleChangeTypography = (newConfig: TypographyConfig) => {
    setTypographyConfig(newConfig);
    setStoredTypography(newConfig);
    applyTypographyToDocument(newConfig);
  };

  const handleToggleDarkMode = () => {
    const active = THEMES[currentTheme];
    if (active.isDark) {
      if (currentTheme === 'midnight-sanctuary') handleSelectTheme('morning-light');
      else if (currentTheme === 'charcoal-slate') handleSelectTheme('sketchbook-linen');
      else if (currentTheme === 'velvet-rose') handleSelectTheme('rose-garden');
      else if (currentTheme === 'starry-night') handleSelectTheme('celestial-grace');
      else if (currentTheme === 'emerald-stillness') handleSelectTheme('botanical-olive');
      else if (currentTheme === 'desert-dusk') handleSelectTheme('golden-dusk');
      else if (currentTheme === 'sapphire-vespers') handleSelectTheme('lavender-dusk');
      else if (currentTheme === 'monastery-candlelight') handleSelectTheme('ancient-parchment');
      else handleSelectTheme('morning-light');
    } else {
      if (currentTheme === 'morning-light') handleSelectTheme('midnight-sanctuary');
      else if (currentTheme === 'sketchbook-linen') handleSelectTheme('charcoal-slate');
      else if (currentTheme === 'sepia-parchment') handleSelectTheme('charcoal-slate');
      else if (currentTheme === 'ancient-parchment') handleSelectTheme('monastery-candlelight');
      else if (currentTheme === 'graphite-minimal') handleSelectTheme('charcoal-slate');
      else if (currentTheme === 'botanical-olive') handleSelectTheme('emerald-stillness');
      else if (currentTheme === 'lavender-dusk') handleSelectTheme('sapphire-vespers');
      else if (currentTheme === 'rose-garden') handleSelectTheme('velvet-rose');
      else if (currentTheme === 'celestial-grace') handleSelectTheme('starry-night');
      else if (currentTheme === 'sage-sanctuary') handleSelectTheme('emerald-stillness');
      else if (currentTheme === 'golden-dusk') handleSelectTheme('desert-dusk');
      else handleSelectTheme('midnight-sanctuary');
    }
  };

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const milestones = useMemo(() => getMilestones(entries), [entries]);
  const currentAffirmation = useMemo(() => getAffirmationForDate(selectedDate), [selectedDate]);
  const currentEntry = useMemo(() => entries.find(e => e.date === selectedDate), [entries, selectedDate]);
  const selectedArtwork = useMemo(() => LIGHT_ARTWORKS.find(a => a.id === selectedArtworkId) || LIGHT_ARTWORKS[0], [selectedArtworkId]);

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'diary' && isLocked && securityConfig.hasPin) {
      setIsPasscodeModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDiary = (snippet?: string) => {
    if (isLocked && securityConfig.hasPin) {
      setIsPasscodeModalOpen(true);
      return;
    }
    if (snippet) {
      setDiaryPromptSnippet(snippet);
    }
    setActiveTab('diary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameSendToDiary = (insightText: string) => {
    handleStartDiary(`From Garden of Grace Game: ${insightText}`);
  };

  const handleSaveEntry = (entry: DiaryEntry) => {
    const prevUnlocked = new Set(milestones.filter(m => m.isUnlocked).map(m => m.id));

    const updated = upsertEntry(entry);
    setEntries(updated);
    setLastSavedEntry(entry);

    const newMilestones = getMilestones(updated);
    const freshUnlocked = newMilestones.filter(m => m.isUnlocked && !prevUnlocked.has(m.id));
    setNewlyUnlockedMilestones(freshUnlocked);

    setIsEncouragementModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = deleteEntry(id);
    setEntries(updated);
  };

  const handleImportBackup = (imported: DiaryEntry[]) => {
    saveEntries(imported);
    setEntries(imported);
  };

  const handleToggleLock = () => {
    if (!securityConfig.hasPin) {
      setIsPasscodeModalOpen(true);
    } else if (isLocked) {
      setIsPasscodeModalOpen(true);
    } else {
      setIsLocked(true);
    }
  };

  return (
    <div
      className="min-h-screen bg-[var(--theme-canvas)] text-[var(--theme-text-primary)] flex flex-col font-sans transition-colors duration-300"
    >
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isAudioPlaying={isAudioPlaying}
        onOpenAudio={() => setIsAudioModalOpen(true)}
        isLocked={isLocked}
        hasPin={securityConfig.hasPin}
        onToggleLock={handleToggleLock}
        currentTheme={currentTheme}
        onToggleDarkMode={handleToggleDarkMode}
        streakCount={streak.current}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLocked && securityConfig.hasPin && activeTab === 'diary' ? (
          <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display text-[var(--theme-text-primary)]">
              Diary Locked For Privacy
            </h2>
            <p className="text-xs sm:text-sm text-[var(--theme-text-muted)]">
              Your reflections are protected by your 4-digit PIN. Tap below to unlock.
            </p>
            <button
              type="button"
              onClick={() => setIsPasscodeModalOpen(true)}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[var(--theme-accent)] hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              Enter Passcode
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'affirmation' && (
              <DailyAffirmationCard
                affirmation={currentAffirmation}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onStartDiary={handleStartDiary}
                hasEntryToday={Boolean(currentEntry)}
                selectedArtworkId={selectedArtworkId}
                onSelectArtwork={handleSelectArtwork}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                entries={entries}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onOpenDiary={handleStartDiary}
              />
            )}

            {activeTab === 'diary' && (
              <DiarySection
                date={selectedDate}
                entry={currentEntry}
                onSaveEntry={handleSaveEntry}
                onDeleteEntry={handleDeleteEntry}
                promptSnippet={diaryPromptSnippet}
              />
            )}

            {activeTab === 'companion' && (
              <SanctuaryCompanionChat
                currentDate={selectedDate}
                hasDiaryEntryToday={Boolean(currentEntry)}
                onOpenDiary={() => handleStartDiary()}
              />
            )}

            {activeTab === 'game' && (
              <UpliftingGame
                onSendToDiary={handleGameSendToDiary}
              />
            )}

            {activeTab === 'charts' && (
              <MoodAndChartsView
                entries={entries}
                onSelectDate={d => {
                  setSelectedDate(d);
                  setActiveTab('calendar');
                }}
                onOpenDiary={d => {
                  setSelectedDate(d);
                  handleStartDiary();
                }}
                onDeleteEntry={handleDeleteEntry}
                onImportBackup={handleImportBackup}
              />
            )}

            {activeTab === 'milestones' && (
              <MilestonesView
                milestones={milestones}
                streakCount={streak.current}
                totalEntries={entries.length}
              />
            )}
          </>
        )}
      </main>

      {/* Devotional Footer */}
      <footer className="border-t border-[var(--theme-border)] bg-[var(--theme-card)]/40 py-8 px-4 text-center text-xs text-[var(--theme-text-muted)] space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>Skyler’s Daily Light</span>
          <span aria-hidden="true">·</span>
          <span>Walking in Faith, Hope & Love</span>
        </div>
        <p className="text-[11px] opacity-80">
          All reflections, chosen sketches, and game milestones are securely kept on your device.
        </p>
      </footer>

      {/* Floating Sanctuary Controls (Companion, Theme, Text & Soundscape) - Always accessible in full screen! */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
        {/* Floating Quick Companion button */}
        <button
          type="button"
          onClick={() => handleTabChange('companion')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full border shadow-xl transition-all text-xs font-semibold backdrop-blur-md cursor-pointer ${
            activeTab === 'companion'
              ? 'bg-[var(--theme-accent)] text-white border-[var(--theme-accent)]'
              : 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
          }`}
          title="Talk with Grace (Daily Inspirational Companion)"
        >
          <MessageCircleHeart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Grace</span>
        </button>

        {/* Floating Quick Text button */}
        <button
          type="button"
          onClick={() => setIsTypographyModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[var(--theme-card)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] shadow-xl hover:border-[var(--theme-accent)] transition-all text-xs font-semibold backdrop-blur-md cursor-pointer"
          title="Change Text & Font Everywhere"
        >
          <Type className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span className="hidden sm:inline">Text</span>
        </button>

        {/* Floating Quick Theme & Sketches button */}
        <button
          type="button"
          onClick={() => setIsThemeModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[var(--theme-card)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] shadow-xl hover:border-[var(--theme-accent)] transition-all text-xs font-semibold backdrop-blur-md cursor-pointer"
          title="Change Theme & Sketches"
        >
          <Palette className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span className="hidden sm:inline">Theme</span>
        </button>

        {/* Floating Audio Controller Trigger */}
        <button
          type="button"
          onClick={() => setIsAudioModalOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--theme-card)] text-[var(--theme-text-primary)] border shadow-xl hover:border-[var(--theme-accent)] transition-all text-xs font-semibold backdrop-blur-md cursor-pointer ${
            isAudioPlaying ? 'border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]' : 'border-[var(--theme-border)]'
          }`}
          title="Open Sanctuary Soundscape Player"
        >
          <Music className={`w-3.5 h-3.5 ${isAudioPlaying ? 'animate-spin text-[var(--theme-accent)]' : 'text-[var(--theme-text-muted)]'}`} />
          <span className="hidden sm:inline">{isAudioPlaying ? 'Music Playing' : 'Music'}</span>
        </button>
      </div>

      {/* Audio Modal (8 Soundscapes) */}
      <AudioPlayerWidget
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />

      {/* Theme Selector Modal (Includes color palettes and museum paintings/sketches) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        selectedArtworkSrc={selectedArtwork.src}
        onSelectArtwork={handleSelectArtwork}
      />

      {/* Typography Selector Modal */}
      <TypographySelectorModal
        isOpen={isTypographyModalOpen}
        onClose={() => setIsTypographyModalOpen(false)}
        config={typographyConfig}
        onChangeConfig={handleChangeTypography}
      />

      {/* Encouragement Pop-up Modal */}
      {lastSavedEntry && (
        <EncouragementModal
          isOpen={isEncouragementModalOpen}
          onClose={() => setIsEncouragementModalOpen(false)}
          entry={lastSavedEntry}
          newMilestones={newlyUnlockedMilestones}
          streakCount={streak.current}
        />
      )}

      {/* Passcode Security Modal */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        hasPin={securityConfig.hasPin}
        isLocked={isLocked}
        onUnlockSuccess={() => setIsLocked(false)}
        onPinConfigChanged={reloadSecurity}
      />
    </div>
  );
}
