import React, { useState } from 'react';
import { trendData } from '../../mock/db';
import { formatCurrency } from '../../lib/format';

export const CustomLineChart: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 24, right: 32, bottom: 36, left: 48 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Max value calculation
  const maxVal = 500; // comfortably covers max contributions $430

  // Points mapping
  const pointsContributions = trendData.map((d, i) => {
    const x = padding.left + (i / (trendData.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.contributions / maxVal) * graphHeight;
    return { x, y, data: d };
  });

  const pointsWinnings = trendData.map((d, i) => {
    const x = padding.left + (i / (trendData.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.winnings / maxVal) * graphHeight;
    return { x, y, data: d };
  });

  const pathContrib = pointsContributions
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const pathWinnings = pointsWinnings
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const activePoint = hoverIndex !== null ? trendData[hoverIndex] : null;

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-display font-medium text-[#1B2420]">
            Contribution & Prize Trajectory
          </h4>
          <p className="text-xs text-[#7C867F]">
            Last 8 weeks · Settled on Base
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-[#4A5650]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2C4A3E]" />
            <span>Contributions ($430.00)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B08A4E]" />
            <span>Winnings ($212.40)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full bg-[#FBF9F5] border border-[#DDD8CD] rounded-md p-4 overflow-hidden">
        {/* Active hover tooltip display */}
        {activePoint && hoverIndex !== null && (
          <div
            className="absolute top-3 left-4 bg-[#FFFFFF] border border-[#DDD8CD] px-3 py-1.5 rounded shadow-sm text-xs pointer-events-none flex items-center gap-3 z-10 animate-in fade-in"
          >
            <span className="font-semibold text-[#1B2420]">{activePoint.week}</span>
            <span className="text-[#2C4A3E]">
              Contrib: {formatCurrency(activePoint.contributions)}
            </span>
            <span className="text-[#B08A4E]">
              Won: {formatCurrency(activePoint.winnings)}
            </span>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[500px] select-none"
            aria-label="Line chart comparing lifetime pool contributions against winnings over the past 8 weeks"
          >
            {/* Horizontal Grid lines */}
            {[0, 125, 250, 375, 500].map((val) => {
              const y = padding.top + graphHeight - (val / maxVal) * graphHeight;
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#DDD8CD"
                    strokeWidth="1"
                    strokeDasharray={val === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#7C867F"
                    className="font-mono tabular-nums"
                  >
                    ${val}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {pointsContributions.map((p, i) => (
              <text
                key={p.data.week}
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                fontSize="11"
                fill={hoverIndex === i ? '#1B2420' : '#7C867F'}
                fontWeight={hoverIndex === i ? '600' : '400'}
                className="font-mono"
              >
                {p.data.week}
              </text>
            ))}

            {/* Line: Contributions */}
            <path
              d={pathContrib}
              fill="none"
              stroke="#2C4A3E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line: Winnings */}
            <path
              d={pathWinnings}
              fill="none"
              stroke="#B08A4E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive hover column overlays */}
            {pointsContributions.map((p, i) => {
              const pw = pointsWinnings[i];
              const isHovered = hoverIndex === i;

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible target area */}
                  <rect
                    x={p.x - graphWidth / (trendData.length * 2)}
                    y={padding.top}
                    width={graphWidth / trendData.length}
                    height={graphHeight}
                    fill="transparent"
                  />

                  {/* Vertical guide line on hover */}
                  {isHovered && (
                    <line
                      x1={p.x}
                      y1={padding.top}
                      x2={p.x}
                      y2={padding.top + graphHeight}
                      stroke="#C7C1B3"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Contributions dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    fill="#FBF9F5"
                    stroke="#2C4A3E"
                    strokeWidth="2"
                  />

                  {/* Winnings dot */}
                  <circle
                    cx={pw.x}
                    cy={pw.y}
                    r={isHovered ? 5 : 3.5}
                    fill="#FBF9F5"
                    stroke="#B08A4E"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
