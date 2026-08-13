import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-white/[.07] bg-[#151917] p-5 shadow-soft', className)}
      {...props}
    />
  );
}
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'rounded-xl bg-amber px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-[#d89b4d] disabled:cursor-not-allowed disabled:opacity-40',
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
        'w-full rounded-xl border border-white/10 bg-[#0f1211] px-3 py-2 text-white outline-none placeholder:text-white/30 focus:border-amber/50 focus:ring-2 focus:ring-amber/10',
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
    neutral: 'bg-white/[.07] text-white/60',
    danger: 'bg-red-400/10 text-red-300 ring-1 ring-inset ring-red-400/15',
    warn: 'bg-amber/10 text-[#e6ad65] ring-1 ring-inset ring-amber/20',
    good: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/15',
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
