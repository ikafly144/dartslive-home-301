import React from 'react';
import { Undo2, Ban, ArrowRightCircle } from 'lucide-react';

interface ControlPanelProps {
  waitingForChange: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onChange: () => void;
  onMiss: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  waitingForChange,
  canUndo,
  onUndo,
  onChange,
  onMiss,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-3 mt-4">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="flex items-center justify-center space-x-1.5 px-4 py-3 bg-dart-card hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none border border-dart-border text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition flex-1"
        title="直前の1投を取り消す"
      >
        <Undo2 className="w-4 h-4" />
        <span>1投取消</span>
      </button>

      {/* Miss Button */}
      <button
        onClick={onMiss}
        disabled={waitingForChange}
        className="flex items-center justify-center space-x-1.5 px-4 py-3 bg-dart-card hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none border border-dart-border text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition flex-1"
        title="盤外・無得点"
      >
        <Ban className="w-4 h-4 text-slate-400" />
        <span>MISS</span>
      </button>

      {/* Big DARTSLIVE Red CHANGE Button */}
      <button
        onClick={onChange}
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-display font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-200 active:scale-95 flex-[1.5] shadow-lg ${
          waitingForChange
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border border-rose-400 shadow-neon-red animate-pulse'
            : 'bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-200 hover:text-white'
        }`}
      >
        <ArrowRightCircle className="w-5 h-5" />
        <span>CHANGE</span>
      </button>
    </div>
  );
};
