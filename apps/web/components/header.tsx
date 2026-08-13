import { Bell } from 'lucide-react';
import { ResetButton } from './reset-button';
export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <p className="eyebrow">Juniper Kitchen · Portland</p>
        <p className="mt-1 text-sm muted">Saturday, August 15</p>
      </div>
      <div className="flex items-center gap-3">
        <ResetButton />
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm">
          <Bell size={17} />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-sm font-bold text-white">
          AM
        </div>
      </div>
    </header>
  );
}
