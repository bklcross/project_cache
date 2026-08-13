import Link from 'next/link';
import {
  BarChart3,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  Leaf,
  ShoppingBasket,
  Trash2,
} from 'lucide-react';
const links = [
  ['/dashboard', 'Overview', BarChart3],
  ['/inventory', 'Inventory', Boxes],
  ['/forecast', 'Forecast', ChartNoAxesCombined],
  ['/purchasing', 'Purchasing', ShoppingBasket],
  ['/purchase-orders', 'Orders', ClipboardList],
  ['/yield', 'Yield', Leaf],
  ['/waste', 'Waste', Trash2],
] as const;
export function Nav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-ink px-5 py-7 text-white lg:flex">
      <div className="mb-10 px-2">
        <div className="mb-2 flex items-center gap-2 text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber text-ink">J</span>
          Juniper
        </div>
        <p className="text-xs text-white/45">Restaurant intelligence</p>
      </div>
      <nav className="space-y-1">
        {links.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-white/5 p-4">
        <p className="eyebrow !text-amber">Live service</p>
        <p className="mt-2 text-sm">Saturday dinner</p>
        <p className="mt-1 text-xs text-white/45">Forecast synced locally</p>
      </div>
    </aside>
  );
}
