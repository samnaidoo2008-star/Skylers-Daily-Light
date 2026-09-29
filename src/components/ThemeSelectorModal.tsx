import React, { useState } from 'react';
import { Palette, Check, Sparkles, Moon, Sun, PenLine, Brush, Image as ImageIcon, Trees } from 'lucide-react';
import { THEMES, ThemeId, ThemeDefinition } from '../utils/theme';
import { LIGHT_ARTWORKS, LightArtwork } from '../data/assets';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  selectedArtworkSrc?: string;
  onSelectArtwork?: (artwork: LightArtwork) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  selectedArtworkSrc,
  onSelectArtwork
}) => {
  const [modalTab, setModalTab] = useState<'themes' | 'paintings'>('themes');
  const [filterMode, setFilterMode] = useState<'all' | 'sketch' | 'light' | 'dark'>('all');
  const [artFilter, setArtFilter] = useState<'all' | 'paintings' | 'sketches'>('all');

  if (!isOpen) return null;

  const allThemes = Object.values(THEMES);
  const filteredThemes = allThemes.filter(t => {
    if (filterMode === 'sketch') return t.category === 'sketch';
    if (filterMode === 'light') return t.category === 'light';
    if (filterMode === 'dark') return t.category === 'dark';
    return true;
  });

  const sketchCount = allThemes.filter(t => t.category === 'sketch').length;
  const lightCount = allThemes.filter(t => t.category === 'light').length;
  const darkCount = allThemes.filter(t => t.category === 'dark').length;

  const paintings = LIGHT_ARTWORKS.filter(a => a.category === 'painting');
  const filteredArtworks = LIGHT_ARTWORKS.filter(a => {
    if (artFilter === 'paintings') return a.category === 'painting';
    if (artFilter === 'sketches') return a.category === 'sketch';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[var(--theme-card)] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[var(--theme-border)] text-[var(--theme-text-primary)] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">
                Sanctuary Aesthetics & Gallery
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)]">
                {allThemes.length} color themes, hand-drawn nature sketches, and museum oil paintings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--theme-card-subtle)] text-[var(--theme-text-muted)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close theme selector"
          >
            ✕
          </button>
        </div>

        {/* Master Tab Switcher: Themes vs. Paintings */}
        <div className="flex items-center gap-2 p-1.5 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] rounded-2xl">
          <button
            type="button"
            onClick={() => setModalTab('themes')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              modalTab === 'themes'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs border border-[var(--theme-border)]'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
            <span>Color Palettes ({allThemes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('paintings')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              modalTab === 'paintings'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs border border-[var(--theme-border)]'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Brush className="w-3.5 h-3.5 text-amber-500" />
            <span>Paintings & Sketches ({LIGHT_ARTWORKS.length})</span>
          </button>
        </div>

        {modalTab === 'themes' ? (
          <>
            {/* Filter Category Tabs for Themes */}
            <div className="flex items-center gap-1.5 p-1 bg-[var(--theme-card-subtle)] rounded-xl border border-[var(--theme-border)] max-w-lg overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterMode === 'all'
                    ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                }`}
              >
                All Themes ({allThemes.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('light')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  filterMode === 'light'
                    ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light ({lightCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('dark')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  filterMode === 'dark'
                    ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                }`}
              >
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Dark ({darkCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('sketch')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  filterMode === 'sketch'
                    ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                }`}
              >
                <PenLine className="w-3 h-3 text-[var(--theme-accent)]" />
                <span>Sketches ({sketchCount})</span>
              </button>
            </div>

            {/* Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredThemes.map((theme: ThemeDefinition) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      onSelectTheme(theme.id);
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'ring-2 ring-[var(--theme-accent)] border-[var(--theme-accent)] shadow-md bg-[var(--theme-card-subtle)]'
                        : 'border-[var(--theme-border)] bg-[var(--theme-card)] hover:border-[var(--theme-accent)]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--theme-accent)] text-white flex items-center justify-center text-[10px] shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}

                    {/* Swatches preview bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: theme.swatch.bg }}
                          title="Canvas background"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: theme.swatch.card }}
                          title="Card surface"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: theme.swatch.accent }}
                          title="Theme accent"
                        />
                      </div>

                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          theme.category === 'sketch'
                            ? 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border border-stone-300'
                            : theme.isDark
                            ? 'bg-indigo-950/80 text-indigo-200 border border-indigo-800'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {theme.category === 'sketch' ? (
                          <PenLine className="w-2.5 h-2.5" />
                        ) : theme.isDark ? (
                          <Moon className="w-2.5 h-2.5" />
                        ) : (
                          <Sun className="w-2.5 h-2.5" />
                        )}
                        <span>
                          {theme.category === 'sketch'
                            ? theme.isDark
                              ? 'Dark Sketch'
                              : 'Pencil Sketch'
                            : theme.isDark
                            ? 'Dark Mode'
                            : 'Light Mode'}
                        </span>
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--theme-text-primary)]">{theme.name}</p>
                      <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5 leading-snug line-clamp-2">
                        {theme.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Paintings & Sketches Section */
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 p-1 bg-[var(--theme-card-subtle)] rounded-xl border border-[var(--theme-border)] max-w-sm">
              <button
                type="button"
                onClick={() => setArtFilter('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  artFilter === 'all'
                    ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                }`}
              >
                All ({LIGHT_ARTWORKS.length})
              </button>
              <button
                type="button"
                onClick={() => setArtFilter('paintings')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  artFilter === 'paintings'
                    ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                }`}
              >
                <Brush className="w-3 h-3 text-[var(--theme-accent)]" />
                <span>Paintings ({paintings.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setArtFilter('sketches')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  artFilter === 'sketches'
                    ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                }`}
              >
                <Trees className="w-3 h-3 text-emerald-600" />
                <span>Sketches ({LIGHT_ARTWORKS.length - paintings.length})</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredArtworks.map(art => {
                const isSelected = selectedArtworkSrc === art.src;
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      if (onSelectArtwork) {
                        onSelectArtwork(art);
                      }
                    }}
                    className={`group rounded-2xl overflow-hidden border text-left transition-all cursor-pointer relative flex flex-col ${
                      isSelected
                        ? 'ring-2 ring-[var(--theme-accent)] border-[var(--theme-accent)] shadow-md'
                        : 'border-[var(--theme-border)] bg-[var(--theme-card)] hover:border-[var(--theme-accent)]'
                    }`}
                  >
                    <div className="relative h-28 w-full overflow-hidden bg-[var(--theme-card-subtle)]">
                      <img
                        src={art.src}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">
                        {art.category === 'painting' ? 'Painting' : art.isColorSketch ? 'Color Sketch' : 'Sketch'}
                      </span>
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[var(--theme-accent)] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 bg-[var(--theme-card)]">
                      <p className="text-xs font-bold text-[var(--theme-text-primary)] line-clamp-1">
                        {art.title}
                      </p>
                      <p className="text-[10px] text-[var(--theme-accent)] font-semibold mt-0.5 truncate">
                        {art.theme}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
            <span>All chosen themes, paintings, and sketches stay saved permanently across sessions.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[var(--theme-card)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
