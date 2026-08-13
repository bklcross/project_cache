import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-black/5 bg-white p-5 shadow-soft', className)}
      {...props}
    />
  );
}
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-forest/20',
        className,
      )}
      {...props}
    />
  );
}
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'danger' | 'warn' | 'good';
}) {
  const tones = {
    neutral: 'bg-black/5 text-black/60',
    danger: 'bg-red-50 text-red-700',
    warn: 'bg-amber-50 text-amber-700',
    good: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
