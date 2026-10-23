import React from 'react';
import type { AwardEvent } from '../types/darts';
import { Flame, Trophy, Sparkle } from '@phosphor-icons/react';

interface AwardNotificationProps {
  award: AwardEvent | null;
}

export const AwardNotification: React.FC<AwardNotificationProps> = ({ award }) => {
  if (!award) return null;

  const isSuperAward = award.type === 'TON_80' || award.type === 'HAT_TRICK';

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
      <div className="relative animate-bounce">
        <div
          className={`px-8 py-5 rounded-2xl border flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl transition-all ${
            isSuperAward
              ? 'bg-amber-950/90 border-amber-400 text-amber-200'
              : 'bg-kumo-base/95 border-kumo-brand text-kumo-brand'
          }`}
        >
          <div className="flex items-center space-x-2 mb-1">
            {isSuperAward ? (
              <Flame size={32} className="text-amber-400 animate-pulse" />
            ) : (
              <Sparkle size={32} className="text-kumo-brand animate-spin" />
            )}
            <span className="font-display font-black text-3xl sm:text-4xl tracking-widest uppercase">
              {award.title}
            </span>
            {isSuperAward ? (
              <Trophy size={32} className="text-amber-400 animate-pulse" />
            ) : (
              <Sparkle size={32} className="text-kumo-brand animate-spin" />
            )}
          </div>

          <p className="font-mono text-sm sm:text-base font-bold text-white mt-1">
            {award.subtitle}
          </p>

          <span className="text-xs font-mono text-slate-300 mt-2 px-3 py-0.5 rounded-full bg-black/40 border border-white/20">
            {award.playerName}
          </span>
        </div>
      </div>
    </div>
  );
};
