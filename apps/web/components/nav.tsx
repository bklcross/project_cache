import Link from 'next/link';
import {
  BarChart3,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  ChefHat,
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
function NavLinks({ mobile = false }: { mobile?: boolean }) {
  return links.map(([href, label, Icon]) => (
    <Link
      key={href}
      href={href}
      className={mobile
        ? 'flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium text-white/55 transition hover:bg-white/[.06] hover:text-amber'
        : 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[.06] hover:text-white'}
    >
      <Icon size={mobile ? 18 : 17} />
      {label}
    </Link>
  ));
}
export function Nav() {
  return (
    <>
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-white/[.06] bg-[#0a0d0c] px-5 py-7 text-white lg:flex">
      <div className="mb-10 px-2">
        <div className="mb-2 flex items-center gap-2 text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber text-ink"><ChefHat size={20} /></span>
          <span>Juniper <span className="text-amber">Kitchen</span></span>
        </div>
        <p className="text-xs text-white/45">Restaurant intelligence</p>
      </div>
      <nav className="space-y-1">
        <NavLinks />
      </nav>
      <div className="mt-auto rounded-2xl border border-white/[.06] bg-white/[.03] p-4">
        <p className="eyebrow !text-amber">Live service</p>
        <p className="mt-2 text-sm">Saturday dinner</p>
        <p className="mt-1 text-xs text-white/45">Forecast synced locally</p>
      </div>
    </aside>
    <nav className="fixed inset-x-3 bottom-3 z-30 flex overflow-x-auto rounded-2xl border border-white/10 bg-[#111513]/95 p-1.5 shadow-2xl backdrop-blur lg:hidden">
      <NavLinks mobile />
    </nav>
    </>
  );
}
