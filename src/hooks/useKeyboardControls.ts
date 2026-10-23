import { useEffect } from 'react';

export type KeyAction = 'miss' | 'change' | 'undo' | 'bull' | 'dbull';

export interface KeyActionContext {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  target?: EventTarget | { tagName?: string; isContentEditable?: boolean } | null;
}

export function resolveKeyAction(event: KeyActionContext): KeyAction | null {
  const target = event.target as { tagName?: string; isContentEditable?: boolean } | null;
  if (
    target &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable)
  ) {
    return null;
  }

  const key = event.key;

  // Miss: 'm', 'M', or '0'
  if (key === 'm' || key === 'M' || key === '0') {
    return 'miss';
  }

  // Change: Space, Enter, 'c', 'C'
  if (key === ' ' || key === 'Enter' || key === 'c' || key === 'C') {
    return 'change';
  }

  // Undo: Backspace, 'u', 'U', Ctrl/Cmd + Z
  if (
    key === 'Backspace' ||
    key === 'u' ||
    key === 'U' ||
    ((event.ctrlKey || event.metaKey) && (key === 'z' || key === 'Z'))
  ) {
    return 'undo';
  }

  // Bull
  if (key === 'b' || key === 'B') {
    return event.shiftKey ? 'dbull' : 'bull';
  }

  return null;
}

interface KeyboardControlOptions {
  enabled?: boolean;
  onMiss: () => void;
  onChange: () => void;
  onUndo: () => void;
  onBull?: (isDouble: boolean) => void;
}

export function useKeyboardControls({
  enabled = true,
  onMiss,
  onChange,
  onUndo,
  onBull,
}: KeyboardControlOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const action = resolveKeyAction(event);
      if (!action) return;

      event.preventDefault();

      switch (action) {
        case 'miss':
          onMiss();
          break;
        case 'change':
          onChange();
          break;
        case 'undo':
          onUndo();
          break;
        case 'bull':
          if (onBull) onBull(false);
          break;
        case 'dbull':
          if (onBull) onBull(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onMiss, onChange, onUndo, onBull]);
}
