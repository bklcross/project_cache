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
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#28775d" stopOpacity={0.35} />
              <stop offset="1" stopColor="#28775d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e2" />
          <XAxis dataKey="menuItemName" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="expected"
            stroke="#28775d"
            strokeWidth={3}
            fill="url(#fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
