import { Header } from '@/components/header';
import { InventoryCount } from '@/components/inventory-count';
import { PageHeading } from '@/components/page-heading';
import { Card } from '@/components/ui';
import { api } from '@/lib/api';
type Row = {
  ingredientId: string;
  quantity: number;
  lastCountedAt: string;
  ingredient: { name: string; unit: string; category: string };
};
export default async function Inventory() {
  const rows = await api<Row[]>('/inventory');
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="What is on hand"
        title="Current inventory"
        detail="View and update the ingredient quantities currently available in your kitchen."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Card className="py-4">
          <p className="text-sm muted">Ingredients tracked</p>
          <p className="metric mt-1 text-3xl">{rows.length}</p>
        </Card>
        <Card className="py-4">
          <p className="text-sm muted">Last inventory count</p>
          <p className="mt-2 font-semibold">{new Date(Math.max(...rows.map((x) => new Date(x.lastCountedAt).getTime()))).toLocaleDateString()}</p>
        </Card>
      </div>
      <Card>
        <div className="hidden table-row grid-cols-[1.4fr_.6fr_1fr] text-xs font-bold uppercase tracking-wider muted md:grid">
          <span>Ingredient</span>
          <span>On hand</span>
          <span>Update count</span>
        </div>
        {rows.map((x) => {
          return (
            <div
              key={x.ingredientId}
              className="table-row grid-cols-2 gap-3 md:grid-cols-[1.4fr_.6fr_1fr]"
            >
              <div>
                <p className="font-semibold">{x.ingredient.name}</p>
                <p className="text-xs muted">{x.ingredient.category}</p>
              </div>
              <span className="text-right md:text-left">
                {x.quantity} {x.ingredient.unit}
              </span>
              <div className="col-span-2 md:col-span-1"><InventoryCount ingredientId={x.ingredientId} quantity={x.quantity} /></div>
            </div>
          );
        })}
      </Card>
    </>
  );
}
