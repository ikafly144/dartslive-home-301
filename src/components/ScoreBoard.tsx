import React from 'react';
import { Surface, Badge } from '@cloudflare/kumo';
import type { Player, GameSettings } from '../types/darts';

interface ScoreBoardProps {
  player: Player;
  currentRound: number;
  maxRounds: number;
  isBust: boolean;
  waitingForChange: boolean;
  settings: GameSettings;
}

// Checkout suggestion lookup
const getCheckoutSuggestion = (score: number, finishRule: GameSettings['finishRule']): string | null => {
  if (score <= 1 || score > 170) return null;

  if (finishRule === 'double') {
    if (score === 50) return 'D-BULL';
    if (score <= 40 && score % 2 === 0) return `D${score / 2}`;
    if (score === 38) return 'D19';
    if (score === 34) return 'D17';
    if (score === 30) return 'D15';
    if (score === 60) return 'S20 ➔ D20';
    if (score === 70) return 'T10 ➔ D20';
    if (score === 80) return 'T20 ➔ D10';
    if (score === 90) return 'T20 ➔ D15';
    if (score === 100) return 'T20 ➔ D20';
  } else {
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
      {/* Round & Stats Bar */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-kumo-subtle mb-2 px-1">
        <Badge variant="outline" className="font-bold">
          ROUND {currentRound}/{maxRounds}
        </Badge>

        <div className="flex items-center space-x-2">
          <Badge variant="neutral" className="font-mono">
            PPD {player.stats.ppd.toFixed(1)}
          </Badge>
          <Badge variant="neutral" className="font-mono">
            PPR {player.stats.ppr.toFixed(1)}
          </Badge>
        </div>
      </div>

      {/* Main Score Display Surface */}
      <Surface className="relative w-full rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center border border-kumo-line bg-kumo-base shadow-xl backdrop-blur">
        {/* Player Name */}
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-kumo-brand animate-pulse"></div>
          <span className="font-display tracking-widest text-kumo-default font-bold text-sm sm:text-base">
            {player.name}
          </span>
        </div>

        {/* Big Remaining Score */}
        <div className="relative my-2 sm:my-3">
          {isBust ? (
            <div className="flex flex-col items-center animate-bounce">
              <span className="font-display font-black text-6xl sm:text-8xl tracking-tight text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                BUST
              </span>
            </div>
          ) : (
            <div className="flex items-baseline justify-center">
              <span className="font-display font-black text-7xl sm:text-9xl tracking-tight text-kumo-default transition-all duration-150">
                {player.currentScore}
              </span>
            </div>
          )}

          {/* Checkout Suggestion */}
          {!isBust && suggestion && (
            <div className="mt-2 text-center">
              <Badge variant="teal" className="font-mono font-bold text-xs sm:text-sm px-3 py-1">
                {suggestion}
              </Badge>
            </div>
          )}
        </div>

        {/* 3 Dart Throw Slots */}
        <div className="w-full max-w-md grid grid-cols-3 gap-3 mt-4 sm:mt-6">
          {[0, 1, 2].map((slotIndex) => {
            const dart = currentDarts[slotIndex];
            const isCurrentThrowingSlot = currentDarts.length === slotIndex && !waitingForChange;

            return (
              <Surface
                key={slotIndex}
                className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-200 ${
                  dart
                    ? 'bg-kumo-recessed border-kumo-brand ring-1 ring-kumo-brand/30'
                    : isCurrentThrowingSlot
                    ? 'bg-kumo-recessed border-kumo-brand animate-pulse-slow'
                    : 'bg-kumo-base border-kumo-line opacity-60'
                }`}
              >
                {dart ? (
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-display font-bold text-xl sm:text-2xl ${
                        dart.baseNumber === 25
                          ? 'text-red-500'
                          : dart.multiplier === 3
                          ? 'text-amber-400'
                          : dart.multiplier === 2
                          ? 'text-emerald-400'
                          : 'text-kumo-default'
                      }`}
                    >
                      {dart.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-kumo-subtle mt-0.5">
                      +{dart.score}
                    </span>
                  </div>
                ) : (
                  <div className="h-10 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-kumo-line"></span>
                  </div>
                )}
              </Surface>
            );
          })}
        </div>

        {/* Round Points Subtotal */}
        {roundTotal > 0 && !isBust && (
          <div className="mt-4 pt-3 border-t border-kumo-line w-full max-w-md text-center">
            <span className="font-mono text-xs font-bold text-kumo-subtle">
              +{roundTotal}
            </span>
          </div>
        )}
      </Surface>
    </div>
  );
};
