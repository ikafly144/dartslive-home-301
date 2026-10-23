import React from 'react';
import type { AwardEvent } from '../types/darts';
import { Flame, Trophy, Sparkles } from 'lucide-react';

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
          className={`px-8 py-5 rounded-2xl border-2 flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl transition-all ${
            isSuperAward
              ? 'bg-gradient-to-r from-amber-950/90 via-red-950/90 to-purple-950/90 border-amber-400 text-amber-200 shadow-neon-yellow'
              : 'bg-gradient-to-r from-cyan-950/90 via-blue-950/90 to-slate-900/90 border-dart-cyan text-cyan-200 shadow-neon-cyan'
          }`}
        >
          <div className="flex items-center space-x-2 mb-1">
            {isSuperAward ? (
              <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
            ) : (
              <Sparkles className="w-8 h-8 text-dart-cyan animate-spin" />
            )}
            <span className="font-display font-black text-3xl sm:text-4xl tracking-widest uppercase drop-shadow-md">
              {award.title}
            </span>
            {isSuperAward ? (
              <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
            ) : (
              <Sparkles className="w-8 h-8 text-dart-cyan animate-spin" />
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
