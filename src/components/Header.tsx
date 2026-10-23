import React from 'react';
import { Bluetooth, BluetoothConnected, Settings as SettingsIcon, RotateCcw, Volume2, VolumeX, Eye, EyeOff, X } from 'lucide-react';
import type { BluetoothConnectionState } from '../types/bluetooth';

interface HeaderProps {
  connectionState: BluetoothConnectionState;
  deviceName: string | null;
  errorMessage: string | null;
  isBluetoothSupported: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showVirtualBoard: boolean;
  onToggleVirtualBoard: () => void;
  onOpenSettings: () => void;
  onResetGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionState,
  deviceName,
  errorMessage,
  isBluetoothSupported,
  onConnect,
  onDisconnect,
  soundEnabled,
  onToggleSound,
  showVirtualBoard,
  onToggleVirtualBoard,
  onOpenSettings,
  onResetGame,
}) => {
  return (
    <header className="w-full bg-dart-surface/90 backdrop-blur border-b border-dart-border px-4 py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dart-cyan to-blue-600 flex items-center justify-center shadow-neon-cyan">
            <span className="font-display font-black text-sm text-black tracking-tight">DL</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold tracking-wider text-lg text-white">
              DARTSLIVE
            </span>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-dart-card border border-dart-border text-dart-cyan rounded">
              301
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Bluetooth Connection Status */}
          {isBluetoothSupported && (
            connectionState === 'connected' ? (
              <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-600/50 px-2.5 py-1.5 rounded-lg text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <BluetoothConnected className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-mono font-bold truncate max-w-[100px]">
                  {deviceName || 'ONLINE'}
                </span>
                <button
                  onClick={onDisconnect}
                  className="text-slate-400 hover:text-red-400 p-0.5 transition"
                  aria-label="Disconnect"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={connectionState === 'connecting'}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-dart-card hover:bg-slate-700/80 active:scale-95 transition border border-dart-cyan/40 hover:border-dart-cyan text-dart-cyan rounded-lg text-xs font-semibold shadow-sm hover:shadow-neon-cyan disabled:opacity-50"
              >
                <Bluetooth className={`w-3.5 h-3.5 ${connectionState === 'connecting' ? 'animate-spin' : ''}`} />
                <span>{connectionState === 'connecting' ? 'CONNECTING' : 'CONNECT'}</span>
              </button>
            )
          )}

          {/* Toggle Virtual Board */}
          <button
            onClick={onToggleVirtualBoard}
            className={`p-2 rounded-lg border transition ${
              showVirtualBoard
                ? 'bg-dart-card border-dart-cyan text-dart-cyan shadow-neon-cyan'
                : 'bg-dart-card border-dart-border text-slate-400 hover:text-white'
            }`}
            aria-label="Toggle Board"
          >
            {showVirtualBoard ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 bg-dart-card hover:bg-slate-700 border border-dart-border text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-dart-cyan" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset Game */}
          <button
            onClick={onResetGame}
            className="p-2 bg-dart-card hover:bg-red-950/60 border border-dart-border hover:border-red-600 text-slate-400 hover:text-red-300 rounded-lg transition"
            aria-label="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-dart-card hover:bg-slate-700 border border-dart-border text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtle Error Banner if any */}
      {errorMessage && (
        <div className="max-w-6xl mx-auto mt-2 px-3 py-1.5 bg-red-900/40 border border-red-700 text-red-200 text-xs rounded-md flex items-center justify-between">
          <span>{errorMessage}</span>
        </div>
      )}
    </header>
  );
};
