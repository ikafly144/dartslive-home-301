export type SegmentMultiplier = 1 | 2 | 3;

export type SegmentType = 'inner_single' | 'outer_single' | 'double' | 'triple' | 'single_bull' | 'double_bull' | 'miss';

export interface DartHit {
  segmentId: number; // 0 for miss, 1-80, 81 (S-BULL), 82 (D-BULL)
  baseNumber: number; // 1-20, or 25 for bull, or 0 for miss
  multiplier: SegmentMultiplier;
  score: number; // actual calculated points (considering Fat Bull vs Separate Bull)
  label: string; // e.g. "S20", "D20", "T20", "BULL", "D-BULL", "MISS"
  isInner?: boolean;
}

export type BullRule = 'fat' | 'separate'; // fat: S-Bull 50, D-Bull 50; separate: S-Bull 25, D-Bull 50
export type FinishRule = 'open' | 'master' | 'double'; // open: any, master: double/triple/bull, double: double/d-bull
export type InRule = 'open' | 'master' | 'double';

export interface GameSettings {
  initialScore: 301;
  maxRounds: number; // standard 10
  bullRule: BullRule;
  finishRule: FinishRule;
  inRule: InRule;
  autoChange: boolean; // auto change player after 3 darts thrown
  soundEnabled: boolean;
}

export interface PlayerRound {
  roundNumber: number;
  darts: DartHit[];
  roundScore: number;
  scoreBeforeRound: number;
  scoreAfterRound: number;
  isBust: boolean;
}

export interface Player {
  id: string;
  name: string;
  currentScore: number;
  rounds: PlayerRound[];
  currentRoundDarts: DartHit[];
  isWinner: boolean;
  hasIn: boolean; // For In-rules (Master In / Double In)
  stats: {
    totalThrows: number;
    totalScore: number;
    ppd: number; // Points Per Dart
    ppr: number; // Points Per Round
    awards: {
      lowTon: number; // 100-150
      highTon: number; // 151+
      hatTrick: number; // 3 Bulls
      ton80: number; // 3 T20
      threeInABed: number; // 3 identical doubles/triples
      whiteHorse?: number;
    };
  };
}

export type AwardType = 'LOW_TON' | 'HIGH_TON' | 'HAT_TRICK' | 'TON_80' | 'THREE_IN_A_BED';

export interface AwardEvent {
  id: string;
  type: AwardType;
  title: string;
  subtitle: string;
  playerId: string;
  playerName: string;
}
