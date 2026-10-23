import { describe, it, expect } from 'vitest';
import { parseSegment, getSegmentId } from './dartMath';

describe('dartMath - Segment Parsing', () => {
  it('parses miss (0)', () => {
    const hit = parseSegment(0);
    expect(hit).toEqual({
      segmentId: 0,
      baseNumber: 0,
      multiplier: 1,
      score: 0,
      label: 'MISS',
    });
  });

  it('parses single bull (0x51) in fat bull mode', () => {
    const hit = parseSegment(0x51, 'fat');
    expect(hit?.score).toBe(50);
    expect(hit?.label).toBe('BULL');
    expect(hit?.baseNumber).toBe(25);
  });

  it('parses single bull (0x51) in separate bull mode', () => {
    const hit = parseSegment(0x51, 'separate');
    expect(hit?.score).toBe(25);
    expect(hit?.label).toBe('BULL');
    expect(hit?.baseNumber).toBe(25);
  });

  it('parses double bull (0x52)', () => {
    const hit = parseSegment(0x52);
    expect(hit?.score).toBe(50);
    expect(hit?.label).toBe('D-BULL');
    expect(hit?.multiplier).toBe(2);
  });

  it('parses Inner Singles (1 to 20)', () => {
    // 0x01 = 1 = S1_I
    const hit1 = parseSegment(1);
    expect(hit1?.label).toBe('S1');
    expect(hit1?.score).toBe(1);
    expect(hit1?.isInner).toBe(true);

    // 0x14 = 20 = S20_I
    const hit20 = parseSegment(20);
    expect(hit20?.label).toBe('S20');
    expect(hit20?.score).toBe(20);
    expect(hit20?.isInner).toBe(true);
  });

  it('parses Outer Singles (21 to 40)', () => {
    // 0x15 = 21 = S1_O
    const hit1 = parseSegment(21);
    expect(hit1?.label).toBe('S1');
    expect(hit1?.score).toBe(1);
    expect(hit1?.isInner).toBe(false);

    // 0x28 = 40 = S20_O
    const hit20 = parseSegment(40);
    expect(hit20?.label).toBe('S20');
    expect(hit20?.score).toBe(20);
    expect(hit20?.isInner).toBe(false);
  });

  it('parses Doubles (41 to 60)', () => {
    // 0x29 = 41 = D1
    const hit1 = parseSegment(41);
    expect(hit1?.label).toBe('D1');
    expect(hit1?.score).toBe(2);
    expect(hit1?.multiplier).toBe(2);

    // 0x3c = 60 = D20
    const hit20 = parseSegment(60);
    expect(hit20?.label).toBe('D20');
    expect(hit20?.score).toBe(40);
    expect(hit20?.multiplier).toBe(2);
  });

  it('parses Triples (61 to 80)', () => {
    // 0x3d = 61 = T1
    const hit1 = parseSegment(61);
    expect(hit1?.label).toBe('T1');
    expect(hit1?.score).toBe(3);
    expect(hit1?.multiplier).toBe(3);

    // 0x50 = 80 = T20
    const hit20 = parseSegment(80);
    expect(hit20?.label).toBe('T20');
    expect(hit20?.score).toBe(60);
    expect(hit20?.multiplier).toBe(3);
  });

  it('correctly maps getSegmentId back and forth', () => {
    expect(getSegmentId(20, 'triple')).toBe(80);
    expect(getSegmentId(20, 'double')).toBe(60);
    expect(getSegmentId(20, 'outer_single')).toBe(40);
    expect(getSegmentId(20, 'inner_single')).toBe(20);
    expect(getSegmentId(1, 'inner_single')).toBe(1);
    expect(getSegmentId(25, 'single_bull')).toBe(0x51);
    expect(getSegmentId(25, 'double_bull')).toBe(0x52);
  });
});
