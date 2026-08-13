import type { PurchaseOrder } from '@restaurant/shared';
import { Header } from '@/components/header';
import { PageHeading } from '@/components/page-heading';
import { ReceiveOrder } from '@/components/receive-order';
import { Badge, Card } from '@/components/ui';
import { api } from '@/lib/api';
export default async function Orders() {
  const rows = await api<PurchaseOrder[]>('/purchase-orders');
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="Order workflow"
        title="Purchase orders"
        detail="Approved recommendations become supplier-ready orders and update inventory when deliveries arrive."
      />
      {rows.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="metric text-2xl">No purchase orders yet</p>
          <p className="mt-2 muted">Approve recommendations in Purchasing, then create a PO.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((po) => (
            <Card key={po.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">{po.supplierName}</h2>
                    <Badge tone={po.status === 'received' ? 'good' : 'warn'}>{po.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm muted">
                    {po.id} · Expected {new Date(po.expectedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="metric text-2xl">${po.total.toFixed(2)}</p>
                  {po.status !== 'received' && <ReceiveOrder id={po.id} items={po.items} />}
                </div>
              </div>
              <div className="mt-4 border-t border-white/[.07] pt-3">
                {po.items.map((x) => (
                  <div key={x.ingredientId} className="flex justify-between py-1 text-sm">
                    <span>{x.ingredientId.replaceAll('_', ' ')}</span>
                    <span>
                      {x.quantity} {x.unit}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
