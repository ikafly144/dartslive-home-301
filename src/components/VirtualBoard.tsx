import React, { useMemo } from 'react';
import type { DartHit } from '../types/darts';
import { getSegmentId } from '../services/dartMath';

interface VirtualBoardProps {
  lastHit: DartHit | null;
  onSegmentClick: (segmentId: number) => void;
  onChangeClick: () => void;
}

const SECTOR_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

// Generate SVG arc path between two radii and two angles in degrees
const describeArc = (
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startRad = toRad(startAngle);
  const endRad = toRad(endAngle);

  const x1 = x + outerRadius * Math.cos(startRad);
  const y1 = y + outerRadius * Math.sin(startRad);
  const x2 = x + outerRadius * Math.cos(endRad);
  const y2 = y + outerRadius * Math.sin(endRad);

  const x3 = x + innerRadius * Math.cos(endRad);
  const y3 = y + innerRadius * Math.sin(endRad);
  const x4 = x + innerRadius * Math.cos(startRad);
  const y4 = y + innerRadius * Math.sin(startRad);

  return [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
};

export const VirtualBoard: React.FC<VirtualBoardProps> = ({
  lastHit,
  onSegmentClick,
  onChangeClick,
}) => {
  const center = 200;
  const rDoubleBull = 8;
  const rSingleBull = 20;
  const rInnerSingleStart = 20;
  const rTripleStart = 100;
  const rTripleEnd = 114;
  const rOuterSingleStart = 114;
  const rDoubleStart = 162;
  const rDoubleEnd = 175;
  const rBoardEdge = 200;

  const segments = useMemo(() => {
    return SECTOR_ORDER.map((num, i) => {
      const angleCenter = -90 + i * 18;
      const angleStart = angleCenter - 9;
      const angleEnd = angleCenter + 9;

      // Color rules:
      // Even index (0, 2, 4...) -> Red/Black
      // Odd index (1, 3, 5...) -> Green/Cream
      const isRedOrGreen = i % 2 === 0 ? '#D8262C' : '#0F7A3D';
      const singleColor = i % 2 === 0 ? '#1A1A1A' : '#E6DEC8';

      // Text position for number
      const textRad = (angleCenter * Math.PI) / 180;
      const textX = center + 188 * Math.cos(textRad);
      const textY = center + 188 * Math.sin(textRad);

      const innerSingleId = getSegmentId(num, 'inner_single');
      const outerSingleId = getSegmentId(num, 'outer_single');
      const tripleId = getSegmentId(num, 'triple');
      const doubleId = getSegmentId(num, 'double');

      return {
        num,
        angleCenter,
        textX,
        textY,
        doublePath: describeArc(center, center, rDoubleStart, rDoubleEnd, angleStart, angleEnd),
        outerSinglePath: describeArc(center, center, rOuterSingleStart, rDoubleStart, angleStart, angleEnd),
        triplePath: describeArc(center, center, rTripleStart, rTripleEnd, angleStart, angleEnd),
        innerSinglePath: describeArc(center, center, rInnerSingleStart, rTripleStart, angleStart, angleEnd),
        ringColor: isRedOrGreen,
        singleColor,
        ids: {
          innerSingleId,
          outerSingleId,
          tripleId,
          doubleId,
        },
      };
    });
  }, []);

  const isSegmentActive = (segId: number) => {
    return lastHit && lastHit.segmentId === segId;
  };

  return (
    <div className="w-full flex flex-col items-center p-3 bg-dart-surface/70 border border-dart-border rounded-2xl backdrop-blur">
      <div className="flex items-center justify-between w-full max-w-sm mb-2 px-1 text-xs text-slate-400 font-mono">
        <span className="font-bold text-white">VIRTUAL DARTBOARD</span>
        <span>クリックでヒット入力</span>
      </div>

      <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] select-none cursor-pointer"
        >
          {/* Outer Black Casing & Numbers background */}
          <circle cx={center} cy={center} r={rBoardEdge} fill="#0d0d0f" stroke="#252c3b" strokeWidth="3" />

          {/* Sectors */}
          {segments.map((seg) => (
            <g key={seg.num}>
              {/* Double Ring */}
              <path
                d={seg.doublePath}
                fill={isSegmentActive(seg.ids.doubleId) ? '#00F0FF' : seg.ringColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.doubleId)}
              >
                <title>{`D${seg.num} (Double)`}</title>
              </path>

              {/* Outer Single */}
              <path
                d={seg.outerSinglePath}
                fill={isSegmentActive(seg.ids.outerSingleId) ? '#00F0FF' : seg.singleColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.outerSingleId)}
              >
                <title>{`S${seg.num} (Outer Single)`}</title>
              </path>

              {/* Triple Ring */}
              <path
                d={seg.triplePath}
                fill={isSegmentActive(seg.ids.tripleId) ? '#00F0FF' : seg.ringColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.tripleId)}
              >
                <title>{`T${seg.num} (Triple)`}</title>
              </path>

              {/* Inner Single */}
              <path
                d={seg.innerSinglePath}
                fill={isSegmentActive(seg.ids.innerSingleId) ? '#00F0FF' : seg.singleColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.innerSingleId)}
              >
                <title>{`S${seg.num} (Inner Single)`}</title>
              </path>

              {/* Wire Number on Outer Rim */}
              <text
                x={seg.textX}
                y={seg.textY + 4}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill="#FFFFFF"
                fontFamily="sans-serif"
                pointerEvents="none"
              >
                {seg.num}
              </text>
            </g>
          ))}

          {/* Outer Bull (Single Bull, 81) */}
          <circle
            cx={center}
            cy={center}
            r={rSingleBull}
            fill={isSegmentActive(0x51) ? '#00F0FF' : '#0F7A3D'}
            stroke="#222"
            strokeWidth="0.8"
            className="hover:opacity-80 transition cursor-pointer"
            onClick={() => onSegmentClick(0x51)}
          >
            <title>Outer Bull (25 / 50)</title>
          </circle>

          {/* Inner Bull (Double Bull, 82) */}
          <circle
            cx={center}
            cy={center}
            r={rDoubleBull}
            fill={isSegmentActive(0x52) ? '#00F0FF' : '#D8262C'}
            stroke="#222"
            strokeWidth="0.8"
            className="hover:opacity-80 transition cursor-pointer"
            onClick={() => onSegmentClick(0x52)}
          >
            <title>Double Bull (50)</title>
          </circle>
        </svg>
      </div>

      {/* Manual Input Buttons */}
      <div className="flex items-center space-x-2 mt-3 w-full max-w-sm justify-center">
        <button
          onClick={() => onSegmentClick(0)}
          className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 font-bold text-xs rounded-lg transition"
        >
          MISS (0点)
        </button>
        <button
          onClick={() => onSegmentClick(0x51)}
          className="py-1.5 px-3 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs rounded-lg transition"
        >
          BULL (50/25)
        </button>
        <button
          onClick={() => onSegmentClick(0x52)}
          className="py-1.5 px-3 bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 font-bold text-xs rounded-lg transition"
        >
          D-BULL (50)
        </button>
        <button
          onClick={onChangeClick}
          className="py-1.5 px-3 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-xs rounded-lg shadow-neon-red transition"
        >
          CHANGE
        </button>
      </div>
    </div>
  );
};
