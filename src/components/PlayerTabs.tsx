import React from 'react';
import type { Player } from '../types/darts';

interface PlayerTabsProps {
  players: Player[];
  activePlayerIndex: number;
}

export const PlayerTabs: React.FC<PlayerTabsProps> = ({ players, activePlayerIndex }) => {
  if (players.length <= 1) return null;

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
      {players.map((player, idx) => {
        const isActive = idx === activePlayerIndex;

        return (
          <div
            key={player.id}
            className={`p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              isActive
                ? 'bg-dart-card border-dart-cyan shadow-neon-cyan'
                : 'bg-dart-surface/60 border-dart-border/80 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-slate-300">
                {player.name}
              </span>
              {isActive && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-dart-cyan text-black rounded">
                  THROWING
                </span>
              )}
            </div>

            <div className="my-1">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
                {player.currentScore}
              </span>
            </div>

            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>PPD: {player.stats.ppd.toFixed(1)}</span>
              <span>Rounds: {player.rounds.length}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
