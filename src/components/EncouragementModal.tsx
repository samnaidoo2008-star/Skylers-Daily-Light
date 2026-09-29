import React, { useEffect, useRef } from 'react';
import { DiaryEntry, Milestone } from '../types';
import { MOODS } from '../data/moods';
import { Sparkles, Check, Share2, Award } from 'lucide-react';
import { ambientAudio } from '../utils/audioSynthesizer';
import { MoodIcon } from './MoodIcons';

interface EncouragementModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: DiaryEntry;
  newMilestones: Milestone[];
  streakCount: number;
}

export const EncouragementModal: React.FC<EncouragementModalProps> = ({
  isOpen,
  onClose,
  entry,
  newMilestones,
  streakCount
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    ambientAudio.playGentleChime();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      '#F1DFBA',
      '#E6A8B8',
      '#C5DECFAF',
      '#CAD4F5',
      '#F2D7B8'
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2 - 100 + (Math.random() - 0.5) * 100,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 10,
        speedY: (Math.random() - 0.8) * 12,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.22;
        p.speedX *= 0.98;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);

          ctx.beginPath();
          ctx.roundRect(-p.size, -p.size / 2, p.size * 2, p.size, 3);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const moodMeta = MOODS[entry.mood];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 w-full h-full"
      />

      <div className="relative z-20 w-full max-w-lg bg-[var(--theme-card)] text-[var(--theme-text-primary)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--theme-border)] space-y-6 text-center">
        {/* Celebration Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)] shadow-xs">
          <Sparkles className="w-8 h-8 text-[var(--theme-accent)]" />
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
            Well Done, Faithful Heart
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--theme-text-primary)]">
            Reflection Treasured
          </h2>
          <p className="text-sm text-[var(--theme-text-muted)]">
            Your thoughts, prayers, and gratitude have been safely recorded.
          </p>
        </div>

        {/* Tailored Blessing Card */}
        <div
          className="p-5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-left space-y-2"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-accent)]"
            >
              <MoodIcon type={entry.mood} className="w-4 h-4" />
            </div>
            <span
              className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]"
            >
              Blessing for your {moodMeta.label} Spirit
            </span>
          </div>
          <p className="text-sm italic leading-relaxed text-[var(--theme-text-primary)] font-serif">
            “{moodMeta.blessing}”
          </p>
        </div>

        {/* Streak & Gratitude summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] rounded-2xl text-center">
            <p className="text-xs text-[var(--theme-text-muted)]">Reflection Streak</p>
            <p className="text-lg font-bold text-[var(--theme-accent)] mt-0.5">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </p>
          </div>
          <div className="p-3.5 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] rounded-2xl text-center">
            <p className="text-xs text-[var(--theme-text-muted)]">Blessings Logged</p>
            <p className="text-lg font-bold text-emerald-500 mt-0.5">
              {entry.thankfulNotes.length} Items
            </p>
          </div>
        </div>

        {/* Milestone Unlocks */}
        {newMilestones && newMilestones.length > 0 && (
          <div className="p-4 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--theme-accent)] uppercase tracking-wider">
              <Award className="w-4 h-4 text-[var(--theme-accent)]" />
              <span>Milestone Unlocked!</span>
            </div>
            {newMilestones.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="text-sm font-bold text-[var(--theme-text-primary)]">{m.title}</p>
                  <p className="text-xs text-[var(--theme-text-muted)]">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const text = `I just completed my daily devotional reflection on Skyler’s Daily Light! ✨ “${entry.thankfulNotes[0] || 'Grateful for God’s guidance'}”`;
              navigator.clipboard.writeText(text);
              ambientAudio.playGentleChime();
              alert('Copied reflection highlight to clipboard!');
            }}
            className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-[var(--theme-card-subtle)] hover:border-[var(--theme-accent)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Blessing</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl text-xs font-semibold text-white bg-[var(--theme-accent)] hover:opacity-90 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Continue My Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
