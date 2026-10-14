import React, { useState, useEffect } from 'react';
import { Calendar, Bot, Video, FileText, Sparkles, Workflow } from 'lucide-react';

export const HeroPipelineVisual: React.FC = () => {
  const [scenario, setScenario] = useState<number>(0);
  const [tokenPosition, setTokenPosition] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const scenarios = [
    {
      id: 0,
      title: 'Healthy Run',
      caption: 'Normal call: Google Meet invite → Recall bot joined → transcribed → analyzed → Monday board updated in 1.4s',
      color: '#3F7D5B',
      failingNode: null,
      signalTag: null
    },
    {
      id: 1,
      title: 'Lobby Timeout',
      caption: 'Missed call: Host admitted attendees 11 mins in. Bot self-terminated after 10-minute waiting room timeout.',
      color: '#A8433A',
      failingNode: 2, // Bot joined node
      signalTag: null
    },
    {
      id: 2,
      title: 'Contextual Signal',
      caption: 'Signal intelligence: "delay launch because of legal" → Risk flagged. Past vendor anecdotes ignored.',
      color: '#B4643C',
      failingNode: null,
      signalTag: 'Risk Signal: Legal Delay (+7d)'
    }
  ];

  const currentScenario = scenarios[scenario];

  useEffect(() => {
    // Loop through 3 scenarios every 6 seconds
    const interval = setInterval(() => {
      setScenario((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Animate traveling token dot
  useEffect(() => {
    setTokenPosition(0);
    const targetEnd = currentScenario.failingNode !== null ? currentScenario.failingNode : 5;

    const t1 = setTimeout(() => setTokenPosition(1), 500);
    const t2 = setTimeout(() => {
      if (targetEnd >= 2) setTokenPosition(2);
    }, 1100);
    const t3 = setTimeout(() => {
      if (targetEnd >= 3) setTokenPosition(3);
    }, 1700);
    const t4 = setTimeout(() => {
      if (targetEnd >= 4) setTokenPosition(4);
    }, 2300);
    const t5 = setTimeout(() => {
      if (targetEnd >= 5) setTokenPosition(5);
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [scenario]);

  const nodes = [
    { id: 0, label: 'Calendar', icon: Calendar, check: 'Verify: Recurring RRules, sync webhook, confirmed status' },
    { id: 1, label: 'Bot Dispatch', icon: Bot, check: 'Verify: Recall.ai API response, join credentials, OAuth refresh' },
    { id: 2, label: 'Bot In Lobby', icon: Video, check: 'Verify: Waiting room timeout, host admittance latency, audio stream' },
    { id: 3, label: 'Transcript', icon: FileText, check: 'Verify: Webhook delivery 200 OK, payload size, retries' },
    { id: 4, label: 'LLM Analysis', icon: Sparkles, check: 'Verify: Contextual sentiment, commitment quotes, few-shot negatives' },
    { id: 5, label: 'Monday.com', icon: Workflow, check: 'Verify: Column ID mappings, GraphQL mutations, board rate limits' }
  ];

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_4px_16px_rgba(30,42,43,0.06)] relative overflow-hidden">
      {/* Scenario header banner */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E2DDD3]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentScenario.color }} />
          <span className="text-xs font-mono uppercase tracking-wider text-[#7B8786]">
            Scenario {scenario + 1} of 3: <strong className="text-[#1E2A2B]">{currentScenario.title}</strong>
          </span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                scenario === s ? 'bg-[#1F4B4A] scale-125' : 'bg-[#E2DDD3]'
              }`}
              title={`Switch to scenario ${s + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 6 Nodes in a Row Joined by Hairline Connectors */}
      <div className="relative py-8 flex items-center justify-between px-2">
        {/* Hairline connecting line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-[#E2DDD3]" />

        {/* Highlighted active connecting line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[2px] bg-[#1F4B4A] transition-all duration-500"
          style={{ width: `${(tokenPosition / 5) * 88}%` }}
        />

        {nodes.map((node, i) => {
          const Icon = node.icon;
          const isFailing = currentScenario.failingNode === i && tokenPosition >= i;
          const isPassed = tokenPosition >= i && !isFailing && (currentScenario.failingNode === null || i < currentScenario.failingNode);
          const isTokenHere = tokenPosition === i;

          return (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              {/* Node Circle */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  isFailing
                    ? 'bg-[#F5DEDA] border-2 border-[#A8433A] text-[#A8433A] scale-110 shadow-[0_0_0_4px_rgba(168,67,58,0.2)]'
                    : isPassed
                    ? 'bg-[#E1EEE6] border-2 border-[#3F7D5B] text-[#3F7D5B]'
                    : isTokenHere
                    ? 'bg-[#E3EDEB] border-2 border-[#1F4B4A] text-[#1F4B4A]'
                    : 'bg-[#FFFFFF] border-2 border-[#CFC8BB] text-[#7B8786]'
                }`}
              >
                <Icon className="w-4 h-4" />

                {/* Traveling token dot */}
                {isTokenHere && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#1F4B4A] border-2 border-white animate-bounce" />
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] font-medium text-[#1E2A2B] mt-2 whitespace-nowrap">
                {node.label}
              </span>

              {/* Special tag for scenario 3 on LLM node */}
              {i === 4 && currentScenario.signalTag && tokenPosition >= 4 && (
                <div className="absolute -top-8 bg-[#B4643C] text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-sm whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                  {currentScenario.signalTag}
                </div>
              )}

              {/* Hover Tooltip showing what would be checked */}
              {hoveredNode === node.id && (
                <div className="absolute -bottom-14 bg-[#1E2A2B] text-[#F6F3EE] text-[11px] px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-30 pointer-events-none">
                  {node.check}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Caption beneath strip */}
      <div className="mt-4 p-3 bg-[#FBF9F6] border border-[#E2DDD3] rounded-lg flex items-center justify-between text-xs">
        <p className="text-[#4A5757] font-medium leading-relaxed">
          {currentScenario.caption}
        </p>
        <span className="text-[11px] font-mono text-[#7B8786] hidden sm:inline shrink-0 ml-3">
          Hover nodes to see diagnostic checks
        </span>
      </div>
    </div>
  );
};
