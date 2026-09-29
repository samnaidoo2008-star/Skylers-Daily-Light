import React, { useState } from 'react';
import { Sparkles, Check, Image as ImageIcon, Brush, Trees, HeartHandshake, Palette } from 'lucide-react';
import { LIGHT_ARTWORKS, LightArtwork } from '../data/assets';

type FilterType = 'all' | 'nature-sketch' | 'faith-sketch' | 'painting';

interface ArtworkSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArtworkSrc: string;
  onSelectArtwork: (artwork: LightArtwork) => void;
}

const NATURE_SKETCH_IDS = [
  'sketch-hummingbird',
  'sketch-waterfall',
  'sketch-sunset-lake',
  'sketch-deer',
  'sketch-birch-path',
  'sketch-lavender-bee',
  'sketch-alpine-wildflowers',
  'sketch-cypress-cliffs',
  'sketch-cherry-blossom',
  'sketch-sunflower',
  'sketch-forest',
  'sketch-lighthouse',
  'sketch-meadow',
  'sketch-eagle'
];

export const ArtworkSelectorModal: React.FC<ArtworkSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedArtworkSrc,
  onSelectArtwork
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  if (!isOpen) return null;

  const filtered = LIGHT_ARTWORKS.filter(art => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'painting') return art.category === 'painting';
    if (activeFilter === 'nature-sketch') {
      return NATURE_SKETCH_IDS.includes(art.id);
    }
    if (activeFilter === 'faith-sketch') {
      return art.category === 'sketch' && !NATURE_SKETCH_IDS.includes(art.id);
    }
    return true;
  });

  const natureCount = LIGHT_ARTWORKS.filter(a => NATURE_SKETCH_IDS.includes(a.id)).length;
  const faithCount = LIGHT_ARTWORKS.filter(a => a.category === 'sketch' && !NATURE_SKETCH_IDS.includes(a.id)).length;
  const paintingCount = LIGHT_ARTWORKS.filter(a => a.category === 'painting').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[var(--theme-card)] text-[var(--theme-text-primary)] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[var(--theme-border)] space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-[var(--theme-text-primary)]">
                Devotional, Nature Sketches & Fine Art Gallery ({LIGHT_ARTWORKS.length} Works)
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Hand-drawn nature color sketches, botanical graphite, and museum impressionist oil paintings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--theme-card-subtle)] text-[var(--theme-text-muted)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close artwork gallery"
          >
            ✕
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] rounded-2xl max-w-2xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            All Works ({LIGHT_ARTWORKS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('nature-sketch')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'nature-sketch'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nature Sketches ({natureCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('faith-sketch')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'faith-sketch'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
            <span>Faith Sketches ({faithCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('painting')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeFilter === 'painting'
                ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Brush className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
            <span>Fine Paintings ({paintingCount})</span>
          </button>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map(art => {
            const isSelected = selectedArtworkSrc === art.src;
            const isNatureSketch = NATURE_SKETCH_IDS.includes(art.id);

            return (
              <button
                key={art.id}
                type="button"
                onClick={() => {
                  onSelectArtwork(art);
                  onClose();
                }}
                className={`group rounded-2xl overflow-hidden border text-left transition-all cursor-pointer relative flex flex-col ${
                  isSelected
                    ? 'ring-2 ring-[var(--theme-accent)] border-[var(--theme-accent)] shadow-md'
                    : 'border-[var(--theme-border)] bg-[var(--theme-card)] hover:border-[var(--theme-accent)] hover:shadow-sm'
                }`}
              >
                {/* Image Thumbnail */}
                <div className="relative h-36 w-full overflow-hidden bg-[var(--theme-card-subtle)]">
                  <img
                    src={art.src}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {art.category === 'painting'
                      ? 'Painting'
                      : art.isColorSketch
                      ? 'Color Sketch'
                      : isNatureSketch
                      ? 'Nature Sketch'
                      : 'Faith Sketch'}
                  </span>

                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--theme-accent)] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between bg-[var(--theme-card)]">
                  <div>
                    <p className="text-xs font-bold text-[var(--theme-text-primary)] line-clamp-1">
                      {art.title}
                    </p>
                    <p className="text-[11px] text-[var(--theme-text-muted)] line-clamp-2 mt-0.5 leading-snug">
                      {art.description}
                    </p>
                  </div>
                  <div className="pt-2 mt-1 border-t border-[var(--theme-border)] flex items-center justify-between text-[10px]">
                    <span className="text-[var(--theme-accent)] font-semibold truncate">
                      {art.theme}
                    </span>
                    <span className="text-[var(--theme-text-muted)] opacity-80 truncate ml-2">
                      {art.medium.split('&')[0]}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3.5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
            <span>Your selected artwork stays locked on your choice permanently across all sessions.</span>
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
