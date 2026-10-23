import React from 'react';
import { Dialog, Surface, Button, Badge } from '@cloudflare/kumo';
import { Trophy, ArrowCounterClockwise } from '@phosphor-icons/react';
import type { Player } from '../types/darts';

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
  const winner = players.find((p) => p.isWinner) || [...players].sort((a, b) => a.currentScore - b.currentScore)[0];

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => {}}>
      <Dialog size="lg" className="p-6 sm:p-8 flex flex-col items-center bg-kumo-base border border-kumo-line shadow-2xl">
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400 flex items-center justify-center mb-3 shadow-md">
          <Trophy size={36} className="text-amber-400" />
        </div>

        <Dialog.Title className="font-display font-black text-3xl sm:text-4xl text-kumo-default tracking-wider uppercase text-center">
          GAME SHOT
        </Dialog.Title>
        <p className="font-mono text-sm text-kumo-brand font-bold mt-1 text-center">
          {winner ? `WINNER: ${winner.name}` : 'DRAW'}
        </p>

        {/* Players Score Summary */}
        <div className="w-full mt-6 space-y-3">
          {players.map((p, idx) => (
            <Surface
              key={p.id}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                p.id === winner?.id
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : 'bg-kumo-recessed border-kumo-line'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Badge variant={p.id === winner?.id ? 'warning' : 'neutral'} className="font-mono font-bold">
                  #{idx + 1}
                </Badge>
                <div>
                  <h4 className="font-display font-bold text-base text-kumo-default">
                    {p.name}
                  </h4>
                  <div className="flex space-x-2 text-xs font-mono text-kumo-subtle mt-0.5">
                    <span>PPD {p.stats.ppd.toFixed(1)}</span>
                    <span>PPR {p.stats.ppr.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-display font-black text-2xl text-kumo-default">
                  {p.currentScore === 0 ? 'CLEARED' : `${p.currentScore}`}
                </span>
              </div>
            </Surface>
          ))}
        </div>

        {/* Play Again Button */}
        <div className="w-full mt-6">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowCounterClockwise size={20} />}
            onClick={onPlayAgain}
            className="w-full font-display font-bold text-base"
          >
            PLAY AGAIN
          </Button>
        </div>
      </Dialog>
    </Dialog.Root>
  );
};
