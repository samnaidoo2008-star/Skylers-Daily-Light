import React, { useState, useEffect } from 'react';
import { DiaryEntry, GoalItem, MoodType } from '../types';
import { MOODS, MOOD_LIST } from '../data/moods';
import { LIGHT_ARTWORKS } from '../data/assets';
import { getAffirmationForDate } from '../data/affirmations';
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Church,
  BookOpen
} from 'lucide-react';
import { ambientAudio } from '../utils/audioSynthesizer';
import { MoodIcon } from './MoodIcons';
import { formatLongDate, isSunday } from '../utils/dateUtils';
import { ArtworkSelectorModal } from './ArtworkSelectorModal';
import { SUNDAY_REFLECTION_PROMPTS, SundayReflectionPrompt } from '../data/sundayPrompts';

interface DiarySectionProps {
  date: string;
  entry?: DiaryEntry;
  onSaveEntry: (entry: DiaryEntry) => void;
  onDeleteEntry?: (id: string) => void;
  promptSnippet?: string;
}

export const DiarySection: React.FC<DiarySectionProps> = ({
  date,
  entry,
  onSaveEntry,
  onDeleteEntry,
  promptSnippet
}) => {
  const affirmation = getAffirmationForDate(date);
  const isSundayEntry = isSunday(date);

  const [mood, setMood] = useState<MoodType>(entry?.mood || 'peaceful');
  const [feelingNote, setFeelingNote] = useState(entry?.feelingNote || '');
  const [goals, setGoals] = useState<GoalItem[]>(
    entry?.achieveGoals || [
      { id: '1', text: 'Seek God’s peace in every thought and action today', done: false }
    ]
  );
  const [newGoalText, setNewGoalText] = useState('');
  const [thankfulList, setThankfulList] = useState<string[]>(
    entry?.thankfulNotes || ['The quiet sunrise of a new morning', 'God’s steadfast kindness']
  );
  const [newThankfulText, setNewThankfulText] = useState('');
  const [lookForwardNotes, setLookForwardNotes] = useState(entry?.lookForwardNotes || '');
  const [scriptureNote, setScriptureNote] = useState(
    entry?.scriptureNote || `“${affirmation.scripture}” — ${affirmation.verseRef}`
  );
  const [selectedCover, setSelectedCover] = useState(entry?.coverImage || LIGHT_ARTWORKS[0].src);
  const [showArtworkPicker, setShowArtworkPicker] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sunday Spiritual Reflection State
  const [sundayPromptIndex, setSundayPromptIndex] = useState(0);
  const [showSundaySection, setShowSundaySection] = useState(isSundayEntry);
  const [promptCopiedSuccess, setPromptCopiedSuccess] = useState(false);

  useEffect(() => {
    setShowSundaySection(isSundayEntry);
  }, [isSundayEntry, date]);

  useEffect(() => {
    if (entry) {
      setMood(entry.mood);
      setFeelingNote(entry.feelingNote);
      setGoals(entry.achieveGoals || []);
      setThankfulList(entry.thankfulNotes || []);
      setLookForwardNotes(entry.lookForwardNotes || '');
      setScriptureNote(entry.scriptureNote || `“${affirmation.scripture}” — ${affirmation.verseRef}`);
      setSelectedCover(entry.coverImage || LIGHT_ARTWORKS[0].src);
    } else {
      setMood('peaceful');
      setFeelingNote(promptSnippet ? `Soul Reflection: ${promptSnippet}\n` : '');
      setGoals([
        { id: String(Date.now()), text: 'Walk in faith and extend quiet kindness', done: false }
      ]);
      setThankfulList(['The fresh mercies of a new morning', 'Peace that surpasses understanding']);
      setLookForwardNotes('');
      setScriptureNote(`“${affirmation.scripture}” — ${affirmation.verseRef}`);
      setSelectedCover(LIGHT_ARTWORKS[0].src);
    }
    setHasUnsavedChanges(false);
  }, [date, entry, promptSnippet]);

  const handleToggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, done: !g.done } : g)));
    setHasUnsavedChanges(true);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newItem: GoalItem = {
      id: String(Date.now()),
      text: newGoalText.trim(),
      done: false
    };
    setGoals(prev => [...prev, newItem]);
    setNewGoalText('');
    setHasUnsavedChanges(true);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleAddThankful = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThankfulText.trim()) return;
    setThankfulList(prev => [...prev, newThankfulText.trim()]);
    setNewThankfulText('');
    setHasUnsavedChanges(true);
  };

  const handleRemoveThankful = (index: number) => {
    setThankfulList(prev => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const payload: DiaryEntry = {
      id: entry?.id || `entry-${date}-${Date.now()}`,
      date,
      mood,
      feelingNote,
      achieveGoals: goals,
      thankfulNotes: thankfulList,
      lookForwardNotes,
      scriptureNote,
      coverImage: selectedCover,
      createdAt: entry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    ambientAudio.playGentleChime();
    onSaveEntry(payload);
    setHasUnsavedChanges(false);
  };

  const handleInsertSundayPrompt = (p: SundayReflectionPrompt) => {
    const promptBlock = `\n\n--- 🕊️ Sunday Weekly Spiritual Review ---\nTheme: ${p.theme}\nWeekly Scripture: “${p.scriptureText}” (${p.scriptureReference})\nReview Prompt: ${p.prompt}\nDeepening Thought: ${p.deepeningQuestion}\n\nMy Sunday Reflection: `;

    setFeelingNote(prev => (prev ? prev.trim() + promptBlock : promptBlock.trimStart()));
    setHasUnsavedChanges(true);
    ambientAudio.playGentleChime();
    setPromptCopiedSuccess(true);
    setTimeout(() => setPromptCopiedSuccess(false), 2500);
  };

  const currentSundayPrompt = SUNDAY_REFLECTION_PROMPTS[sundayPromptIndex];

  const handleNextSundayPrompt = () => {
    setSundayPromptIndex(prev => (prev + 1) % SUNDAY_REFLECTION_PROMPTS.length);
  };

  const handlePrevSundayPrompt = () => {
    setSundayPromptIndex(prev => (prev - 1 + SUNDAY_REFLECTION_PROMPTS.length) % SUNDAY_REFLECTION_PROMPTS.length);
  };

  const formattedDate = formatLongDate(date);
  const activeMoodMeta = MOODS[mood];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Diary Header */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-muted)] uppercase tracking-wider">
            <span>Devotional Journal</span>
            <span>·</span>
            <span className="text-[var(--theme-accent)]">Guided Reflections</span>
            {isSundayEntry && (
              <>
                <span>·</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <Church className="w-3.5 h-3.5" />
                  <span>Sunday Sabbath Review</span>
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--theme-text-primary)] mt-1">
            {formattedDate}
          </h1>
          <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
            Pour out your thoughts, prayers, and gratitude in peaceful sanctuary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {entry && onDeleteEntry && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this diary entry?')) {
                  onDeleteEntry(entry.id);
                }
              }}
              className="p-2.5 rounded-xl border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-rose-500 hover:border-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Delete Entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
              hasUnsavedChanges
                ? 'bg-[var(--theme-accent)] hover:opacity-90 ring-2 ring-[var(--theme-accent)]/30'
                : 'bg-[var(--theme-accent)] hover:opacity-90'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{hasUnsavedChanges ? 'Save Changes *' : 'Save Entry'}</span>
          </button>
        </div>
      </div>

      {/* Decorative Hero Cover Strip */}
      <div className="relative h-44 sm:h-52 w-full rounded-3xl overflow-hidden border border-[var(--theme-border)] shadow-xs">
        <img
          src={selectedCover}
          alt="Devotional Journal Cover"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
          <div>
            <span className="text-xs font-medium text-white/80">Reflective Artwork</span>
            <p className="text-sm font-semibold">
              {LIGHT_ARTWORKS.find(a => a.src === selectedCover)?.title || 'Sanctuary Light & Peace'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowArtworkPicker(true)}
            className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-[#2C2720] backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Change Artwork</span>
          </button>
        </div>
      </div>

      {/* Artwork Selector Modal (includes sketches & paintings) */}
      <ArtworkSelectorModal
        isOpen={showArtworkPicker}
        onClose={() => setShowArtworkPicker(false)}
        selectedArtworkSrc={selectedCover}
        onSelectArtwork={(art) => {
          setSelectedCover(art.src);
          setHasUnsavedChanges(true);
        }}
      />

      {/* SUNDAY SPIRITUAL REFLECTION FEATURE: Deeper Spiritual Prompt for Weekly Review */}
      {showSundaySection ? (
        <div className="bg-gradient-to-br from-[var(--theme-card)] to-[var(--theme-card-subtle)] border-2 border-amber-500/30 dark:border-amber-400/25 rounded-3xl p-6 sm:p-7 shadow-md space-y-5 relative overflow-hidden animate-in fade-in duration-300">
          {/* Subtle background glow effect */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-[var(--theme-text-primary)]">
                    Sunday Sabbath Reflection · Weekly Review
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    Prompt {sundayPromptIndex + 1} of {SUNDAY_REFLECTION_PROMPTS.length}
                  </span>
                </div>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  A sacred pause to examine where God walked with you over the past seven days.
                </p>
              </div>
            </div>

            {/* Prompt cycler */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevSundayPrompt}
                className="w-8 h-8 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-primary)] hover:border-amber-500 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Previous weekly prompt"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSundayPrompt}
                className="w-8 h-8 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-primary)] hover:border-amber-500 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Next weekly prompt"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {!isSundayEntry && (
                <button
                  type="button"
                  onClick={() => setShowSundaySection(false)}
                  className="text-xs text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] ml-2"
                >
                  ✕ Hide
                </button>
              )}
            </div>
          </div>

          {/* Theme & Prompt Content */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Spiritual Theme:
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[var(--theme-accent-subtle)] text-[var(--theme-text-primary)] border border-[var(--theme-accent-border)]">
                {currentSundayPrompt.theme}
              </span>
            </div>

            {/* Main Weekly Reflection Prompt Question */}
            <div className="p-4 rounded-2xl bg-[var(--theme-card)] border border-[var(--theme-border)] shadow-xs">
              <p className="text-base sm:text-lg font-serif text-[var(--theme-text-primary)] leading-relaxed italic">
                “{currentSundayPrompt.prompt}”
              </p>
            </div>

            {/* Scripture Anchor & Deepening Question */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Weekly Scripture Anchor
                </span>
                <p className="text-xs text-[var(--theme-text-primary)] font-serif leading-relaxed">
                  “{currentSundayPrompt.scriptureText}”
                </p>
                <p className="text-[10px] font-semibold text-[var(--theme-accent)]">
                  — {currentSundayPrompt.scriptureReference}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Deepening Question
                </span>
                <p className="text-xs text-[var(--theme-text-primary)] leading-relaxed">
                  {currentSundayPrompt.deepeningQuestion}
                </p>
              </div>
            </div>
          </div>

          {/* Insert into Diary Action */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--theme-border)]">
            <div className="text-xs text-[var(--theme-text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tap below to insert this Sabbath review prompt into your reflection notes below:</span>
            </div>

            <button
              type="button"
              onClick={() => handleInsertSundayPrompt(currentSundayPrompt)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {promptCopiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Prompt Added to Your Notes!</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Use This Sunday Prompt in Journal</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Discreet banner on other days allowing optional weekly review */
        <div className="p-4 rounded-2xl bg-[var(--theme-card)] border border-[var(--theme-border)] flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-[var(--theme-text-muted)]">
            <Church className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Looking to review your past week? Explore deeper spiritual reflection prompts for weekly review anytime.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSundaySection(true)}
            className="px-3 py-1.5 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-[var(--theme-text-primary)] hover:border-amber-500 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Open Weekly Review Prompts
          </button>
        </div>
      )}

      {/* Guided Prompt 1: I am feeling */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] flex items-center justify-center text-[var(--theme-accent)]">
              <MoodIcon type={mood} className="w-4 h-4 text-[var(--theme-accent)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[var(--theme-text-primary)]">
                1. "I am feeling"
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Honor your emotions before God and select your heart’s mood.
              </p>
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] flex items-center gap-1.5"
          >
            <MoodIcon type={mood} className="w-3.5 h-3.5" />
            <span>{activeMoodMeta.label}</span>
          </span>
        </div>

        {/* Clean Mood Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MOOD_LIST.map(m => {
            const isSelected = mood === m.type;
            return (
              <button
                key={m.type}
                type="button"
                onClick={() => {
                  setMood(m.type);
                  setHasUnsavedChanges(true);
                }}
                className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[var(--theme-accent)]/40 border-[var(--theme-accent)] bg-[var(--theme-accent-subtle)] shadow-xs'
                    : 'border-[var(--theme-border)] bg-[var(--theme-card-subtle)] hover:border-[var(--theme-accent)]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'border-[var(--theme-accent)] bg-[var(--theme-card)] text-[var(--theme-accent)]'
                      : 'border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-muted)]'
                  }`}
                >
                  <MoodIcon type={m.type} className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p
                    className={`text-xs font-bold truncate ${
                      isSelected ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text-primary)]'
                    }`}
                  >
                    {m.label}
                  </p>
                  <p className="text-[10px] text-[var(--theme-text-muted)] truncate">
                    {m.description.split(' ')[0]}...
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Blessing quote tailored to mood */}
        <div className="p-4 rounded-2xl text-xs leading-relaxed border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-[var(--theme-text-primary)] italic font-serif">
          <span className="font-semibold not-italic font-sans text-[var(--theme-accent)]">Blessing for you: </span>
          “{activeMoodMeta.blessing}”
        </div>

        {/* Freeform feeling notes */}
        <textarea
          value={feelingNote}
          onChange={e => {
            setFeelingNote(e.target.value);
            setHasUnsavedChanges(true);
          }}
          placeholder="Describe how your soul feels right now, your prayers, or your Sunday weekly review reflections..."
          rows={5}
          className="w-full p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30 transition-all resize-y"
        />
      </div>

      {/* Guided Prompt 2: I want to achieve */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] flex items-center justify-center text-[var(--theme-accent)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--theme-accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--theme-text-primary)]">
              2. "I want to achieve"
            </h2>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Set humble, faith-aligned intentions for spiritual, emotional, and daily growth.
            </p>
          </div>
        </div>

        {/* Goal Checklist */}
        <div className="space-y-2">
          {goals.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                item.done
                  ? 'bg-[var(--theme-accent-subtle)]/50 border-[var(--theme-accent-border)]'
                  : 'bg-[var(--theme-card-subtle)] border-[var(--theme-border)]'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleGoal(item.id)}
                className="flex items-center gap-3 text-left flex-1 cursor-pointer"
              >
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--theme-accent)] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--theme-text-muted)] shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    item.done
                      ? 'line-through text-[var(--theme-text-muted)]'
                      : 'text-[var(--theme-text-primary)]'
                  }`}
                >
                  {item.text}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleRemoveGoal(item.id)}
                className="p-1.5 text-[var(--theme-text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove goal"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Goal Input */}
        <form onSubmit={handleAddGoal} className="flex gap-2">
          <input
            type="text"
            value={newGoalText}
            onChange={e => setNewGoalText(e.target.value)}
            placeholder="Add a new intention or prayerful goal..."
            className="flex-1 p-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] hover:opacity-90 font-semibold text-xs border border-[var(--theme-accent-border)] flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Guided Prompt 3: I am thankful for */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] flex items-center justify-center text-[var(--theme-accent)]">
            <Sparkles className="w-4 h-4 text-[var(--theme-accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--theme-text-primary)]">
              3. "I am thankful for"
            </h2>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Record both small daily graces and God’s mighty kindness.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {thankfulList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)]"
            >
              <div className="flex items-center gap-2.5 flex-1">
                <span className="w-2 h-2 rounded-full bg-[var(--theme-accent)]" />
                <span className="text-sm text-[var(--theme-text-primary)]">{item}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveThankful(idx)}
                className="p-1.5 text-[var(--theme-text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Thankful Input */}
        <form onSubmit={handleAddThankful} className="flex gap-2">
          <input
            type="text"
            value={newThankfulText}
            onChange={e => setNewThankfulText(e.target.value)}
            placeholder="What blessing or kindness warmed your heart?"
            className="flex-1 p-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] hover:opacity-90 font-semibold text-xs border border-[var(--theme-accent-border)] flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Guided Prompt 4: Looking Forward & Prayers */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] flex items-center justify-center text-[var(--theme-accent)]">
            <Calendar className="w-4 h-4 text-[var(--theme-accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--theme-text-primary)]">
              4. "Looking forward & Quiet Prayers"
            </h2>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Cast your cares upon Him, looking toward tomorrow with steadfast hope.
            </p>
          </div>
        </div>

        <textarea
          value={lookForwardNotes}
          onChange={e => {
            setLookForwardNotes(e.target.value);
            setHasUnsavedChanges(true);
          }}
          placeholder="What are you praying for, anticipating, or holding before God for tomorrow and the coming days?"
          rows={3}
          className="w-full p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-muted)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30 transition-all resize-none"
        />
      </div>

      {/* Guided Prompt 5: Anchor Scripture */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent-subtle)] flex items-center justify-center text-[var(--theme-accent)]">
            <BookOpen className="w-4 h-4 text-[var(--theme-accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--theme-text-primary)]">
              5. "Scripture Anchor for Today"
            </h2>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Personalize or meditate on today's verse reference.
            </p>
          </div>
        </div>

        <input
          type="text"
          value={scriptureNote}
          onChange={e => {
            setScriptureNote(e.target.value);
            setHasUnsavedChanges(true);
          }}
          className="w-full p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-sm font-serif italic text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30 transition-all"
        />
      </div>

      {/* Bottom Save Bar */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-[var(--theme-text-muted)]">
          {hasUnsavedChanges ? 'Unsaved changes in this entry' : 'Entry saved to your device'}
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-[var(--theme-accent)] hover:opacity-90 shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Entry</span>
        </button>
      </div>
    </div>
  );
};
