import { Injectable } from '@nestjs/common';
import type { Forecast } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';
@Injectable()
export class ForecastingService {
  constructor(private readonly store: JsonStore) {}
  forecasts(date = '2026-08-15'): Forecast[] {
    const target = new Date(`${date}T12:00:00Z`);
    return this.store.data.menuItems.map((menu) => {
      const comparable = this.store.data.menuSales
        .filter(
          (s) =>
            s.menuItemId === menu.id &&
            new Date(`${s.date}T12:00:00Z`).getUTCDay() === target.getUTCDay(),
        )
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 4);
      const weights = [0.4, 0.3, 0.2, 0.1];
      const base =
        comparable.reduce((sum, s, i) => sum + s.quantity * weights[i], 0) /
        (weights.slice(0, comparable.length).reduce((a, b) => a + b, 0) || 1);
      const trend =
        comparable.length > 1
          ? Math.max(
              0.95,
              Math.min(
                1.08,
                1 +
                  ((comparable[0].quantity - comparable.at(-1)!.quantity) /
                    comparable.at(-1)!.quantity) *
                    0.25,
              ),
            )
          : 1;
      const season = target.getUTCMonth() === 7 ? 1.03 : 1;
      const expected = Math.round(base * trend * season);
      const confidence = Math.min(0.94, 0.68 + comparable.length * 0.06);
      return {
        menuItemId: menu.id,
        menuItemName: menu.name,
        date,
        expected,
        low: Math.round(expected * (1 - (1 - confidence) * 0.6)),
        high: Math.round(expected * (1 + (1 - confidence) * 0.75)),
        confidence: Number(confidence.toFixed(2)),
      };
    });
  }
}
