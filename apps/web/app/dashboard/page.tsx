import type { Dashboard } from '@restaurant/shared';
import { ArrowUpRight, ChefHat, PackageCheck, TriangleAlert, WalletCards } from 'lucide-react';
import { ForecastChart } from '@/components/forecast-chart';
import { Header } from '@/components/header';
import { Badge, Card } from '@/components/ui';
import { api } from '@/lib/api';
export default async function DashboardPage() {
  const data = await api<Dashboard>('/dashboard');
  const metrics = [
    ['Inventory value', `$${data.summary.inventoryValue.toLocaleString()}`, WalletCards],
    ['Open recommendations', data.summary.openRecommendations, PackageCheck],
    ['Stockout risks', data.summary.stockoutRisks, TriangleAlert],
    ['Forecasted covers', data.summary.forecastedCovers, ChefHat],
  ] as const;
  return (
    <>
      <Header />
      <section className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow">Saturday service plan</p>
          <h1 className="metric mt-2 max-w-xl text-4xl leading-tight md:text-5xl">
            Know what the kitchen needs, before it needs it.
          </h1>
        </div>
        <div className="hidden text-right md:block">
          <span className="text-sm font-semibold text-emerald-700">91% plan confidence</span>
          <p className="mt-1 text-xs muted">Based on 4 comparable weeks</p>
        </div>
      </section>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <Card key={label} className="relative overflow-hidden">
            <Icon className="absolute right-4 top-4 text-forest/25" size={22} />
            <p className="text-sm muted">{label}</p>
            <p className="metric mt-3 text-3xl">{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow">Expected demand</p>
              <h2 className="mt-1 text-lg font-bold">Menu forecast</h2>
            </div>
            <span className="text-xs muted">Covers by item</span>
          </div>
          <ForecastChart data={data.forecast} />
        </Card>
        <Card className="bg-forest text-white">
          <p className="eyebrow !text-amber">Tonight’s focus</p>
          <h2 className="metric mt-3 text-3xl">{data.risks[0]?.name ?? 'Inventory healthy'}</h2>
          <p className="mt-3 text-sm text-white/65">
            {data.risks[0]
              ? `${data.risks[0].daysRemaining} days of stock remain. Review the purchase recommendation before cutoff.`
              : 'No immediate stockout risks detected.'}
          </p>
          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="text-3xl font-semibold">${data.summary.wasteCost.toFixed(0)}</p>
            <p className="mt-1 text-xs text-white/45">
              Waste cost this period · {data.waste.topReason}
            </p>
          </div>
        </Card>
      </div>
      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="eyebrow">Action queue</p>
            <h2 className="mt-1 text-lg font-bold">Purchase recommendations</h2>
          </div>
          <a
            href="/purchasing"
            className="flex items-center gap-1 text-sm font-semibold text-forest"
          >
            View all <ArrowUpRight size={15} />
          </a>
        </div>
        {data.recommendations.slice(0, 4).map((x) => (
          <div key={x.id} className="table-row grid-cols-[1.3fr_.8fr_.7fr_.4fr]">
            <div>
              <p className="font-semibold">{x.ingredientName}</p>
              <p className="text-xs muted">{x.supplierName}</p>
            </div>
            <span>
              {x.recommendedQuantity} {x.unit}
            </span>
            <span>${x.estimatedCost.toFixed(2)}</span>
            <Badge tone={x.risk === 'high' ? 'danger' : x.risk === 'medium' ? 'warn' : 'good'}>
              {x.risk}
            </Badge>
          </div>
        ))}
      </Card>
    </>
  );
}
