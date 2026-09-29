import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc3, Sparkles } from 'lucide-react';
import { ambientAudio, SOUNDSCAPES, SoundscapeType } from '../utils/audioSynthesizer';

interface AudioPlayerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [soundscape, setSoundscape] = useState<SoundscapeType>('morning-light');

  useEffect(() => {
    const status = ambientAudio.getStatus();
    setIsPlaying(status.isPlaying);
    setVolume(status.volume);
    setSoundscape(status.soundscape);
  }, [isOpen]);

  const handleTogglePlay = async () => {
    const playing = await ambientAudio.toggle();
    setIsPlaying(playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientAudio.setVolume(val);
  };

  const handleSelectSoundscape = async (type: SoundscapeType) => {
    setSoundscape(type);
    await ambientAudio.setSoundscape(type);
    if (!isPlaying) {
      const playing = await ambientAudio.toggle();
      setIsPlaying(playing);
    }
  };

  const handlePlayChime = async () => {
    await ambientAudio.playGentleChime();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[var(--theme-card)] text-[var(--theme-text-primary)] rounded-3xl p-6 shadow-2xl border border-[var(--theme-border)] space-y-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-modal-title"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 id="audio-modal-title" className="text-lg font-bold font-display text-[var(--theme-text-primary)]">
                Soothing Sanctuary Audio
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Continuous peaceful background soundscapes & prayer drones
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--theme-card-subtle)] text-[var(--theme-text-muted)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close audio controls"
          >
            ✕
          </button>
        </div>

        {/* Main Play / Pause banner */}
        <div className="p-4 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-[var(--theme-accent)] text-white scale-105'
                  : 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
              }`}
              aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
            >
              {isPlaying ? (
                <Disc3 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <span className="text-lg ml-0.5">▶</span>
              )}
            </button>
            <div>
              <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                {isPlaying ? 'Currently Playing' : 'Audio Paused'}
              </p>
              <p className="text-xs text-[var(--theme-text-muted)]">
                {isPlaying ? 'Gentle acoustic ambient synthesizer' : 'Click to begin peaceful ambience'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlayChime}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--theme-accent)] bg-[var(--theme-accent-subtle)] hover:opacity-85 border border-[var(--theme-accent-border)] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Play a peaceful harp chime"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Chime</span>
          </button>
        </div>

        {/* Soundscapes list (Now 8 rich choices) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold tracking-wider text-[var(--theme-accent)] uppercase">
              Select Soundscape ({SOUNDSCAPES.length} Choices)
            </label>
            <span className="text-[11px] text-[var(--theme-text-muted)]">
              Harmonic synthesizers
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SOUNDSCAPES.map(item => {
              const active = soundscape === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSoundscape(item.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--theme-accent-subtle)] border-[var(--theme-accent)] shadow-xs ring-1 ring-[var(--theme-accent)]'
                      : 'bg-[var(--theme-card-subtle)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{item.icon}</span>
                    <p className="text-sm font-bold text-[var(--theme-text-primary)]">{item.title}</p>
                  </div>
                  <p className="text-[11px] text-[var(--theme-text-muted)] leading-tight line-clamp-2">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2 pt-1 border-t border-[var(--theme-border)]">
          <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
            <span className="font-semibold text-[var(--theme-text-primary)]">Master Volume</span>
            <span className="tabular-nums font-bold text-[var(--theme-accent)]">{Math.round(volume * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleVolumeChange({ target: { value: volume > 0 ? '0' : '0.55' } } as unknown as React.ChangeEvent<HTMLInputElement>)}
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer"
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-[var(--theme-card-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--theme-accent)]"
            />
          </div>
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
