import React, { useState } from 'react';
import { Dialog, Button, Switch } from '@cloudflare/kumo';
import { X, Check } from '@phosphor-icons/react';
import type { GameSettings } from '../types/darts';

interface SettingsModalProps {
  isOpen: boolean;
  currentSettings: GameSettings;
  playerCount: number;
  onClose: () => void;
  onSave: (newPlayerCount: number, newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentSettings,
  playerCount,
  onClose,
  onSave,
}) => {
  const [selectedCount, setSelectedCount] = useState<number>(playerCount);
  const [settings, setSettings] = useState<GameSettings>(currentSettings);

  const handleApply = () => {
    onSave(selectedCount, settings);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog size="base" className="p-6 bg-kumo-base border border-kumo-line">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-kumo-line">
          <Dialog.Title className="font-display font-bold text-lg text-kumo-default">
            SETTINGS
          </Dialog.Title>
          <Dialog.Close
            render={(props) => (
              <Button
                {...props}
                variant="ghost"
                shape="square"
                size="sm"
                icon={<X size={16} />}
                aria-label="Close"
              />
            )}
          />
        </div>

        {/* Settings Body */}
        <div className="py-4 space-y-4 text-sm">
          {/* Player Count */}
          <div>
            <label className="block text-xs font-mono text-kumo-subtle mb-1.5 uppercase font-bold">
              PLAYERS
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((cnt) => (
                <Button
                  key={cnt}
                  variant={selectedCount === cnt ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCount(cnt)}
                  className="font-display font-bold"
                >
                  {cnt}P
                </Button>
              ))}
            </div>
          </div>

          {/* Bull Rule */}
          <div>
            <label className="block text-xs font-mono text-kumo-subtle mb-1.5 uppercase font-bold">
              BULL
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={settings.bullRule === 'fat' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSettings({ ...settings, bullRule: 'fat' })}
                className="font-bold"
              >
                50 / 50
              </Button>
              <Button
                variant={settings.bullRule === 'separate' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSettings({ ...settings, bullRule: 'separate' })}
                className="font-bold"
              >
                25 / 50
              </Button>
            </div>
          </div>

          {/* Finish Rule */}
          <div>
            <label className="block text-xs font-mono text-kumo-subtle mb-1.5 uppercase font-bold">
              FINISH
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['open', 'master', 'double'] as const).map((rule) => (
                <Button
                  key={rule}
                  variant={settings.finishRule === rule ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSettings({ ...settings, finishRule: rule })}
                  className="font-bold capitalize"
                >
                  {rule} Out
                </Button>
              ))}
            </div>
          </div>

          {/* Max Rounds */}
          <div>
            <label className="block text-xs font-mono text-kumo-subtle mb-1.5 uppercase font-bold">
              ROUNDS
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((rounds) => (
                <Button
                  key={rounds}
                  variant={settings.maxRounds === rounds ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSettings({ ...settings, maxRounds: rounds })}
                  className="font-bold"
                >
                  {rounds}
                </Button>
              ))}
            </div>
          </div>

          {/* Auto Change Toggle with Kumo Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-kumo-line bg-kumo-recessed">
            <span className="font-bold text-xs uppercase font-mono text-kumo-default">
              AUTO CHANGE
            </span>
            <Switch
              checked={settings.autoChange}
              onClick={() => setSettings({ ...settings, autoChange: !settings.autoChange })}
              aria-label="Auto Change"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-kumo-line flex items-center justify-end space-x-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Check size={16} />}
            onClick={handleApply}
          >
            APPLY
          </Button>
        </div>
      </Dialog>
    </Dialog.Root>
  );
};
