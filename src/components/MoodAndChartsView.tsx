import React, { useState, useMemo } from 'react';
import { DiaryEntry, MoodType } from '../types';
import { MOODS, MOOD_LIST } from '../data/moods';
import { calculateUserStats } from '../utils/milestones';
import {
  TrendingUp,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  BookOpen,
  Trash2,
  Sparkles,
  BarChart2,
  Heart,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { MoodIcon } from './MoodIcons';
import { formatLongDate, formatShortDate } from '../utils/dateUtils';

interface MoodAndChartsViewProps {
  entries: DiaryEntry[];
  onSelectDate: (date: string) => void;
  onOpenDiary: (date: string) => void;
  onDeleteEntry: (id: string) => void;
  onImportBackup: (imported: DiaryEntry[]) => void;
}

type TimeRange = '7' | '14' | '30';

interface ChartPoint {
  dateStr: string;
  label: string;
  dayName: string;
  entry?: DiaryEntry;
  score: number;
  hasEntry: boolean;
  x: number;
  y: number;
}

export const MoodAndChartsView: React.FC<MoodAndChartsViewProps> = ({
  entries,
  onSelectDate,
  onOpenDiary,
  onDeleteEntry,
  onImportBackup
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('14');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [highlightedMood, setHighlightedMood] = useState<MoodType | 'all'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  const stats = useMemo(() => calculateUserStats(entries), [entries]);

  // Mood counts
  const moodCounts = useMemo(() => {
    const counts: Record<MoodType, number> = {
      peaceful: 0,
      joyful: 0,
      blessed: 0,
      grateful: 0,
      hopeful: 0,
      contemplative: 0,
      'seeking-rest': 0,
      persevering: 0
    };
    entries.forEach(e => {
      if (counts[e.mood] !== undefined) {
        counts[e.mood]++;
      }
    });
    return counts;
  }, [entries]);

  // Dynamic Day Trend based on selected time range (7, 14, 30 days)
  const trendDays = useMemo(() => {
    const rangeCount = parseInt(timeRange, 10);
    const today = new Date();
    const list: Array<{
      dateStr: string;
      label: string;
      dayName: string;
      entry?: DiaryEntry;
      score: number;
      hasEntry: boolean;
    }> = [];

    const moodScores: Record<MoodType, number> = {
      joyful: 5.0,
      blessed: 4.8,
      grateful: 4.5,
      peaceful: 4.2,
      hopeful: 4.0,
      contemplative: 3.5,
      persevering: 3.2,
      'seeking-rest': 2.8
    };

    for (let i = rangeCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const entry = entries.find(e => e.date === dateStr);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      list.push({
        dateStr,
        label: formatShortDate(dateStr),
        dayName,
        entry,
        score: entry ? moodScores[entry.mood] || 3.5 : 0,
        hasEntry: !!entry
      });
    }
    return list;
  }, [entries, timeRange]);

  // Average Peace Index in the window
  const activeEntriesInRange = useMemo(() => trendDays.filter(d => d.hasEntry), [trendDays]);
  const averageScore = useMemo(() => {
    if (activeEntriesInRange.length === 0) return 0;
    const sum = activeEntriesInRange.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round((sum / activeEntriesInRange.length) * 10) / 10;
  }, [activeEntriesInRange]);

  const consistencyPct = useMemo(() => {
    return Math.round((activeEntriesInRange.length / trendDays.length) * 100);
  }, [activeEntriesInRange, trendDays]);

  // Day of week distribution (Sun - Sat)
  const dayOfWeekCounts = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    entries.forEach(e => {
      const parts = e.date.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      counts[d.getDay()]++;
    });
    const maxVal = Math.max(...counts, 1);
    return dayNames.map((name, i) => ({
      name,
      count: counts[i],
      percentage: Math.round((counts[i] / maxVal) * 100)
    }));
  }, [entries]);

  // Filtered entries for search list
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchesMood = selectedMoodFilter === 'all' || e.mood === selectedMoodFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        e.date.includes(q) ||
        (e.feelingNote && e.feelingNote.toLowerCase().includes(q)) ||
        (e.lookForwardNotes && e.lookForwardNotes.toLowerCase().includes(q)) ||
        (e.thankfulNotes && e.thankfulNotes.some(t => t.toLowerCase().includes(q))) ||
        (e.achieveGoals && e.achieveGoals.some(g => g.text.toLowerCase().includes(q)));
      return matchesMood && matchesSearch;
    });
  }, [entries, selectedMoodFilter, searchQuery]);

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `skylers-daily-light-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportBackup(parsed);
          alert(`Successfully restored ${parsed.length} reflections!`);
        }
      } catch {
        alert('Invalid backup file. Please provide a valid JSON diary backup.');
      }
    };
    reader.readAsText(file);
  };

  // SVG Geometry Calculation with Cubic Bezier Spline
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 35;
  const paddingYTop = 30;
  const paddingYBottom = 30;
  const plotHeight = chartHeight - paddingYTop - paddingYBottom;

  const chartPoints: ChartPoint[] = useMemo(() => {
    const total = trendDays.length;
    // Map score range 2.0 -> 5.2 to Y coordinates
    const minY = 2.0;
    const maxY = 5.2;

    return trendDays.map((d, idx) => {
      const x = paddingX + (idx / Math.max(1, total - 1)) * (chartWidth - paddingX * 2);
      // For days without an entry, we place them along a calm resting line near bottom
      const y = d.hasEntry
        ? paddingYTop + plotHeight * (1 - (d.score - minY) / (maxY - minY))
        : chartHeight - paddingYBottom + 8;
      return {
        ...d,
        x,
        y
      };
    });
  }, [trendDays]);

  // Construct smooth Bezier curve through points that have entries
  const { pathD, areaD } = useMemo(() => {
    const activePoints = chartPoints.filter(p => p.hasEntry);
    if (activePoints.length === 0) {
      return { pathD: '', areaD: '' };
    }

    if (activePoints.length === 1) {
      const p = activePoints[0];
      return {
        pathD: `M ${p.x - 30} ${p.y} L ${p.x + 30} ${p.y}`,
        areaD: `M ${p.x - 30} ${chartHeight - paddingYBottom} L ${p.x - 30} ${p.y} L ${p.x + 30} ${p.y} L ${p.x + 30} ${chartHeight - paddingYBottom} Z`
      };
    }

    // Smooth Bezier path generator
    let d = `M ${activePoints[0].x} ${activePoints[0].y}`;
    for (let i = 0; i < activePoints.length - 1; i++) {
      const p0 = activePoints[i];
      const p1 = activePoints[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    const first = activePoints[0];
    const last = activePoints[activePoints.length - 1];
    const baselineY = chartHeight - paddingYBottom;
    const aD = `${d} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;

    return { pathD: d, areaD: aD };
  }, [chartPoints]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Devotional Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--theme-text-muted)]">Total Reflections</p>
            <BookOpen className="w-4 h-4 text-[var(--theme-accent)]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--theme-text-primary)] mt-1 tabular-nums font-display">
            {stats.totalEntries}
          </p>
          <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Written with faith</p>
        </div>

        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--theme-text-muted)]">Current Streak</p>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--theme-accent)] mt-1 tabular-nums font-display">
            {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
          </p>
          <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Best: {stats.longestStreak} days</p>
        </div>

        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--theme-text-muted)]">Blessings Counted</p>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1 tabular-nums font-display">
            {stats.totalGratitudes}
          </p>
          <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Moments of thanks</p>
        </div>

        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--theme-text-muted)]">Prayers Fulfilled</p>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums font-display">
            {stats.completedGoals}
          </p>
          <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Faithful intentions done</p>
        </div>
      </div>

      {/* REDESIGNED: SPIRITUAL MOOD TRAJECTORY CHART */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-7 shadow-md space-y-5">
        {/* Header with Title, Range Switcher & Dominant Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[var(--theme-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-[var(--theme-text-primary)]">
                  Spiritual Mood Trajectory
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] border border-[var(--theme-accent-border)]">
                  {timeRange}-Day View
                </span>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                Smooth organic progression of peace, gratitude, and heart stillness
              </p>
            </div>
          </div>

          {/* Time Range Selector & Dominant State Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] rounded-2xl">
              {(['7', '14', '30'] as TimeRange[]).map(range => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timeRange === range
                      ? 'bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-xs border border-[var(--theme-border)]'
                      : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
                  }`}
                >
                  {range}D
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold px-3 py-1.5 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] text-[var(--theme-accent)] flex items-center gap-1.5">
              <span>Dominant:</span>
              <span className="font-bold capitalize">{stats.mostFrequentMood}</span>
            </div>
          </div>
        </div>

        {/* Spiritual Trajectory KPI Mini-Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[var(--theme-text-muted)]">Average Peace Index:</span>
            <span className="font-bold text-[var(--theme-text-primary)] font-display text-sm">
              {averageScore > 0 ? `${averageScore} / 5.0` : 'Calm Resting'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[var(--theme-text-muted)]">Journal Consistency:</span>
            <span className="font-bold text-[var(--theme-text-primary)] font-display text-sm">
              {consistencyPct}%
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-[var(--theme-text-muted)]">Active Reflections:</span>
            <span className="font-bold text-[var(--theme-text-primary)] font-display text-sm">
              {activeEntriesInRange.length} of {trendDays.length} days
            </span>
          </div>
        </div>

        {/* Luminous Interactive SVG Canvas */}
        <div className="relative pt-4 pb-2 select-none">
          <div className="h-64 sm:h-72 w-full">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                {/* Luminous Gradient Aura under curve */}
                <linearGradient id="sanctuaryCurveGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="var(--theme-accent)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0.0" />
                </linearGradient>

                {/* Drop shadow for line glow */}
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="var(--theme-accent)" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Gentle Horizontal Reference Guides */}
              <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="currentColor" className="text-[var(--theme-border)] opacity-60" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2={chartWidth} y2="90" stroke="currentColor" className="text-[var(--theme-border)] opacity-60" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="currentColor" className="text-[var(--theme-border)] opacity-60" strokeDasharray="4 4" />
              <line x1="0" y1={chartHeight - paddingYBottom} x2={chartWidth} y2={chartHeight - paddingYBottom} stroke="currentColor" className="text-[var(--theme-border)]" strokeWidth="1.5" />

              {/* Y-axis Guidance Labels */}
              <text x="8" y="44" fill="currentColor" className="text-[9px] font-semibold text-[var(--theme-text-muted)] opacity-70">Radiant Joy</text>
              <text x="8" y="94" fill="currentColor" className="text-[9px] font-semibold text-[var(--theme-text-muted)] opacity-70">Peaceful</text>
              <text x="8" y="144" fill="currentColor" className="text-[9px] font-semibold text-[var(--theme-text-muted)] opacity-70">Gentle Rest</text>

              {/* Glowing Area Fill */}
              {areaD && (
                <path d={areaD} fill="url(#sanctuaryCurveGlow)" className="transition-all duration-500" />
              )}

              {/* Smooth Cubic Bezier Spline Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--theme-accent)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineGlow)"
                  className="transition-all duration-500"
                />
              )}

              {/* Vertical Guide Crosshair when hovering */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={20}
                  x2={hoveredPoint.x}
                  y2={chartHeight - paddingYBottom}
                  stroke="var(--theme-accent)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="opacity-75 transition-all"
                />
              )}

              {/* Interactive Node Anchors */}
              {chartPoints.map((p, idx) => {
                const isHovered = hoveredPoint?.dateStr === p.dateStr;
                const isMatchFilter = highlightedMood === 'all' || (p.entry && p.entry.mood === highlightedMood);

                return (
                  <g key={idx} className="cursor-pointer">
                    {/* Invisible larger hit-test circle */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="16"
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => {
                        if (p.entry) onOpenDiary(p.dateStr);
                        else onSelectDate(p.dateStr);
                      }}
                    />

                    {/* Node Visual */}
                    {p.hasEntry ? (
                      <g className="transition-transform duration-200">
                        {/* Outer Glow Halo on hover or match */}
                        {(isHovered || isMatchFilter) && (
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? '13' : '9'}
                            fill="var(--theme-accent)"
                            className="opacity-30 animate-pulse pointer-events-none"
                          />
                        )}

                        {/* Central Luminous Node */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? '7.5' : '5.5'}
                          fill="var(--theme-card)"
                          stroke="var(--theme-accent)"
                          strokeWidth={isHovered ? '3.5' : '2.5'}
                          className="pointer-events-none transition-all shadow-md"
                        />

                        {/* Sparkle star in center */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="2"
                          fill="var(--theme-accent)"
                          className="pointer-events-none"
                        />
                      </g>
                    ) : (
                      /* Quiet Rest Day Node along baseline */
                      <g>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? '4.5' : '3'}
                          fill="var(--theme-card-subtle)"
                          stroke="var(--theme-border)"
                          strokeWidth="1.5"
                          className="pointer-events-none transition-all"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Floating Glass Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-30 pointer-events-none p-3 rounded-2xl bg-[var(--theme-card)]/95 backdrop-blur-md border border-[var(--theme-accent-border)] shadow-xl text-xs space-y-1.5 transition-all max-w-xs animate-in fade-in zoom-in-95 duration-150"
                style={{
                  left: `${Math.min(78, Math.max(12, (hoveredPoint.x / chartWidth) * 100))}%`,
                  top: `${Math.max(10, hoveredPoint.y - 75)}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border)] pb-1">
                  <span className="font-bold text-[var(--theme-text-primary)]">
                    {hoveredPoint.dayName}, {hoveredPoint.label}
                  </span>
                  {hoveredPoint.hasEntry && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)]">
                      Reflected
                    </span>
                  )}
                </div>

                {hoveredPoint.hasEntry && hoveredPoint.entry ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--theme-accent)]">
                      <MoodIcon type={hoveredPoint.entry.mood} className="w-3.5 h-3.5" />
                      <span>{MOODS[hoveredPoint.entry.mood].label}</span>
                    </div>
                    {hoveredPoint.entry.feelingNote ? (
                      <p className="text-[11px] text-[var(--theme-text-primary)] italic line-clamp-2 leading-relaxed">
                        “{hoveredPoint.entry.feelingNote}”
                      </p>
                    ) : (
                      <p className="text-[10px] text-[var(--theme-text-muted)] italic">
                        {hoveredPoint.entry.thankfulNotes?.length || 0} blessings recorded
                      </p>
                    )}
                    <span className="text-[10px] text-[var(--theme-accent)] font-medium block pt-0.5">
                      Click node to read complete entry →
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-[var(--theme-text-muted)]">
                    <span>Quiet Sabbath / Rest Day</span>
                    <span className="text-[10px] text-[var(--theme-accent)] font-medium block pt-0.5">
                      Click to write today's reflection →
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* X-Axis Date Indicators */}
          <div className="flex justify-between text-[11px] text-[var(--theme-text-muted)] mt-2 px-4 font-medium border-t border-[var(--theme-border)] pt-2">
            <span>{trendDays[0].label} ({trendDays[0].dayName})</span>
            <span className="hidden sm:inline">
              {trendDays[Math.floor(trendDays.length / 2)].label}
            </span>
            <span className="font-bold text-[var(--theme-accent)]">
              Today ({trendDays[trendDays.length - 1].label})
            </span>
          </div>
        </div>

        {/* Interactive Mood Filter Chips: Tap to highlight specific days */}
        <div className="pt-2 border-t border-[var(--theme-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--theme-text-primary)] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>Filter Curve by Heart Mood:</span>
            </span>
            {highlightedMood !== 'all' && (
              <button
                type="button"
                onClick={() => setHighlightedMood('all')}
                className="text-xs text-[var(--theme-accent)] hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setHighlightedMood('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                highlightedMood === 'all'
                  ? 'bg-[var(--theme-accent)] text-white shadow-xs'
                  : 'bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]'
              }`}
            >
              All Moods
            </button>

            {MOOD_LIST.map(m => {
              const count = moodCounts[m.type] || 0;
              const isSelected = highlightedMood === m.type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setHighlightedMood(m.type)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--theme-accent)] text-white shadow-xs'
                      : 'bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-text-primary)]'
                  }`}
                >
                  <MoodIcon type={m.type} className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Chart 2: Mood Breakdown & Weekly Rhythm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--theme-text-primary)]">
                Heart Mood Proportions
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)]">Frequency of emotional states</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {MOOD_LIST.map(m => {
              const count = moodCounts[m.type] || 0;
              const total = entries.length || 1;
              const pct = Math.round((count / total) * 100);

              return (
                <div key={m.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-[var(--theme-text-primary)]">
                      <MoodIcon type={m.type} className="w-4 h-4 text-[var(--theme-accent)]" />
                      <span>{m.label}</span>
                    </span>
                    <span className="text-[var(--theme-text-muted)] tabular-nums font-semibold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--theme-card-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-[var(--theme-accent)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Reflection Rhythm */}
        <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--theme-text-primary)]">
                Weekly Reflection Rhythm
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)]">Journal entries by day of the week</p>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2">
            {dayOfWeekCounts.map(d => (
              <div key={d.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-[var(--theme-accent)] tabular-nums">
                  {d.count > 0 ? d.count : ''}
                </span>
                <div
                  className="w-full max-w-[28px] rounded-t-xl transition-all duration-500 bg-[var(--theme-card-subtle)] border-t border-x border-[var(--theme-border)] hover:bg-[var(--theme-accent)]"
                  style={{
                    height: `${Math.max(8, d.percentage)}%`,
                    backgroundColor: d.count > 0 ? 'var(--theme-accent)' : undefined
                  }}
                  title={`${d.name}: ${d.count} entries`}
                />
                <span className="text-xs font-semibold text-[var(--theme-text-muted)]">{d.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-[var(--theme-text-muted)]">
            Rhythmic morning reflection cultivates peaceful resilience throughout the week.
          </p>
        </div>
      </div>

      {/* Diary Search & Archive */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--theme-text-primary)]">
                Reflections Archive & Search ({filteredEntries.length})
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Search your prayers, gratitude notes, and devotional milestones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] hover:border-[var(--theme-accent)] text-xs font-semibold text-[var(--theme-text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export all diary entries to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <label
              className="px-3 py-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] hover:border-[var(--theme-accent)] text-xs font-semibold text-[var(--theme-text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Import diary entries from JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--theme-text-muted)] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search thoughts, scriptures, or blessings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-xs text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
            />
          </div>

          <select
            value={selectedMoodFilter}
            onChange={e => setSelectedMoodFilter(e.target.value)}
            className="px-3 py-2.5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-xs text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
          >
            <option value="all">All Moods</option>
            {MOOD_LIST.map(m => (
              <option key={m.type} value={m.type}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Entries List */}
        <div className="space-y-3 pt-1">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--theme-text-muted)]">
              No diary reflections match your search.
            </div>
          ) : (
            filteredEntries.slice(0, 10).map(entry => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] transition-all flex flex-wrap items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-[var(--theme-border)] flex items-center justify-center text-[var(--theme-accent)]">
                    <MoodIcon type={entry.mood} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--theme-text-primary)]">
                        {formatLongDate(entry.date)}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--theme-card)] border border-[var(--theme-border)] text-[var(--theme-accent)] capitalize">
                        {entry.mood}
                      </span>
                    </div>
                    {entry.feelingNote ? (
                      <p className="text-xs text-[var(--theme-text-muted)] line-clamp-1 mt-0.5 italic">
                        “{entry.feelingNote}”
                      </p>
                    ) : (
                      <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">
                        {entry.thankfulNotes?.length || 0} blessings recorded
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenDiary(entry.date)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--theme-card)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] text-xs font-semibold text-[var(--theme-text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this diary reflection?')) {
                        onDeleteEntry(entry.id);
                      }
                    }}
                    className="p-1.5 rounded-xl border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-rose-500 hover:border-rose-300 transition-colors cursor-pointer"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
