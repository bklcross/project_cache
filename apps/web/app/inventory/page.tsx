import { Header } from '@/components/header';
import { InventoryCount } from '@/components/inventory-count';
import { PageHeading } from '@/components/page-heading';
import { Badge, Card } from '@/components/ui';
import { api } from '@/lib/api';

type Row = {
  ingredientId: string;
  quantity: number;
  parLevel: number;
  plannedRequired: number;
  projectedQuantity: number;
  shortage: number;
  lastCountedAt: string;
  ingredient: { name: string; unit: string; category: string; unitCost: number };
};

export default async function Inventory() {
  const rows = await api<Row[]>('/inventory');
  const value = rows.reduce((total, row) => total + row.quantity * row.ingredient.unitCost, 0);
  const prepShortages = rows.filter((row) => row.shortage > 0).length;
  const lastCounted = rows.length
    ? new Date(Math.max(...rows.map((x) => new Date(x.lastCountedAt).getTime()))).toLocaleDateString()
    : 'Not counted';

  return (
    <>
      <Header />
      <PageHeading
        eyebrow="What is on hand"
        title="Current inventory"
        detail="Track ingredient quantities, target stock levels, and estimated value in one place."
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="py-4">
          <p className="text-sm muted">Ingredients tracked</p>
          <p className="metric mt-1 text-3xl">{rows.length}</p>
        </Card>
        <Card className="py-4">
          <p className="text-sm muted">Estimated value</p>
          <p className="metric mt-1 text-3xl">${value.toFixed(2)}</p>
        </Card>
        <Card className="py-4">
          <p className="text-sm muted">Prep shortages</p>
          <p className="metric mt-1 text-3xl">{prepShortages}</p>
        </Card>
      </div>
      <Card className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">All ingredients</h2>
            <span className="text-xs muted">Last count {lastCounted}</span>
          </div>
          <div className="hidden table-row grid-cols-[1.2fr_.5fr_.55fr_.55fr_.65fr_1fr] text-xs font-bold uppercase tracking-wider muted lg:grid">
            <span>Ingredient</span><span>On hand</span><span>Prep need</span><span>After prep</span><span>Status</span><span>Update count</span>
          </div>
          {rows.map((row) => {
            const status = row.parLevel > 0 && row.quantity < row.parLevel * 0.5
              ? 'low'
              : row.quantity < row.parLevel ? 'below target' : 'stocked';
            return (
              <div key={row.ingredientId} className="table-row grid-cols-2 gap-3 lg:grid-cols-[1.2fr_.5fr_.55fr_.55fr_.65fr_1fr]">
                <div>
                  <p className="font-semibold">{row.ingredient.name}</p>
                  <p className="text-xs muted">{row.ingredient.category} · ${row.ingredient.unitCost.toFixed(2)}/{row.ingredient.unit}</p>
                </div>
                <span className="text-right lg:text-left">{row.quantity} {row.ingredient.unit}</span>
                <span className="text-sm"><span className="muted lg:hidden">Prep need: </span>{row.plannedRequired} {row.ingredient.unit}</span>
                <span className="text-right text-sm lg:text-left"><span className="muted lg:hidden">After prep: </span>{row.shortage ? `-${row.shortage}` : row.projectedQuantity} {row.ingredient.unit}</span>
                <div className="text-right lg:text-left">
                  <Badge tone={row.shortage ? 'danger' : status === 'low' ? 'danger' : status === 'below target' ? 'warn' : 'good'}>{row.shortage ? 'short for prep' : status}</Badge>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <InventoryCount ingredientId={row.ingredientId} quantity={row.quantity} />
                </div>
              </div>
            );
          })}
      </Card>
    </>
  );
}
