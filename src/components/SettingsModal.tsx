import React, { useState } from 'react';
import type { GameSettings } from '../types/darts';
import { X, Check } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleApply = () => {
    onSave(selectedCount, settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-dart-card border border-dart-border rounded-2xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dart-border">
          <h3 className="font-display font-bold text-lg text-white">ゲーム設定</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
          {/* Player Count */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">プレイヤー人数</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setSelectedCount(cnt)}
                  className={`py-2 rounded-lg font-display font-bold text-sm border transition ${
                    selectedCount === cnt
                      ? 'bg-dart-cyan text-black border-dart-cyan shadow-neon-cyan'
                      : 'bg-dart-surface border-dart-border text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cnt}P
                </button>
              ))}
            </div>
          </div>

          {/* Bull Rule */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Bull 設定</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSettings({ ...settings, bullRule: 'fat' })}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                  settings.bullRule === 'fat'
                    ? 'bg-dart-cyan text-black border-dart-cyan shadow-neon-cyan'
                    : 'bg-dart-surface border-dart-border text-slate-300 hover:bg-slate-800'
                }`}
              >
                Fat Bull (50 / 50)
              </button>
              <button
                onClick={() => setSettings({ ...settings, bullRule: 'separate' })}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                  settings.bullRule === 'separate'
                    ? 'bg-dart-cyan text-black border-dart-cyan shadow-neon-cyan'
                    : 'bg-dart-surface border-dart-border text-slate-300 hover:bg-slate-800'
                }`}
              >
                Separate Bull (25 / 50)
              </button>
            </div>
          </div>

          {/* Finish Rule */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">フィニッシュ (Out) ルール</label>
            <div className="grid grid-cols-3 gap-2">
              {(['open', 'master', 'double'] as const).map((rule) => (
                <button
                  key={rule}
                  onClick={() => setSettings({ ...settings, finishRule: rule })}
                  className={`py-2 rounded-lg text-xs font-bold border capitalize transition ${
                    settings.finishRule === rule
                      ? 'bg-dart-cyan text-black border-dart-cyan shadow-neon-cyan'
                      : 'bg-dart-surface border-dart-border text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {rule} Out
                </button>
              ))}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              {settings.finishRule === 'open' && 'どのセグメントでも0点にすればクリア'}
              {settings.finishRule === 'master' && '最後は Double, Triple, または Bull でクリア'}
              {settings.finishRule === 'double' && '最後は Double または Double Bull でクリア'}
            </p>
          </div>

          {/* Max Rounds */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">最大ラウンド数</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((rounds) => (
                <button
                  key={rounds}
                  onClick={() => setSettings({ ...settings, maxRounds: rounds })}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    settings.maxRounds === rounds
                      ? 'bg-dart-cyan text-black border-dart-cyan shadow-neon-cyan'
                      : 'bg-dart-surface border-dart-border text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {rounds} Rounds
                </button>
              ))}
            </div>
          </div>

          {/* Auto Change Toggle */}
          <div className="flex items-center justify-between p-3 bg-dart-surface rounded-xl border border-dart-border">
            <div>
              <span className="font-bold text-white text-xs block">3投後自動チェンジ</span>
              <span className="text-[11px] text-slate-400">3投完了時に自動で次プレイヤーへ移行</span>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoChange: !settings.autoChange })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                settings.autoChange ? 'bg-dart-cyan' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-black w-4 h-4 rounded-full shadow-md transform transition ${
                  settings.autoChange ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-dart-border flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition"
          >
            キャンセル
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-dart-cyan hover:opacity-90 active:scale-95 text-black rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-neon-cyan transition"
          >
            <Check className="w-4 h-4" />
            <span>設定を適用して開始</span>
          </button>
        </div>
      </div>
    </div>
  );
};
