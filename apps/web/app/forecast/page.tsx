import type { Forecast } from '@restaurant/shared';
import { ForecastChart } from '@/components/forecast-chart';
import { Header } from '@/components/header';
import { PageHeading } from '@/components/page-heading';
import { Card } from '@/components/ui';
import { api } from '@/lib/api';
export default async function ForecastPage() {
  const rows = await api<Forecast[]>('/forecasts');
  return (
    <>
      <Header />
      <PageHeading
        eyebrow="Demand intelligence"
        title="Saturday forecast"
        detail="A deterministic forecast using four comparable weekdays, weighted toward the most recent week, with trend and seasonal adjustments."
      />
      <Card className="mb-6">
        <ForecastChart data={rows} />
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((x) => (
          <Card key={x.menuItemId}>
            <p className="eyebrow">{Math.round(x.confidence * 100)}% confidence</p>
            <h2 className="mt-2 text-lg font-bold">{x.menuItemName}</h2>
            <p className="metric mt-4 text-4xl">{x.expected}</p>
            <p className="mt-1 text-sm muted">
              Expected orders · range {x.low}–{x.high}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
