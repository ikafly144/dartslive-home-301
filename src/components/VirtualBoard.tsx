import React, { useMemo } from 'react';
import { Surface, Button } from '@cloudflare/kumo';
import type { DartHit } from '../types/darts';
import { getSegmentId } from '../services/dartMath';

interface VirtualBoardProps {
  lastHit: DartHit | null;
  onSegmentClick: (segmentId: number) => void;
  onChangeClick: () => void;
}

const SECTOR_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

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

      const isRedOrGreen = i % 2 === 0 ? '#D8262C' : '#0F7A3D';
      const singleColor = i % 2 === 0 ? '#1A1A1A' : '#E6DEC8';

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
    <Surface className="w-full flex flex-col items-center p-4 rounded-2xl border border-kumo-line bg-kumo-base shadow-xl backdrop-blur">
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
                fill={isSegmentActive(seg.ids.doubleId) ? '#F38020' : seg.ringColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.doubleId)}
              />

              {/* Outer Single */}
              <path
                d={seg.outerSinglePath}
                fill={isSegmentActive(seg.ids.outerSingleId) ? '#F38020' : seg.singleColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.outerSingleId)}
              />

              {/* Triple Ring */}
              <path
                d={seg.triplePath}
                fill={isSegmentActive(seg.ids.tripleId) ? '#F38020' : seg.ringColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.tripleId)}
              />

              {/* Inner Single */}
              <path
                d={seg.innerSinglePath}
                fill={isSegmentActive(seg.ids.innerSingleId) ? '#F38020' : seg.singleColor}
                stroke="#333"
                strokeWidth="0.5"
                className="hover:opacity-80 transition"
                onClick={() => onSegmentClick(seg.ids.innerSingleId)}
              />

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

          {/* Outer Bull */}
          <circle
            cx={center}
            cy={center}
            r={rSingleBull}
            fill={isSegmentActive(0x51) ? '#F38020' : '#0F7A3D'}
            stroke="#222"
            strokeWidth="0.8"
            className="hover:opacity-80 transition cursor-pointer"
            onClick={() => onSegmentClick(0x51)}
          />

          {/* Inner Bull */}
          <circle
            cx={center}
            cy={center}
            r={rDoubleBull}
            fill={isSegmentActive(0x52) ? '#F38020' : '#D8262C'}
            stroke="#222"
            strokeWidth="0.8"
            className="hover:opacity-80 transition cursor-pointer"
            onClick={() => onSegmentClick(0x52)}
          />
        </svg>
      </div>

      {/* Manual Input Buttons with Kumo */}
      <div className="flex items-center space-x-2 mt-4 w-full max-w-sm justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSegmentClick(0)}
          className="flex-1 font-bold"
        >
          MISS
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSegmentClick(0x51)}
          className="font-bold"
        >
          BULL
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSegmentClick(0x52)}
          className="font-bold"
        >
          D-BULL
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onChangeClick}
          className="font-bold !bg-red-600 hover:!bg-red-500 text-white"
        >
          CHANGE
        </Button>
      </div>
    </Surface>
  );
};
