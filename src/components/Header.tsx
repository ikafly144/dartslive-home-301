import React from 'react';
import { Bluetooth, BluetoothConnected, BluetoothOff, Settings as SettingsIcon, RotateCcw, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-dart-cyan to-blue-600 flex items-center justify-center shadow-neon-cyan">
            <span className="font-display font-bold text-lg text-black">DL</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-bold tracking-wider text-lg sm:text-xl text-white">
                DARTSLIVE <span className="text-dart-cyan">HOME</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-dart-card border border-dart-border text-dart-neonYellow rounded">
                301
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">BLE Web Bluetooth & Cloudflare Pages</p>
          </div>
        </div>

        {/* Action Controls & Bluetooth Status */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Bluetooth Connection Button */}
          {!isBluetoothSupported ? (
            <div
              title="お使いのブラウザはWeb Bluetooth非対応です。Chrome / Edgeをご利用ください。"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/60 border border-red-800 text-red-300 rounded-lg text-xs"
            >
              <BluetoothOff className="w-4 h-4 text-red-400" />
              <span>BLE非対応</span>
            </div>
          ) : connectionState === 'connected' ? (
            <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-600/50 px-3 py-1.5 rounded-lg text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <BluetoothConnected className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-medium truncate max-w-[120px]">{deviceName || '接続中'}</span>
              <button
                onClick={onDisconnect}
                className="ml-1 text-slate-400 hover:text-red-400 text-xs font-semibold underline"
                title="切断する"
              >
                切断
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={connectionState === 'connecting'}
              className="flex items-center space-x-2 px-3 py-1.5 bg-dart-card hover:bg-slate-700/80 active:scale-95 transition border border-dart-cyan/40 hover:border-dart-cyan text-dart-cyan rounded-lg text-xs font-semibold shadow-sm hover:shadow-neon-cyan disabled:opacity-50"
            >
              <Bluetooth className={`w-4 h-4 ${connectionState === 'connecting' ? 'animate-spin' : ''}`} />
              <span>{connectionState === 'connecting' ? '探索中...' : 'ボード接続'}</span>
            </button>
          )}

          {/* Toggle Virtual Board */}
          <button
            onClick={onToggleVirtualBoard}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition ${
              showVirtualBoard
                ? 'bg-dart-card border-dart-cyan text-dart-cyan shadow-neon-cyan'
                : 'bg-dart-card border-dart-border text-slate-300 hover:text-white'
            }`}
            title="仮想ダーツボード表示切替"
          >
            {showVirtualBoard ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden md:inline">仮想盤</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 bg-dart-card hover:bg-slate-700 border border-dart-border text-slate-300 hover:text-white rounded-lg transition"
            title={soundEnabled ? 'サウンドON' : 'サウンドOFF'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-dart-cyan" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset Game */}
          <button
            onClick={onResetGame}
            className="p-1.5 bg-dart-card hover:bg-red-950/60 border border-dart-border hover:border-red-600 text-slate-300 hover:text-red-300 rounded-lg transition"
            title="ゲームリセット"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 bg-dart-card hover:bg-slate-700 border border-dart-border text-slate-300 hover:text-white rounded-lg transition"
            title="ゲーム設定"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error alert banner if any */}
      {errorMessage && (
        <div className="max-w-6xl mx-auto mt-2 px-3 py-1.5 bg-red-900/40 border border-red-700 text-red-200 text-xs rounded-md flex items-center justify-between">
          <span>{errorMessage}</span>
        </div>
      )}
    </header>
  );
};
