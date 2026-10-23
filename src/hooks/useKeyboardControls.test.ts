import { describe, it, expect } from 'vitest';
import { resolveKeyAction } from './useKeyboardControls';

describe('resolveKeyAction', () => {
  it('detects miss keys (m, M, 0)', () => {
    expect(resolveKeyAction({ key: 'm' })).toBe('miss');
    expect(resolveKeyAction({ key: 'M' })).toBe('miss');
    expect(resolveKeyAction({ key: '0' })).toBe('miss');
  });

  it('detects change keys (Space, Enter, c, C)', () => {
    expect(resolveKeyAction({ key: ' ' })).toBe('change');
    expect(resolveKeyAction({ key: 'Enter' })).toBe('change');
    expect(resolveKeyAction({ key: 'c' })).toBe('change');
    expect(resolveKeyAction({ key: 'C' })).toBe('change');
  });

  it('detects undo keys (Backspace, u, U, Ctrl+Z, Cmd+Z)', () => {
    expect(resolveKeyAction({ key: 'Backspace' })).toBe('undo');
    expect(resolveKeyAction({ key: 'u' })).toBe('undo');
    expect(resolveKeyAction({ key: 'U' })).toBe('undo');
    expect(resolveKeyAction({ key: 'z', ctrlKey: true })).toBe('undo');
    expect(resolveKeyAction({ key: 'z', metaKey: true })).toBe('undo');
  });

  it('detects single bull and double bull keys (b, Shift+B)', () => {
    expect(resolveKeyAction({ key: 'b' })).toBe('bull');
    expect(resolveKeyAction({ key: 'B', shiftKey: true })).toBe('dbull');
    expect(resolveKeyAction({ key: 'b', shiftKey: true })).toBe('dbull');
  });

  it('ignores keys when typing in input or textarea', () => {
    expect(resolveKeyAction({ key: 'm', target: { tagName: 'INPUT' } })).toBeNull();
    expect(resolveKeyAction({ key: ' ', target: { tagName: 'TEXTAREA' } })).toBeNull();
    expect(resolveKeyAction({ key: 'Backspace', target: { isContentEditable: true } })).toBeNull();
  });

  it('returns null for unrelated keys', () => {
    expect(resolveKeyAction({ key: 'a' })).toBeNull();
    expect(resolveKeyAction({ key: 'Escape' })).toBeNull();
    expect(resolveKeyAction({ key: 'ArrowDown' })).toBeNull();
  });
});
