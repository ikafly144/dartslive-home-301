import { useState, useCallback, useEffect } from 'react';
import type {
  DartHit,
  Player,
  GameSettings,
  PlayerRound,
  AwardEvent,
  AwardType,
} from '../types/darts';
import type { BoardSignal } from '../types/bluetooth';
import { audio } from '../services/audioService';
import confetti from 'canvas-confetti';

const DEFAULT_SETTINGS: GameSettings = {
  initialScore: 301,
  maxRounds: 10,
  bullRule: 'fat',
  finishRule: 'open',
  inRule: 'open',
  autoChange: false,
  soundEnabled: true,
};

const createInitialPlayers = (count: number, initialScore: number): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${i + 1}`,
    name: `PLAYER ${i + 1}`,
    currentScore: initialScore,
    rounds: [],
    currentRoundDarts: [],
    isWinner: false,
    hasIn: false,
    stats: {
      totalThrows: 0,
      totalScore: 0,
      ppd: 0,
      ppr: 0,
      awards: {
        lowTon: 0,
        highTon: 0,
        hatTrick: 0,
        ton80: 0,
        threeInABed: 0,
      },
    },
  }));
};

export function useDartGame(initialPlayerCount: number = 1) {
  const [playerCount, setPlayerCount] = useState<number>(initialPlayerCount);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [players, setPlayers] = useState<Player[]>(() =>
    createInitialPlayers(initialPlayerCount, DEFAULT_SETTINGS.initialScore)
  );
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isCurrentRoundBust, setIsCurrentRoundBust] = useState<boolean>(false);
  const [waitingForChange, setWaitingForChange] = useState<boolean>(false);
  const [roundStartScore, setRoundStartScore] = useState<number>(DEFAULT_SETTINGS.initialScore);
  const [lastHit, setLastHit] = useState<DartHit | null>(null);
  const [awardEvent, setAwardEvent] = useState<AwardEvent | null>(null);

  // Sync sound settings with AudioService
  useEffect(() => {
    audio.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const activePlayer = players[activePlayerIndex];

  // Helper to trigger award
  const triggerAward = useCallback((type: AwardType, title: string, subtitle: string, player: Player) => {
    audio.playAward();
    const event: AwardEvent = {
      id: Math.random().toString(36).substring(7),
      type,
      title,
      subtitle,
      playerId: player.id,
      playerName: player.name,
    };
    setAwardEvent(event);
    setTimeout(() => {
      setAwardEvent((curr) => (curr?.id === event.id ? null : curr));
    }, 2800);
  }, []);

  // Check awards for 3 darts
  const evaluateAwards = useCallback(
    (darts: DartHit[], roundScore: number, player: Player) => {
      if (darts.length !== 3) return null;

      // Hat Trick: 3 Bulls
      const bullCount = darts.filter((d) => d.baseNumber === 25).length;
      if (bullCount === 3) {
        triggerAward('HAT_TRICK', 'HAT TRICK', '3 Bulls in a Round!', player);
        return 'hatTrick';
      }

      // Ton 80: 3 x T20 (180 points)
      const t20Count = darts.filter((d) => d.baseNumber === 20 && d.multiplier === 3).length;
      if (t20Count === 3) {
        triggerAward('TON_80', 'TON 80', 'Perfect 180 Points!', player);
        return 'ton80';
      }

      // Three in a Bed: 3 in same Double or same Triple
      if (
        darts[0].baseNumber === darts[1].baseNumber &&
        darts[1].baseNumber === darts[2].baseNumber &&
        darts[0].multiplier === darts[1].multiplier &&
        (darts[0].multiplier === 2 || darts[0].multiplier === 3)
      ) {
        triggerAward('THREE_IN_A_BED', 'THREE IN A BED', `3 x ${darts[0].label}!`, player);
        return 'threeInABed';
      }

      // High Ton: 151 - 180
      if (roundScore >= 151) {
        triggerAward('HIGH_TON', 'HIGH TON', `${roundScore} Points!`, player);
        return 'highTon';
      }

      // Low Ton: 100 - 150
      if (roundScore >= 100) {
        triggerAward('LOW_TON', 'LOW TON', `${roundScore} Points!`, player);
        return 'lowTon';
      }

      return null;
    },
    [triggerAward]
  );

  // Handle dart throw
  const processDartThrow = useCallback(
    (hit: DartHit) => {
      if (isGameOver || waitingForChange) {
        return;
      }

      setPlayers((prevPlayers) => {
        const player = prevPlayers[activePlayerIndex];
        const roundDarts = [...player.currentRoundDarts];

        if (roundDarts.length >= 3) {
          return prevPlayers; // Already 3 darts thrown
        }

        let isHitValidForIn = player.hasIn;
        if (!player.hasIn) {
          if (settings.inRule === 'open') {
            isHitValidForIn = true;
          } else if (settings.inRule === 'master') {
            isHitValidForIn = hit.multiplier === 2 || hit.multiplier === 3 || hit.baseNumber === 25;
          } else if (settings.inRule === 'double') {
            isHitValidForIn = hit.multiplier === 2 || hit.segmentId === 0x52;
          }
        }

        const effectiveHitScore = isHitValidForIn ? hit.score : 0;
        const newScore = player.currentScore - effectiveHitScore;
        const newRoundDarts = [...roundDarts, hit];
        setLastHit(hit);

        // Sound effect
        const isBull = hit.baseNumber === 25;
        audio.playHit(hit.multiplier, isBull);

        // 1. Check Game Shot (Win)
        let isWinningThrow = false;
        if (newScore === 0) {
          if (settings.finishRule === 'open') {
            isWinningThrow = true;
          } else if (settings.finishRule === 'master') {
            isWinningThrow = hit.multiplier === 2 || hit.multiplier === 3 || hit.baseNumber === 25;
          } else if (settings.finishRule === 'double') {
            isWinningThrow = hit.multiplier === 2 || hit.segmentId === 0x52;
          }
        }

        if (isWinningThrow) {
          // WIN!
          audio.playVictory();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });

          setIsGameOver(true);
          setWaitingForChange(false);

          return prevPlayers.map((p, idx) => {
            if (idx === activePlayerIndex) {
              const totalThrows = p.stats.totalThrows + 1;
              const totalScore = p.stats.totalScore + effectiveHitScore;
              return {
                ...p,
                currentScore: 0,
                currentRoundDarts: newRoundDarts,
                isWinner: true,
                hasIn: true,
                stats: {
                  ...p.stats,
                  totalThrows,
                  totalScore,
                  ppd: Number((totalScore / totalThrows).toFixed(2)),
                  ppr: Number(((totalScore / totalThrows) * 3).toFixed(2)),
                },
              };
            }
            return p;
          });
        }

        // 2. Check Bust
        let isBust = false;
        if (newScore < 0) {
          isBust = true;
        } else if (newScore === 1 && (settings.finishRule === 'double' || settings.finishRule === 'master')) {
          isBust = true;
        } else if (newScore === 0 && !isWinningThrow) {
          // Reached 0 without required multiplier
          isBust = true;
        }

        if (isBust) {
          audio.playBust();
          setIsCurrentRoundBust(true);
          setWaitingForChange(true);

          return prevPlayers.map((p, idx) => {
            if (idx === activePlayerIndex) {
              return {
                ...p,
                currentScore: roundStartScore, // revert to round start score
                currentRoundDarts: newRoundDarts,
              };
            }
            return p;
          });
        }

        // 3. Normal hit
        const isRoundFinished = newRoundDarts.length === 3;
        if (isRoundFinished) {
          setWaitingForChange(true);
          const roundTotalScore = newRoundDarts.reduce((acc, d) => acc + d.score, 0);
          evaluateAwards(newRoundDarts, roundTotalScore, player);

          if (settings.autoChange) {
            setTimeout(() => {
              changeRound();
            }, 1200);
          }
        }

        return prevPlayers.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return {
              ...p,
              currentScore: newScore,
              currentRoundDarts: newRoundDarts,
              hasIn: isHitValidForIn,
            };
          }
          return p;
        });
      });
    },
    [
      isGameOver,
      waitingForChange,
      activePlayerIndex,
      settings,
      roundStartScore,
      evaluateAwards,
    ]
  );

  // Undo last dart in the current round
  const undoLastDart = useCallback(() => {
    if (isGameOver || activePlayer.currentRoundDarts.length === 0) return;

    setPlayers((prevPlayers) => {
      const player = prevPlayers[activePlayerIndex];
      const darts = [...player.currentRoundDarts];
      const removedDart = darts.pop();
      if (!removedDart) return prevPlayers;

      // Recalculate currentScore from roundStartScore
      const remainingDartsScore = darts.reduce((acc, d) => acc + d.score, 0);
      const restoredScore = roundStartScore - remainingDartsScore;

      setIsCurrentRoundBust(false);
      setWaitingForChange(false);
      setLastHit(darts[darts.length - 1] || null);

      return prevPlayers.map((p, idx) => {
        if (idx === activePlayerIndex) {
          return {
            ...p,
            currentScore: restoredScore,
            currentRoundDarts: darts,
          };
        }
        return p;
      });
    });
  }, [isGameOver, activePlayer, activePlayerIndex, roundStartScore]);

  // Change round / Next player
  const changeRound = useCallback(() => {
    if (isGameOver) return;

    audio.playChange();

    setPlayers((prevPlayers) => {
      const player = prevPlayers[activePlayerIndex];
      const darts = player.currentRoundDarts;
      const roundDartsScore = isCurrentRoundBust ? 0 : darts.reduce((acc, d) => acc + d.score, 0);
      const throwsCount = darts.length;

      const completedRound: PlayerRound = {
        roundNumber: currentRound,
        darts: [...darts],
        roundScore: roundDartsScore,
        scoreBeforeRound: roundStartScore,
        scoreAfterRound: player.currentScore,
        isBust: isCurrentRoundBust,
      };

      const updatedRounds = [...player.rounds, completedRound];
      const totalThrows = player.stats.totalThrows + throwsCount;
      const totalScore = player.stats.totalScore + roundDartsScore;
      const ppd = totalThrows > 0 ? Number((totalScore / totalThrows).toFixed(2)) : 0;
      const ppr = totalThrows > 0 ? Number(((totalScore / totalThrows) * 3).toFixed(2)) : 0;

      const updatedPlayers = prevPlayers.map((p, idx) => {
        if (idx === activePlayerIndex) {
          return {
            ...p,
            rounds: updatedRounds,
            currentRoundDarts: [],
            stats: {
              ...p.stats,
              totalThrows,
              totalScore,
              ppd,
              ppr,
            },
          };
        }
        return p;
      });

      return updatedPlayers;
    });

    // Advance to next player
    const nextPlayerIndex = (activePlayerIndex + 1) % playerCount;
    const isNewRound = nextPlayerIndex === 0;
    const nextRoundNumber = isNewRound ? currentRound + 1 : currentRound;

    setActivePlayerIndex(nextPlayerIndex);
    setIsCurrentRoundBust(false);
    setWaitingForChange(false);
    setLastHit(null);

    if (isNewRound) {
      if (nextRoundNumber > settings.maxRounds) {
        // Game reached round limit!
        setIsGameOver(true);
        audio.playVictory();
        return;
      }
      setCurrentRound(nextRoundNumber);
    }

    // Update round start score for next player
    setRoundStartScore(players[nextPlayerIndex].currentScore);
  }, [
    isGameOver,
    activePlayerIndex,
    isCurrentRoundBust,
    currentRound,
    roundStartScore,
    playerCount,
    settings.maxRounds,
    players,
  ]);

  // Reset / New Game
  const resetGame = useCallback(
    (newPlayerCount?: number, newSettings?: Partial<GameSettings>) => {
      const effectiveCount = newPlayerCount ?? playerCount;
      const mergedSettings = { ...settings, ...(newSettings || {}) };

      setPlayerCount(effectiveCount);
      setSettings(mergedSettings);
      setPlayers(createInitialPlayers(effectiveCount, mergedSettings.initialScore));
      setActivePlayerIndex(0);
      setCurrentRound(1);
      setIsGameOver(false);
      setIsCurrentRoundBust(false);
      setWaitingForChange(false);
      setRoundStartScore(mergedSettings.initialScore);
      setLastHit(null);
      setAwardEvent(null);
    },
    [playerCount, settings]
  );

  // Incoming signal from board (BLE or Virtual Board)
  const handleBoardSignal = useCallback(
    (signal: BoardSignal) => {
      if (signal.type === 'change') {
        changeRound();
      } else if (signal.type === 'hit') {
        processDartThrow(signal.hit);
      }
    },
    [changeRound, processDartThrow]
  );

  return {
    players,
    playerCount,
    activePlayerIndex,
    activePlayer,
    currentRound,
    isGameOver,
    isCurrentRoundBust,
    waitingForChange,
    lastHit,
    settings,
    awardEvent,
    setSettings,
    processDartThrow,
    undoLastDart,
    changeRound,
    resetGame,
    handleBoardSignal,
  };
}
