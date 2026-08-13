'use client';
import type { Forecast } from '@restaurant/shared';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
export function ForecastChart({ data }: { data: Forecast[] }) {
  return (
    <div className="h-56 w-full min-w-0 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c88a3e" stopOpacity={0.32} />
              <stop offset="1" stopColor="#c88a3e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.07)" />
          <XAxis dataKey="menuItemName" tick={{ fontSize: 11, fill: '#969d98' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#969d98' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#111513', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12 }} />
          <Area
            type="monotone"
            dataKey="expected"
            stroke="#c88a3e"
            strokeWidth={3}
            fill="url(#fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
