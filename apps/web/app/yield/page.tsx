import type { YieldPrediction } from '@restaurant/shared';
import { Header } from '@/components/header';
import { PageHeading } from '@/components/page-heading';
import { PrepForm } from '@/components/prep-form';
import { Card } from '@/components/ui';
import { api } from '@/lib/api';
export default async function YieldPage() {
  const rows = await api<YieldPrediction[]>('/yields');
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="Kitchen learning"
        title="Yield intelligence"
        detail="Every prep session sharpens the usable-yield estimate that purchasing uses to translate recipes into raw product."
      />
      <Card className="mb-6">
        <p className="mb-4 font-bold">Record prep session</p>
        <PrepForm />
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((x) => (
          <Card key={x.ingredientId}>
            <p className="text-sm capitalize muted">{x.ingredientId.replaceAll('_', ' ')}</p>
            <p className="metric mt-3 text-4xl">{Math.round(x.predictedYield * 100)}%</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[.07]">
              <div
                className="h-full rounded-full bg-amber"
                style={{ width: `${x.predictedYield * 100}%` }}
              />
            </div>
            <p className="mt-3 text-xs muted">
              Baseline {Math.round(x.baselineYield * 100)}% · {Math.round(x.confidence * 100)}%
              confidence
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
