import React from 'react';
import { Button } from '@cloudflare/kumo';
import { ArrowBendUpLeft, Prohibit, ArrowRight } from '@phosphor-icons/react';

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
      <Button
        variant="secondary"
        size="lg"
        disabled={!canUndo}
        onClick={onUndo}
        icon={<ArrowBendUpLeft size={18} />}
        className="flex-1 font-bold"
      >
        UNDO
      </Button>

      {/* Miss Button */}
      <Button
        variant="secondary"
        size="lg"
        disabled={waitingForChange}
        onClick={onMiss}
        icon={<Prohibit size={18} />}
        className="flex-1 font-bold"
      >
        MISS
      </Button>

      {/* Change Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onChange}
        icon={<ArrowRight size={18} />}
        className={`flex-[1.5] font-bold font-display tracking-wider uppercase transition-all ${
          waitingForChange
            ? '!bg-red-600 hover:!bg-red-500 !ring-red-400 text-white animate-pulse shadow-lg'
            : ''
        }`}
      >
        CHANGE
      </Button>
    </div>
  );
};
