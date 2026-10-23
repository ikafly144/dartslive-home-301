import React from 'react';
import { Button, Badge } from '@cloudflare/kumo';
import {
  Bluetooth,
  Gear,
  ArrowCounterClockwise,
  SpeakerHigh,
  SpeakerSimpleX,
  Eye,
  EyeSlash,
  X,
} from '@phosphor-icons/react';
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
    <header className="w-full bg-kumo-base/90 backdrop-blur border-b border-kumo-line px-4 py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kumo-brand to-blue-600 flex items-center justify-center shadow-md">
            <span className="font-display font-black text-sm text-white tracking-tight">DL</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold tracking-wider text-lg text-kumo-default">
              DARTSLIVE
            </span>
            <Badge variant="primary" className="font-mono font-bold">
              301
            </Badge>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Bluetooth Connection Status */}
          {isBluetoothSupported && (
            connectionState === 'connected' ? (
              <div className="flex items-center space-x-1.5 pl-2.5 pr-1 py-1 rounded-lg border border-kumo-line bg-kumo-recessed text-xs">
                <Badge variant="green" appearance="dot" className="font-mono font-semibold max-w-[120px] truncate">
                  {deviceName || 'ONLINE'}
                </Badge>
                <Button
                  variant="ghost"
                  shape="square"
                  size="xs"
                  icon={<X size={12} />}
                  onClick={onDisconnect}
                  aria-label="Disconnect"
                />
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={<Bluetooth size={16} className={connectionState === 'connecting' ? 'animate-spin' : ''} />}
                onClick={onConnect}
                loading={connectionState === 'connecting'}
              >
                CONNECT
              </Button>
            )
          )}

          {/* Toggle Virtual Board */}
          <Button
            variant={showVirtualBoard ? 'primary' : 'secondary'}
            shape="square"
            size="sm"
            icon={showVirtualBoard ? <Eye size={18} /> : <EyeSlash size={18} />}
            onClick={onToggleVirtualBoard}
            aria-label="Toggle Board"
          />

          {/* Sound Toggle */}
          <Button
            variant="secondary"
            shape="square"
            size="sm"
            icon={soundEnabled ? <SpeakerHigh size={18} /> : <SpeakerSimpleX size={18} />}
            onClick={onToggleSound}
            aria-label="Toggle Sound"
          />

          {/* Reset Game */}
          <Button
            variant="secondary"
            shape="square"
            size="sm"
            icon={<ArrowCounterClockwise size={18} />}
            onClick={onResetGame}
            aria-label="Reset Game"
          />

          {/* Settings Modal */}
          <Button
            variant="secondary"
            shape="square"
            size="sm"
            icon={<Gear size={18} />}
            onClick={onOpenSettings}
            aria-label="Settings"
          />
        </div>
      </div>

      {/* Subtle Error Banner if any */}
      {errorMessage && (
        <div className="max-w-6xl mx-auto mt-2 px-3 py-1.5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-md flex items-center justify-between">
          <span>{errorMessage}</span>
        </div>
      )}
    </header>
  );
};
