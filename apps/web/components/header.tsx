import { Bell } from 'lucide-react';
import { ResetButton } from './reset-button';
export function Header() {
  return (
    <header className="mb-7 flex items-center justify-between border-b border-white/[.06] pb-5">
      <div className="min-w-0">
        <p className="eyebrow">Juniper Kitchen · Portland</p>
        <p className="mt-1 truncate text-xs muted sm:text-sm">Saturday, August 15 · Dinner service</p>
      </div>
      <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
        <ResetButton />
        <button aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[.04] text-white/70 transition hover:bg-white/[.08]">
          <Bell size={17} />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-sm font-bold text-mint ring-1 ring-white/10">
          AM
        </div>
      </div>
    </header>
  );
}
