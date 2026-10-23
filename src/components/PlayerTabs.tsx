import React from 'react';
import { Surface } from '@cloudflare/kumo';
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
          <Surface
            key={player.id}
            className={`p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              isActive
                ? 'bg-kumo-recessed border-kumo-brand ring-1 ring-kumo-brand shadow-sm'
                : 'bg-kumo-base border-kumo-line opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-kumo-subtle">
                {player.name}
              </span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-kumo-brand animate-pulse"></span>
              )}
            </div>

            <div className="my-1">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-kumo-default">
                {player.currentScore}
              </span>
            </div>

            <div className="text-[10px] font-mono text-kumo-subtle">
              PPD {player.stats.ppd.toFixed(1)}
            </div>
          </Surface>
        );
      })}
    </div>
  );
};
