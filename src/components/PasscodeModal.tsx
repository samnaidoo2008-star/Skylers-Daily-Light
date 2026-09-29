import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { checkPasscode, setPasscode, removePasscode } from '../utils/storage';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasPin: boolean;
  isLocked: boolean;
  onUnlockSuccess: () => void;
  onPinConfigChanged: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  hasPin,
  isLocked,
  onUnlockSuccess,
  onPinConfigChanged
}) => {
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [isSettingNewPin, setIsSettingNewPin] = useState(!hasPin);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4) {
      setErrorMsg('Please enter a 4-digit PIN');
      return;
    }
    const ok = await checkPasscode(pinInput);
    if (ok) {
      setErrorMsg('');
      setPinInput('');
      onUnlockSuccess();
      onClose();
    } else {
      setErrorMsg('Incorrect PIN. Please try again.');
      setPinInput('');
    }
  };

  const handleSaveNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setErrorMsg('PIN must be exactly 4 numeric digits');
      return;
    }
    if (pinInput !== confirmPinInput) {
      setErrorMsg('PIN confirmation does not match');
      return;
    }

    const saved = await setPasscode(pinInput);
    if (saved) {
      setErrorMsg('');
      setPinInput('');
      setConfirmPinInput('');
      setIsSettingNewPin(false);
      onPinConfigChanged();
      onClose();
    }
  };

  const handleRemovePin = () => {
    if (window.confirm('Remove PIN lock? Your diary will be accessible without a passcode on this browser.')) {
      removePasscode();
      onPinConfigChanged();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[var(--theme-card)] text-[var(--theme-text-primary)] rounded-3xl p-6 shadow-2xl border border-[var(--theme-border)] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] flex items-center justify-center text-[var(--theme-accent)]">
              {isLocked ? <Lock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-[var(--theme-text-primary)]">
                {hasPin && isLocked
                  ? 'Unlock Private Diary'
                  : hasPin
                  ? 'Diary Security'
                  : 'Set Up 4-Digit PIN'}
              </h2>
              <p className="text-xs text-[var(--theme-text-muted)]">
                {hasPin && isLocked
                  ? 'Enter your PIN to access reflections'
                  : 'Protect your intimate prayers & thoughts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--theme-card-subtle)] text-[var(--theme-text-muted)] flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-500">
            {errorMsg}
          </div>
        )}

        {/* Mode A: Enter PIN to Unlock */}
        {hasPin && isLocked && !isSettingNewPin && (
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-semibold text-[var(--theme-text-muted)]">
                Enter 4-Digit Passcode
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-40 mx-auto text-center text-2xl tracking-[0.5em] py-2.5 px-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-[var(--theme-text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-[var(--theme-accent)] hover:opacity-90 transition-all shadow-xs cursor-pointer"
            >
              Unlock Diary
            </button>
          </form>
        )}

        {/* Mode B: Configure / Change PIN when already unlocked */}
        {hasPin && !isLocked && !isSettingNewPin && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--theme-accent-subtle)] border border-[var(--theme-accent-border)] space-y-1">
              <p className="text-xs font-semibold text-[var(--theme-accent)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Diary PIN Protection is Active</span>
              </p>
              <p className="text-[11px] text-[var(--theme-text-primary)] opacity-80">
                Your entries can be locked with a single tap whenever you step away.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsSettingNewPin(true)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] hover:border-[var(--theme-accent)] transition-colors cursor-pointer"
              >
                Change 4-Digit PIN
              </button>
              <button
                type="button"
                onClick={handleRemovePin}
                className="w-full py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                Remove PIN Protection
              </button>
            </div>
          </div>
        )}

        {/* Mode C: Set New PIN */}
        {isSettingNewPin && (
          <form onSubmit={handleSaveNewPin} className="space-y-3">
            <div className="space-y-1 text-center">
              <label className="text-xs font-semibold text-[var(--theme-text-muted)]">
                Choose 4-Digit Passcode
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-40 mx-auto text-center text-2xl tracking-[0.5em] py-2 px-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-[var(--theme-text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
              />
            </div>

            <div className="space-y-1 text-center">
              <label className="text-xs font-semibold text-[var(--theme-text-muted)]">
                Confirm 4-Digit Passcode
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPinInput}
                onChange={e => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-40 mx-auto text-center text-2xl tracking-[0.5em] py-2 px-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card-subtle)] text-[var(--theme-text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
              />
            </div>

            <div className="pt-2 flex gap-2">
              {hasPin && (
                <button
                  type="button"
                  onClick={() => setIsSettingNewPin(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[var(--theme-card-subtle)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-[var(--theme-accent)] hover:opacity-90 transition-all shadow-xs cursor-pointer"
              >
                Set PIN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
