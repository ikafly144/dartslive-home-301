import { useState } from 'react';
import { useDartGame } from './hooks/useDartGame';
import { useBluetoothBoard } from './hooks/useBluetoothBoard';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { PlayerTabs } from './components/PlayerTabs';
import { VirtualBoard } from './components/VirtualBoard';
import { ControlPanel } from './components/ControlPanel';
import { AwardNotification } from './components/AwardNotification';
import { GameResultModal } from './components/GameResultModal';
import { SettingsModal } from './components/SettingsModal';
import type { GameSettings } from './types/darts';

export function App() {
  const [showVirtualBoard, setShowVirtualBoard] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const game = useDartGame(1);

  const bluetooth = useBluetoothBoard(game.settings.bullRule, (signal) => {
    game.handleBoardSignal(signal);
  });

  const handleApplySettings = (newCount: number, newSettings: GameSettings) => {
    game.resetGame(newCount, newSettings);
  };

  const handleToggleSound = () => {
    game.setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  return (
    <div className="min-h-screen bg-dart-bg flex flex-col text-slate-100">
      {/* Header */}
      <Header
        connectionState={bluetooth.state}
        deviceName={bluetooth.deviceName}
        errorMessage={bluetooth.errorMessage}
        isBluetoothSupported={bluetooth.isSupported}
        onConnect={bluetooth.connect}
        onDisconnect={bluetooth.disconnect}
        soundEnabled={game.settings.soundEnabled}
        onToggleSound={handleToggleSound}
        showVirtualBoard={showVirtualBoard}
        onToggleVirtualBoard={() => setShowVirtualBoard((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetGame={() => game.resetGame()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-start">
        {/* Multi-player Tabs */}
        <PlayerTabs
          players={game.players}
          activePlayerIndex={game.activePlayerIndex}
        />

        {/* Game Arena Layout */}
        <div className={`w-full grid gap-6 items-start mt-2 ${showVirtualBoard ? 'lg:grid-cols-12' : 'max-w-xl mx-auto'}`}>
          {/* Left/Main Column: Score Display & Controls */}
          <div className={showVirtualBoard ? 'lg:col-span-7 flex flex-col items-center' : 'w-full flex flex-col items-center'}>
            <ScoreBoard
              player={game.activePlayer}
              currentRound={game.currentRound}
              maxRounds={game.settings.maxRounds}
              isBust={game.isCurrentRoundBust}
              waitingForChange={game.waitingForChange}
              settings={game.settings}
            />

            <ControlPanel
              waitingForChange={game.waitingForChange}
              canUndo={game.activePlayer.currentRoundDarts.length > 0 && !game.isGameOver}
              onUndo={game.undoLastDart}
              onChange={game.changeRound}
              onMiss={() => bluetooth.emitMockSegment(0)}
            />
          </div>

          {/* Right Column: Virtual Dartboard */}
          {showVirtualBoard && (
            <div className="lg:col-span-5 flex flex-col items-center">
              <VirtualBoard
                lastHit={game.lastHit}
                onSegmentClick={(segmentId) => bluetooth.emitMockSegment(segmentId)}
                onChangeClick={() => game.changeRound()}
              />
            </div>
          )}
        </div>
      </main>

      {/* Award Celebration Toast */}
      <AwardNotification award={game.awardEvent} />

      {/* Game Result Modal */}
      <GameResultModal
        isOpen={game.isGameOver}
        players={game.players}
        onPlayAgain={() => game.resetGame()}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        currentSettings={game.settings}
        playerCount={game.playerCount}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleApplySettings}
      />
    </div>
  );
}

export default App;
