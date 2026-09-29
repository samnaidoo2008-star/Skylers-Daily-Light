import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, BookOpen, Trash2, Heart, RefreshCw, MessageCircleHeart } from 'lucide-react';
import { ambientAudio } from '../utils/audioSynthesizer';
import { formatLongDate } from '../utils/dateUtils';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SanctuaryCompanionChatProps {
  currentDate: string;
  hasDiaryEntryToday: boolean;
  onOpenDiary: () => void;
}

const STORAGE_KEY = 'skylers_daily_light_chat_history';

const SUGGESTIONS = [
  'I had a heavy day, can you give me some uplifting encouragement?',
  'Remind me why taking time for my diary matters today.',
  'What is a gentle prayer or thought for peace tonight?',
  'I want to celebrate a small victory today!'
];

export const SanctuaryCompanionChat: React.FC<SanctuaryCompanionChatProps> = ({
  currentDate,
  hasDiaryEntryToday,
  onOpenDiary
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [
      {
        id: 'initial',
        role: 'assistant',
        content: `Peace be with you, Skyler. 🕊️ I'm Grace, your gentle companion here to listen, inspire you, and hold space for your heart. How has your day felt so far?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMsg('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          userDate: currentDate,
          hasDiaryToday: hasDiaryEntryToday
        })
      });

      if (!response.ok) {
        throw new Error('Grace is momentarily quiet. Please try again in a moment.');
      }

      const data = await response.json();
      const reply = data.reply || 'You are held in peace and grace today.';

      ambientAudio.playGentleChime();

      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Unable to connect with Grace right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history with Grace?')) {
      const fresh: ChatMessage[] = [
        {
          id: `initial-${Date.now()}`,
          role: 'assistant',
          content: `Welcome back, Skyler. I am here to listen with an open heart. How are you feeling right now?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(fresh);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
            <MessageCircleHeart className="w-6 h-6 text-[var(--theme-accent)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--theme-text-primary)]">
                Grace · Daily Companion
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Always Listening
              </span>
            </div>
            <p className="text-xs text-[var(--theme-text-muted)]">
              Motivational encouragement, a listening ear for your day, and a gentle reminder for your reflections.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!hasDiaryEntryToday ? (
            <button
              type="button"
              onClick={onOpenDiary}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--theme-accent)] text-white hover:opacity-90 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Write Today’s Diary</span>
            </button>
          ) : (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diary Completed Today</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-[var(--theme-text-muted)] hover:text-rose-500 hover:bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Diary Reminder Alert if unwritten today */}
      {!hasDiaryEntryToday && (
        <div className="p-3.5 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--theme-text-primary)]">
            <Sparkles className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
            <span>
              A gentle reminder: You haven’t recorded your reflections for {formatLongDate(currentDate)} yet. Even a 2-minute pause brings stillness.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenDiary}
            className="text-xs font-bold text-[var(--theme-accent)] hover:underline whitespace-nowrap cursor-pointer"
          >
            Open Diary →
          </button>
        </div>
      )}

      {/* Chat Thread Container */}
      <div className="bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
          {messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)] text-xs font-bold shrink-0 mt-0.5">
                    G
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl space-y-1 ${
                    isUser
                      ? 'bg-[var(--theme-accent)] text-white rounded-br-xs'
                      : 'bg-[var(--theme-card-subtle)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-bl-xs'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </p>
                  <div className={`text-[10px] ${isUser ? 'text-white/70' : 'text-[var(--theme-text-muted)]'} text-right`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)] text-xs font-bold shrink-0">
                G
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-muted)] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--theme-accent)]" />
                <span>Grace is preparing words of peace and inspiration...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 text-center">
              {errorMsg}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Starter Pills */}
        <div className="pt-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] transition-all whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-2 flex items-center gap-2 border-t border-[var(--theme-border)]"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Share how your day went, ask for motivation, or seek a thought of peace..."
            disabled={isLoading}
            className="flex-1 p-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-[var(--theme-accent)] hover:opacity-90 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
