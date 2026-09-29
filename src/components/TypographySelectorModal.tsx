import React from 'react';
import { Type, Check, Sparkles, ZoomIn } from 'lucide-react';
import {
  FONT_OPTIONS,
  SCALE_OPTIONS,
  TypographyConfig,
  FontFamilyId,
  TextScaleId
} from '../utils/typography';

interface TypographySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TypographyConfig;
  onChangeConfig: (newConfig: TypographyConfig) => void;
}

export const TypographySelectorModal: React.FC<TypographySelectorModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig
}) => {
  if (!isOpen) return null;

  const handleSelectFont = (fontId: FontFamilyId) => {
    onChangeConfig({
      ...config,
      fontId
    });
  };

  const handleSelectScale = (scaleId: TextScaleId) => {
    onChangeConfig({
      ...config,
      scaleId
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--theme-card)] text-[var(--theme-text-primary)] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[var(--theme-border)] space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-[var(--theme-text-primary)]">
                Text & Typography Settings
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Change fonts and reading size everywhere in the app
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--theme-card-subtle)] text-[var(--theme-text-muted)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close text settings"
          >
            ✕
          </button>
        </div>

        {/* Section 1: Font Family Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
              Choose Devotional Typeface
            </label>
            <span className="text-xs text-[var(--theme-text-muted)]">
              Applies to headings, verses & diary
            </span>
          </div>

          <div className="space-y-2.5">
            {FONT_OPTIONS.map(font => {
              const isSelected = config.fontId === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => handleSelectFont(font.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer relative flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'ring-2 ring-[var(--theme-accent)] border-[var(--theme-accent)] bg-[var(--theme-accent-subtle)] shadow-xs'
                      : 'border-[var(--theme-border)] bg-[var(--theme-card-subtle)] hover:border-[var(--theme-accent)]'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--theme-text-primary)]">
                        {font.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--theme-accent)] text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--theme-text-muted)]">
                      {font.tagline}
                    </p>
                    <p
                      className="text-sm pt-1 text-[var(--theme-text-primary)] italic"
                      style={{ fontFamily: font.displayFont }}
                    >
                      “{font.sampleText}”
                    </p>
                  </div>

                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-[var(--theme-accent)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Font Size Scaling */}
        <div className="space-y-3 pt-2 border-t border-[var(--theme-border)]">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-[var(--theme-accent)]" />
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
              Reading Comfort & Size
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {SCALE_OPTIONS.map(scale => {
              const isSelected = config.scaleId === scale.id;
              return (
                <button
                  key={scale.id}
                  type="button"
                  onClick={() => handleSelectScale(scale.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-[var(--theme-accent)] border-[var(--theme-accent)] bg-[var(--theme-accent-subtle)] shadow-xs'
                      : 'border-[var(--theme-border)] bg-[var(--theme-card-subtle)] hover:border-[var(--theme-accent)]'
                  }`}
                >
                  <p className="text-xs font-bold text-[var(--theme-text-primary)]">{scale.name}</p>
                  <p className="text-[11px] text-[var(--theme-accent)] font-semibold mt-0.5">
                    {scale.percentage}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Helper preview banner */}
        <div className="p-3.5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
          <span>Your font selection is saved automatically and remembered across all visits.</span>
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[var(--theme-accent)] hover:opacity-90 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
