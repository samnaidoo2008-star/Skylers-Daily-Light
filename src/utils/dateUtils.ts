// Bulletproof date manipulation utility that avoids UTC timezone offset shifts

export function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  }
  return { year: parts[0], month: parts[1], day: parts[2] };
}

export function formatDateKey(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: string, daysToAdd: number): string {
  const { year, month, day } = parseDateParts(dateStr);
  // Using noon (12:00:00) avoids DST edge cases and timezone rollovers
  const date = new Date(year, month - 1, day + daysToAdd, 12, 0, 0);
  return formatDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function getTodayKey(): string {
  const today = new Date();
  return formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

export function formatLongDate(dateStr: string): string {
  const { year, month, day } = parseDateParts(dateStr);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatShortDate(dateStr: string): string {
  const { year, month, day } = parseDateParts(dateStr);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function isSunday(dateStr: string): boolean {
  const { year, month, day } = parseDateParts(dateStr);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return date.getDay() === 0;
}

