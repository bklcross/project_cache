import { Header } from '@/components/header';
import { InventoryCount } from '@/components/inventory-count';
import { PageHeading } from '@/components/page-heading';
import { Badge, Card } from '@/components/ui';
import { api } from '@/lib/api';
type Row = {
  ingredientId: string;
  quantity: number;
  incomingQuantity: number;
  parLevel: number;
  theoreticalQuantity: number;
  ingredient: { name: string; unit: string; category: string };
};
export default async function Inventory() {
  const rows = await api<Row[]>('/inventory');
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="On-hand control"
        title="Inventory"
        detail="Count quickly, spot variance, and keep purchasing grounded in what is actually on the shelf."
      />
      <Card>
        <div className="hidden table-row grid-cols-[1.3fr_.7fr_.7fr_.6fr_1fr] text-xs font-bold uppercase tracking-wider muted md:grid">
          <span>Ingredient</span>
          <span>On hand</span>
          <span>Variance</span>
          <span>Health</span>
          <span>Update count</span>
        </div>
        {rows.map((x) => {
          const variance = x.quantity - x.theoreticalQuantity;
          const health = x.quantity / x.parLevel;
          return (
            <div
              key={x.ingredientId}
              className="table-row grid-cols-2 gap-3 md:grid-cols-[1.3fr_.7fr_.7fr_.6fr_1fr]"
            >
              <div>
                <p className="font-semibold">{x.ingredient.name}</p>
                <p className="text-xs muted">{x.ingredient.category}</p>
              </div>
              <span className="text-right md:text-left">
                {x.quantity} {x.ingredient.unit}
              </span>
              <span className={variance < 0 ? 'text-sm text-red-300' : 'text-sm text-emerald-300'}>
                {variance > 0 ? '+' : ''}
                {variance.toFixed(1)}
              </span>
              <Badge tone={health < 0.4 ? 'danger' : health < 0.75 ? 'warn' : 'good'}>
                {health < 0.4 ? 'critical' : health < 0.75 ? 'watch' : 'healthy'}
              </Badge>
              <div className="col-span-2 md:col-span-1"><InventoryCount ingredientId={x.ingredientId} quantity={x.quantity} /></div>
            </div>
          );
        })}
      </Card>
    </>
  );
}
