import type { DartHit, BullRule, SegmentMultiplier } from '../types/darts';

export const parseSegment = (segmentId: number, bullRule: BullRule = 'fat'): DartHit | null => {
  // Miss
  if (segmentId === 0) {
    return {
      segmentId: 0,
      baseNumber: 0,
      multiplier: 1,
      score: 0,
      label: 'MISS',
    };
  }

  // Bull
  if (segmentId === 0x51) {
    // 81: Outer Bull (Single Bull)
    return {
      segmentId: 0x51,
      baseNumber: 25,
      multiplier: 1,
      score: bullRule === 'fat' ? 50 : 25,
      label: 'BULL',
    };
  }

  if (segmentId === 0x52) {
    // 82: Inner Bull (Double Bull)
    return {
      segmentId: 0x52,
      baseNumber: 25,
      multiplier: 2,
      score: 50,
      label: 'D-BULL',
    };
  }

  // Standard Segments 1 - 80
  if (segmentId >= 1 && segmentId <= 80) {
    const baseNumber = ((segmentId - 1) % 20) + 1;
    const group = Math.floor((segmentId - 1) / 20);

    let multiplier: SegmentMultiplier = 1;
    let label = `S${baseNumber}`;
    let isInner = false;

    if (group === 0) {
      // Inner Single
      multiplier = 1;
      label = `S${baseNumber}`;
      isInner = true;
    } else if (group === 1) {
      // Outer Single
      multiplier = 1;
      label = `S${baseNumber}`;
      isInner = false;
    } else if (group === 2) {
      // Double
      multiplier = 2;
      label = `D${baseNumber}`;
    } else if (group === 3) {
      // Triple
      multiplier = 3;
      label = `T${baseNumber}`;
    }

    return {
      segmentId,
      baseNumber,
      multiplier,
      score: baseNumber * multiplier,
      label,
      isInner,
    };
  }

  return null;
};

/**
 * Helper to get segmentId from baseNumber and ring type
 * Used for VirtualBoard clicks
 */
export const getSegmentId = (
  baseNumber: number,
  ring: 'inner_single' | 'outer_single' | 'double' | 'triple' | 'single_bull' | 'double_bull'
): number => {
  if (ring === 'single_bull') return 0x51;
  if (ring === 'double_bull') return 0x52;

  const offset = baseNumber; // 1..20
  switch (ring) {
    case 'inner_single':
      return offset; // 1..20
    case 'outer_single':
      return 20 + offset; // 21..40
    case 'double':
      return 40 + offset; // 41..60
    case 'triple':
      return 60 + offset; // 61..80
  }
};
