import type { PurchaseRecommendation } from '@restaurant/shared';
import { CreatePo } from '@/components/create-po';
import { Header } from '@/components/header';
import { PageHeading } from '@/components/page-heading';
import { RecommendationActions } from '@/components/recommendation-actions';
import { Badge, Card } from '@/components/ui';
import { api } from '@/lib/api';
export default async function Purchasing() {
  const rows = await api<PurchaseRecommendation[]>('/purchasing/recommendations');
  const approved = rows
    .filter((x) => x.status === 'approved' || x.status === 'modified')
    .map((x) => x.id);
  return (
    <>
      <Header />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading
          eyebrow="Smart purchasing"
          title="Recommendations"
          detail="Demand, recipe needs, kitchen yield, stock, safety levels, and supplier package sizes—resolved into one explainable order plan."
        />
        <CreatePo ids={approved} />
      </div>
      <div className="space-y-4">
        {rows.map((x) => (
          <Card key={x.id}>
            <div className="grid gap-5 lg:grid-cols-[1.2fr_.7fr_1.2fr]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{x.ingredientName}</h2>
                  <Badge
                    tone={x.risk === 'high' ? 'danger' : x.risk === 'medium' ? 'warn' : 'good'}
                  >
                    {x.risk} risk
                  </Badge>
                </div>
                <p className="mt-1 text-sm muted">Best usable cost · {x.supplierName}</p>
                <p className="metric mt-4 text-3xl">
                  {x.recommendedQuantity} <span className="text-base">{x.unit}</span>
                </p>
                <p className="text-sm muted">
                  {x.packageCount} packages · ${x.estimatedCost.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-white/[.06] bg-black/20 p-4 text-sm">
                <p className="eyebrow">Why this amount</p>
                <dl className="mt-3 space-y-2">
                  {[
                    ['Usable demand', x.explanation.usableDemand],
                    ['Yield', `${Math.round(x.explanation.predictedYield * 100)}%`],
                    ['Raw need', x.explanation.rawRequirement],
                    ['On hand', x.explanation.currentInventory],
                    ['Safety stock', x.explanation.safetyStock],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <dt className="muted">{k}</dt>
                      <dd className="font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex items-center lg:justify-end">
                <RecommendationActions
                  id={x.id}
                  quantity={x.recommendedQuantity}
                  status={x.status}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
