import { ChefHat } from 'lucide-react';
export function Header() {
  return (
    <header className="mb-7 flex items-center justify-between border-b border-white/[.06] pb-5">
      <div className="min-w-0">
        <p className="eyebrow">Juniper Kitchen</p>
        <p className="mt-1 truncate text-xs muted sm:text-sm">Inventory & recipe planner</p>
      </div>
      <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-mint ring-1 ring-white/10">
          <ChefHat size={19} />
        </div>
      </div>
    </header>
  );
}
