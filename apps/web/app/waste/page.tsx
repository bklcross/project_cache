import type { WasteRecord } from '@restaurant/shared';
import { Header } from '@/components/header';
import { PageHeading } from '@/components/page-heading';
import { Card } from '@/components/ui';
import { WasteForm } from '@/components/waste-form';
import { api } from '@/lib/api';
export default async function Waste() {
  const rows = await api<WasteRecord[]>('/waste');
  const total = rows.reduce((s, x) => s + x.cost, 0);
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="Loss visibility"
        title="Waste log"
        detail="Capture waste while it is fresh, connect it to inventory, and surface patterns the kitchen can act on."
      />
      <Card className="mb-6">
        <WasteForm />
      </Card>
      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <Card className="border-amber/20 bg-gradient-to-br from-[#261c12] to-[#171513] text-white">
          <p className="eyebrow !text-amber">Period waste</p>
          <p className="metric mt-3 text-5xl">${total.toFixed(2)}</p>
          <p className="mt-2 text-sm text-white/50">Across {rows.length} records</p>
        </Card>
        <Card>
          {rows.map((x) => (
            <div key={x.id} className="table-row grid-cols-[1fr_auto] gap-x-4 sm:grid-cols-[1fr_.7fr_.7fr]">
              <div>
                <p className="font-semibold capitalize">{x.ingredientId.replaceAll('_', ' ')}</p>
                <p className="text-xs capitalize muted">{x.reason}</p>
              </div>
              <span className="text-right sm:text-left">
                {x.quantity} {x.unit}
              </span>
              <span className="col-span-2 mt-1 text-right text-sm font-semibold text-amber sm:col-span-1 sm:mt-0">${x.cost.toFixed(2)}</span>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
