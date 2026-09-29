import React from 'react';
import { Music, Lock, Unlock, Moon, Sun } from 'lucide-react';
import { ThemeId, THEMES } from '../utils/theme';

export type NavTab = 'affirmation' | 'calendar' | 'diary' | 'game' | 'charts' | 'milestones' | 'companion';

interface TopNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isAudioPlaying: boolean;
  onOpenAudio: () => void;
  isLocked: boolean;
  hasPin: boolean;
  onToggleLock: () => void;
  currentTheme: ThemeId;
  onToggleDarkMode: () => void;
  streakCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  isAudioPlaying,
  onOpenAudio,
  isLocked,
  hasPin,
  onToggleLock,
  currentTheme,
  onToggleDarkMode,
  streakCount
}) => {
  const activeThemeMeta = THEMES[currentTheme];

  return (
    <header className="sticky top-0 z-40 bg-[var(--theme-nav-bg)] backdrop-blur-md border-b border-[var(--theme-border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Devotion Streak */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onTabChange('affirmation')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--theme-text-primary)] font-display transition-colors group-hover:text-[var(--theme-accent)]">
              Skyler’s Daily Light
            </span>
          </button>
          {streakCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] text-[var(--theme-accent)] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
              <span>{streakCount} {streakCount === 1 ? 'day devotion' : 'days devotion'}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Clean Core Navigation links on desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--theme-text-muted)]">
          <button
            type="button"
            onClick={() => onTabChange('affirmation')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'affirmation'
                ? 'text-[var(--theme-text-primary)] font-semibold border-b-2 border-[var(--theme-accent)]'
                : 'hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Today’s Light
          </button>

          <button
            type="button"
            onClick={() => onTabChange('calendar')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'calendar'
                ? 'text-[var(--theme-text-primary)] font-semibold border-b-2 border-[var(--theme-accent)]'
                : 'hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Calendar
          </button>

          <button
            type="button"
            onClick={() => onTabChange('diary')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'diary'
                ? 'text-[var(--theme-text-primary)] font-semibold border-b-2 border-[var(--theme-accent)]'
                : 'hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Diary Entry
          </button>

          <button
            type="button"
            onClick={() => onTabChange('game')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'game'
                ? 'text-[var(--theme-text-primary)] font-semibold border-b-2 border-[var(--theme-accent)]'
                : 'hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <span>Light Garden</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('charts')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'charts'
                ? 'text-[var(--theme-text-primary)] font-semibold border-b-2 border-[var(--theme-accent)]'
                : 'hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Moods
          </button>

          <button
            type="button"
            onClick={() => onTabChange('milestones')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'milestones'
                ? 'text-[var(--theme-text-primary)] font-semibold border-b-2 border-[var(--theme-accent)]'
                : 'hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Milestones
          </button>
        </nav>

        {/* Zone 3: Header Actions (Companion, Text & Theme moved to footer/floating controls) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Light / Dark Mode Toggle button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-9 h-9 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title={activeThemeMeta.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={activeThemeMeta.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {activeThemeMeta.isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Audio Soundscape Toggle */}
          <button
            type="button"
            onClick={onOpenAudio}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer shadow-xs ${
              isAudioPlaying
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] border-[var(--theme-accent-border)]'
                : 'bg-[var(--theme-card)] text-[var(--theme-text-muted)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
            }`}
            title="Soothing background music"
          >
            <Music className={`w-3.5 h-3.5 ${isAudioPlaying ? 'animate-spin text-[var(--theme-accent)]' : ''}`} />
            <span className="hidden md:inline">
              {isAudioPlaying ? 'Music On' : 'Music'}
            </span>
          </button>

          {/* PIN Lock Toggle */}
          <button
            type="button"
            onClick={onToggleLock}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer shadow-xs ${
              isLocked
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] border-[var(--theme-accent-border)]'
                : 'bg-[var(--theme-card)] text-[var(--theme-text-muted)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
            }`}
            title={hasPin ? (isLocked ? 'Diary is locked' : 'Diary is unlocked') : 'Set secure PIN'}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{hasPin ? 'Unlocked' : 'PIN'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subnavigation Bar: Only shown on mobile/small viewports (< lg) */}
      <div className="lg:hidden border-t border-[var(--theme-border)] px-3 py-1.5 flex items-center justify-between bg-[var(--theme-nav-bg)] overflow-x-auto gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onTabChange('affirmation')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'affirmation'
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Daily Light
          </button>
          <button
            type="button"
            onClick={() => onTabChange('calendar')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Calendar
          </button>
          <button
            type="button"
            onClick={() => onTabChange('diary')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'diary'
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Diary
          </button>
          <button
            type="button"
            onClick={() => onTabChange('game')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'game'
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Game
          </button>
          <button
            type="button"
            onClick={() => onTabChange('charts')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Moods
          </button>
          <button
            type="button"
            onClick={() => onTabChange('milestones')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'milestones'
                ? 'bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            Milestones
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-[var(--theme-border)]">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] cursor-pointer shadow-xs"
            title="Toggle Dark / Light Mode"
          >
            {activeThemeMeta.isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
