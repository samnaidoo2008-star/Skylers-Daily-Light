import React, { useState } from 'react';
import { DiaryEntry } from '../types';
import { MOODS } from '../data/moods';
import { getAffirmationForDate } from '../data/affirmations';
import { ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { MoodIcon } from './MoodIcons';
import { formatDateKey, formatLongDate, getTodayKey, parseDateParts } from '../utils/dateUtils';

interface CalendarViewProps {
  entries: DiaryEntry[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenDiary: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  selectedDate,
  onSelectDate,
  onOpenDiary
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const { year, month } = parseDateParts(selectedDate);
    return new Date(year, month - 1, 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleJumpToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(getTodayKey());
  };

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const entryMap = new Map<string, DiaryEntry>();
  entries.forEach(e => entryMap.set(e.date, e));

  const days = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDateKey(prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate());
    days.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
      entry: entryMap.get(dateStr)
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDateKey(year, month + 1, i);
    days.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: true,
      entry: entryMap.get(dateStr)
    });
  }

  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateStr = formatDateKey(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate());
    days.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: false,
      entry: entryMap.get(dateStr)
    });
  }

  const selectedEntry = entryMap.get(selectedDate);
  const selectedAffirmation = getAffirmationForDate(selectedDate);
  const todayStr = getTodayKey();

  const monthEntriesCount = entries.filter(e => e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Month Header and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--theme-card)] border border-[var(--theme-border)] p-5 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-[var(--theme-text-primary)]">
              {monthName}
            </h2>
            <p className="text-xs text-[var(--theme-text-muted)]">
              {monthEntriesCount} {monthEntriesCount === 1 ? 'reflection' : 'reflections'} recorded this month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleJumpToday}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer shadow-xs"
          >
            Today
          </button>
          <div className="flex items-center bg-[var(--theme-card-subtle)] rounded-xl border border-[var(--theme-border)] p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-lg hover:bg-[var(--theme-card)] text-[var(--theme-text-primary)] flex items-center justify-center transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-lg hover:bg-[var(--theme-card)] text-[var(--theme-text-primary)] flex items-center justify-center transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Container */}
        <div className="lg:col-span-8 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
              <div key={dayName} className="text-xs font-semibold text-[var(--theme-text-muted)] py-2 uppercase tracking-wider">
                {dayName}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map(d => {
              const isSelected = d.dateStr === selectedDate;
              const isToday = d.dateStr === todayStr;
              const moodMeta = d.entry ? MOODS[d.entry.mood] : null;

              return (
                <button
                  key={d.dateStr}
                  type="button"
                  onClick={() => onSelectDate(d.dateStr)}
                  className={`min-h-[64px] sm:min-h-[76px] p-2 rounded-2xl flex flex-col justify-between text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/30 bg-[var(--theme-accent-subtle)]'
                      : isToday
                      ? 'border-[var(--theme-border)] bg-[var(--theme-card-subtle)]'
                      : d.isCurrentMonth
                      ? 'border-[var(--theme-border)] bg-[var(--theme-card)] hover:border-[var(--theme-accent)]'
                      : 'border-transparent bg-[var(--theme-card-subtle)]/40 text-[var(--theme-text-muted)]/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                        isToday
                          ? 'bg-[var(--theme-accent)] text-white'
                          : isSelected
                          ? 'text-[var(--theme-accent)] font-bold'
                          : d.isCurrentMonth
                          ? 'text-[var(--theme-text-primary)]'
                          : 'text-[var(--theme-text-muted)]/60'
                      }`}
                    >
                      {d.dayNum}
                    </span>
                    {d.entry && (
                      <div className="text-[var(--theme-accent)]">
                        <MoodIcon type={d.entry.mood} className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {d.entry ? (
                    <div
                      className="mt-1 text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium bg-[var(--theme-card-subtle)] text-[var(--theme-text-primary)] border border-[var(--theme-border)]"
                    >
                      {d.entry.feelingNote ? d.entry.feelingNote : moodMeta?.label}
                    </div>
                  ) : (
                    <div className="h-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-[var(--theme-border)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--theme-text-muted)]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-accent)]" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Diary Recorded</span>
              </div>
            </div>
            <div className="text-[11px] text-[var(--theme-text-muted)]">
              Click any day to view daily affirmation or diary reflection
            </div>
          </div>
        </div>

        {/* Selected Date Insight Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--theme-text-muted)]">
                  Selected Date
                </span>
                <h3 className="text-base font-bold text-[var(--theme-text-primary)]">
                  {formatLongDate(selectedDate)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onOpenDiary(selectedDate)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--theme-accent)] hover:opacity-90 text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{selectedEntry ? 'Edit' : 'Write'}</span>
              </button>
            </div>

            {selectedEntry ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--theme-card)] flex items-center justify-center shrink-0 border border-[var(--theme-border)] text-[var(--theme-accent)]">
                    <MoodIcon type={selectedEntry.mood} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                      Mood: {MOODS[selectedEntry.mood].label}
                    </p>
                    <p className="text-xs text-[var(--theme-text-primary)] mt-0.5 line-clamp-2">
                      {selectedEntry.feelingNote || MOODS[selectedEntry.mood].description}
                    </p>
                  </div>
                </div>

                {selectedEntry.thankfulNotes && selectedEntry.thankfulNotes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-[var(--theme-text-muted)]">
                      Thankful For ({selectedEntry.thankfulNotes.length})
                    </span>
                    <ul className="text-xs text-[var(--theme-text-primary)] space-y-1 pl-1">
                      {selectedEntry.thankfulNotes.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[var(--theme-accent)] font-bold">·</span>
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--theme-accent)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>No diary entry yet for this day</span>
                </div>
                <p className="text-xs text-[var(--theme-text-primary)] leading-relaxed">
                  Take a peaceful breath and reflect on today’s daily scripture and affirmation.
                </p>
              </div>
            )}

            {/* Daily Affirmation Snippet */}
            <div className="p-4 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                Affirmation for this day
              </span>
              <p className="text-xs font-serif italic text-[var(--theme-text-primary)] leading-relaxed">
                “{selectedAffirmation.affirmation}”
              </p>
              <p className="text-[11px] font-semibold text-[var(--theme-accent)]">
                {selectedAffirmation.verseRef}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
