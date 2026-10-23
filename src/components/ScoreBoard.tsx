import React from 'react';
import type { Player, GameSettings } from '../types/darts';

interface ScoreBoardProps {
  player: Player;
  currentRound: number;
  maxRounds: number;
  isBust: boolean;
  waitingForChange: boolean;
  settings: GameSettings;
}

// Simple checkout suggestion lookup for common finishes
const getCheckoutSuggestion = (score: number, finishRule: GameSettings['finishRule']): string | null => {
  if (score <= 1 || score > 170) return null;

  if (finishRule === 'double') {
    if (score === 50) return 'D-BULL (50)';
    if (score <= 40 && score % 2 === 0) return `D${score / 2} (${score})`;
    if (score === 38) return 'D19 (38)';
    if (score === 34) return 'D17 (34)';
    if (score === 30) return 'D15 (30)';
    if (score === 60) return 'S20 ➔ D20';
    if (score === 70) return 'T10 ➔ D20';
    if (score === 80) return 'T20 ➔ D10';
    if (score === 90) return 'T20 ➔ D15';
    if (score === 100) return 'T20 ➔ D20';
  } else {
    // Open out or Master out
    if (score <= 20) return `S${score}`;
    if (score === 50) return 'BULL';
    if (score <= 40 && score % 2 === 0) return `D${score / 2}`;
    if (score <= 60 && score % 3 === 0) return `T${score / 3}`;
  }
  return null;
};

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  player,
  currentRound,
  maxRounds,
  isBust,
  waitingForChange,
  settings,
}) => {
  const currentDarts = player.currentRoundDarts;
  const roundTotal = isBust ? 0 : currentDarts.reduce((acc, d) => acc + d.score, 0);
  const suggestion = getCheckoutSuggestion(player.currentScore, settings.finishRule);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Round & Game Info Bar */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 mb-2 px-1">
        <div className="flex items-center space-x-2">
          <span className="bg-dart-card border border-dart-border px-2.5 py-1 rounded text-white font-bold">
            ROUND {currentRound} / {maxRounds}
          </span>
          <span className="text-slate-500 hidden sm:inline">
            {settings.bullRule === 'fat' ? 'Fat Bull (50/50)' : 'Sep Bull (25/50)'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span>PPD: <strong className="text-dart-cyan font-bold">{player.stats.ppd.toFixed(1)}</strong></span>
          <span>PPR: <strong className="text-dart-neonGreen font-bold">{player.stats.ppr.toFixed(1)}</strong></span>
        </div>
      </div>

      {/* Main Score Display Box */}
      <div className="relative w-full bg-gradient-to-b from-dart-card/90 to-dart-surface/90 border-2 border-dart-border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl backdrop-blur">
        {/* Active Player Indicator */}
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-dart-cyan animate-pulse"></div>
          <span className="font-display tracking-widest text-slate-300 font-bold text-sm sm:text-base">
            {player.name}
          </span>
        </div>

        {/* Huge Remaining Score */}
        <div className="relative my-2 sm:my-3">
          {isBust ? (
            <div className="flex flex-col items-center animate-bounce">
              <span className="font-display font-black text-6xl sm:text-8xl tracking-tight text-dart-neonRed drop-shadow-[0_0_20px_rgba(255,42,95,0.7)]">
                BUST!
              </span>
              <span className="text-xs sm:text-sm font-mono text-red-300 mt-1">
                ラウンド開始時の点数に戻りました
              </span>
            </div>
          ) : (
            <div className="flex items-baseline justify-center">
              <span className="font-display font-black text-7xl sm:text-9xl tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all duration-150">
                {player.currentScore}
              </span>
            </div>
          )}

          {/* Checkout Suggestion Pill */}
          {!isBust && suggestion && (
            <div className="mt-2 text-center">
              <span className="inline-block px-3 py-1 bg-dart-surface/80 border border-dart-neonGreen/40 text-dart-neonGreen text-xs sm:text-sm font-mono font-bold rounded-full shadow-neon-green">
                FINISH ➔ {suggestion}
              </span>
            </div>
          )}
        </div>

        {/* Current Round Darts Slots (1st, 2nd, 3rd) */}
        <div className="w-full max-w-md grid grid-cols-3 gap-3 mt-4 sm:mt-6">
          {[0, 1, 2].map((slotIndex) => {
            const dart = currentDarts[slotIndex];
            const isCurrentThrowingSlot = currentDarts.length === slotIndex && !waitingForChange;

            return (
              <div
                key={slotIndex}
                className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 ${
                  dart
                    ? 'bg-dart-surface/90 border-dart-cyan/60 shadow-neon-cyan'
                    : isCurrentThrowingSlot
                    ? 'bg-dart-card/80 border-dart-cyan animate-pulse-slow'
                    : 'bg-dart-surface/40 border-dart-border/60'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  DART {slotIndex + 1}
                </span>

                {dart ? (
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-display font-bold text-lg sm:text-xl ${
                        dart.baseNumber === 25
                          ? 'text-dart-neonRed drop-shadow-[0_0_8px_rgba(255,42,95,0.6)]'
                          : dart.multiplier === 3
                          ? 'text-dart-neonYellow'
                          : dart.multiplier === 2
                          ? 'text-dart-neonGreen'
                          : 'text-white'
                      }`}
                    >
                      {dart.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      +{dart.score}
                    </span>
                  </div>
                ) : (
                  <div className="h-10 flex items-center justify-center">
                    <span className="font-mono text-slate-600 text-lg">---</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Round Points Subtotal & Change Notice */}
        <div className="w-full max-w-md flex items-center justify-between text-xs font-mono text-slate-400 mt-4 pt-3 border-t border-dart-border">
          <span>
            ラウンド合計: <strong className="text-white font-bold">{roundTotal}</strong> pts
          </span>
          {waitingForChange && (
            <span className="text-dart-neonYellow animate-pulse font-bold">
              赤ボタンまたはCHANGEを押してください
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
