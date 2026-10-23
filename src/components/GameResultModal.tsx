import React from 'react';
import type { Player } from '../types/darts';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameResultModalProps {
  isOpen: boolean;
  players: Player[];
  onPlayAgain: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  players,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  // Find winner(s)
  const winner = players.find((p) => p.isWinner) || [...players].sort((a, b) => a.currentScore - b.currentScore)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-dart-card border-2 border-dart-border rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mb-3 shadow-neon-yellow">
          <Trophy className="w-9 h-9 text-amber-400" />
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider uppercase">
          GAME SHOT!
        </h2>
        <p className="font-mono text-sm text-dart-cyan font-bold mt-1">
          WINNER: {winner?.name || 'DRAW'}
        </p>

        {/* Players Score Summary */}
        <div className="w-full mt-6 space-y-3">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                p.id === winner?.id
                  ? 'bg-amber-950/40 border-amber-500/60'
                  : 'bg-dart-surface/60 border-dart-border'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-display font-bold text-sm text-slate-400">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    {p.name}
                  </h4>
                  <div className="flex space-x-3 text-xs font-mono text-slate-400">
                    <span>PPD: <strong className="text-dart-cyan">{p.stats.ppd.toFixed(1)}</strong></span>
                    <span>PPR: <strong className="text-dart-neonGreen">{p.stats.ppr.toFixed(1)}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-display font-black text-2xl text-white">
                  {p.currentScore === 0 ? 'CLEARED' : `${p.currentScore} left`}
                </span>
                <p className="text-[10px] font-mono text-slate-400">
                  {p.rounds.length} Rounds
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-dart-cyan to-blue-600 hover:opacity-90 active:scale-95 text-black font-display font-black tracking-wider text-lg rounded-xl shadow-neon-cyan flex items-center justify-center space-x-2 transition"
        >
          <RotateCcw className="w-5 h-5 text-black" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
