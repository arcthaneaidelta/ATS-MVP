import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { TrendingUp, Clock, Sparkles, Download, ArrowRight } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [rangePreset, setRangePreset] = useState<'today' | '7d' | '30d'>('today');
  const { toast } = useToast();

  const hourlyData = [
    { hour: '11:00', sales: 240, orders: 8 },
    { hour: '12:00', sales: 680, orders: 22 },
    { hour: '13:00', sales: 1150, orders: 38, isPeak: true }, // Peak in clay
    { hour: '14:00', sales: 520, orders: 16 },
    { hour: '17:00', sales: 410, orders: 14 },
    { hour: '18:00', sales: 940, orders: 31 },
    { hour: '19:00', sales: 1280, orders: 42, isPeak: true }, // Peak in clay
    { hour: '20:00', sales: 890, orders: 28 },
  ];

  const topItems = [
    { name: 'Slow-Cooked Short Rib', count: 64, revenue: 1568 },
    { name: 'Lamb Kofta Flatbread', count: 48, revenue: 768 },
    { name: 'Wild Mushroom Risotto', count: 42, revenue: 735 },
    { name: 'House Lemonade', count: 96, revenue: 432 },
    { name: 'Charred Cauliflower', count: 38, revenue: 361 },
  ];

  const prepTimeTrend = [
    { day: 'Mon', time: 9.4 },
    { day: 'Tue', time: 8.8 },
    { day: 'Wed', time: 10.2 },
    { day: 'Thu', time: 11.5 },
    { day: 'Fri', time: 13.8 }, // Surge
    { day: 'Sat', time: 14.2 },
    { day: 'Sun', time: 10.1 },
  ];

  return (
    <div className="p-6 text-left space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Operational Analytics & Speed
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Real-time table turnover velocity, station prep bottlenecks, and margin drivers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex rounded-lg bg-surface border border-line p-1 text-xs">
            {(['today', '7d', '30d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setRangePreset(p)}
                className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                  rangePreset === p
                    ? 'bg-elevated text-primary font-bold shadow-xs'
                    : 'text-ink-3 hover:text-ink'
                }`}
              >
                {p === 'today' ? 'Today' : p === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast('Analytics report exported as CSV', 'success')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Insight Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-line flex items-start gap-3">
          <div className="p-2 rounded-lg bg-clay/10 text-clay shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Lunch Rush Velocity</h4>
            <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
              Lunch covers peak at 13:00. Floor ordering with Cirqla lifted average beverage add-ons by <strong>+24%</strong> across all tables.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-line flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Prep Bottleneck Analysis</h4>
            <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
              Ticket prep time rises 22% between 13:00 and 14:00 at Central branch. Station load balancing recommended on Short Rib station.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Hour (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-elevated border border-line shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Hourly Sales & Peak Covers</h3>
              <p className="text-xs text-ink-3">Peak volume highlighted in terracotta token</p>
            </div>
            <span className="font-mono text-xs font-bold text-clay">Peak: 19:00 ($1,280)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" stroke="#66736D" fontSize={11} tickLine={false} />
                <YAxis stroke="#66736D" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: number) => [`$${val}`, 'Sales']}
                  contentStyle={{ backgroundColor: '#FCFBF8', borderColor: '#E3DED3', borderRadius: 8, fontSize: 12 }}
                />
                <Bar
                  dataKey="sales"
                  fill="#7F9A8B"
                  radius={[4, 4, 0, 0]}
                  // Highlight peak hour
                  shape={(props: any) => {
                    const { fill, x, y, width, height, payload } = props;
                    const barFill = payload.isPeak ? '#B85C3C' : '#7F9A8B';
                    return <rect x={x} y={y} width={width} height={height} fill={barFill} rx={4} ry={4} />;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prep Time Trend (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-elevated border border-line shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Ticket Prep Time Trend</h3>
              <p className="text-xs text-ink-3">Target threshold: 12.0 min</p>
            </div>
            <span className="font-mono text-xs font-bold text-ok">Avg: 11.1 min</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepTimeTrend}>
                <XAxis dataKey="day" stroke="#66736D" fontSize={11} tickLine={false} />
                <YAxis stroke="#66736D" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}m`} />
                <Tooltip
                  formatter={(val: number) => [`${val} min`, 'Avg Prep Time']}
                  contentStyle={{ backgroundColor: '#FCFBF8', borderColor: '#E3DED3', borderRadius: 8, fontSize: 12 }}
                />
                <ReferenceLine y={12} stroke="#B85C3C" strokeDasharray="3 3" label={{ value: 'Target 12m', fill: '#B85C3C', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#1F3A33"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#1F3A33' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Items Table & Order Type Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-elevated border border-line space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink">Top Selling Menu Items</h3>
          <div className="divide-y divide-line text-xs font-sans">
            {topItems.map((item, idx) => (
              <div key={item.name} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-ink-3 w-4">{idx + 1}.</span>
                  <span className="font-semibold text-ink">{item.name}</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-ink-3">{item.count} sold</span>
                  <span className="font-bold text-ink">${item.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-elevated border border-line space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink">Order Channel Distribution</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-ink mb-1">
                <span>Dine-In Table QR (Cirqla)</span>
                <span className="font-mono font-bold">78%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-clay w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-ink mb-1">
                <span>Bar & Counter Walk-in</span>
                <span className="font-mono font-bold">16%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-primary w-[16%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-ink mb-1">
                <span>Direct Takeout Collection</span>
                <span className="font-mono font-bold">6%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-slate w-[6%]" />
              </div>
            </div>

            <div className="pt-4 border-t border-line text-[11px] text-ink-3 leading-relaxed">
              Guests who scanned table QR tents spent <strong>18% more on average</strong> than counter walk-ins due to interactive modifier choices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
