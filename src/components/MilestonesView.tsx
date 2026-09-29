import React from 'react';
import { Milestone } from '../types';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

interface MilestonesViewProps {
  milestones: Milestone[];
  streakCount: number;
  totalEntries: number;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  milestones,
  streakCount,
  totalEntries
}) => {
  const unlockedCount = milestones.filter(m => m.isUnlocked).length;
  const percentage = Math.round((unlockedCount / milestones.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Hero Milestone Banner */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-muted)] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[var(--theme-accent)]" />
            <span>Spiritual Milestones & Devotional Walk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--theme-text-primary)]">
            Your Garden of Milestones
          </h1>
          <p className="text-sm text-[var(--theme-text-muted)] max-w-xl">
            Every moment you choose to pause, give thanks, and dwell in His light leaves an eternal seed of faith.
          </p>
        </div>

        {/* Unlocked score ring */}
        <div className="flex items-center gap-4 bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] p-4 rounded-2xl shrink-0">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--theme-accent)] tabular-nums">
              {unlockedCount} / {milestones.length}
            </p>
            <p className="text-[11px] font-semibold text-[var(--theme-accent)] uppercase tracking-wider">
              Unlocked ({percentage}%)
            </p>
          </div>
        </div>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map(m => {
          const progressPct = Math.min(100, Math.round((m.current / m.target) * 100));

          return (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border transition-all ${
                m.isUnlocked
                  ? 'bg-[var(--theme-card)] border-[var(--theme-border)] shadow-xs hover:border-[var(--theme-accent)]'
                  : 'bg-[var(--theme-card-subtle)]/70 border-[var(--theme-border)] opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                      m.isUnlocked
                        ? 'bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)]'
                        : 'bg-[var(--theme-card-subtle)] border border-[var(--theme-border)]'
                    }`}
                  >
                    {m.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[var(--theme-text-primary)]">
                        {m.title}
                      </h3>
                      {m.isUnlocked ? (
                        <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="text-[var(--theme-text-muted)] text-xs font-medium flex items-center gap-1 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--theme-text-muted)]">{m.description}</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[var(--theme-text-muted)]">
                  <span className="font-medium">Devotional Progress</span>
                  <span className="tabular-nums font-semibold">
                    {m.current} / {m.target}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--theme-card-subtle)] overflow-hidden border border-[var(--theme-border)]">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-[var(--theme-accent)]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Attached Scripture Verse */}
              <div className="mt-4 p-3 rounded-xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-xs font-serif italic text-[var(--theme-text-primary)]">
                {m.verse}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
