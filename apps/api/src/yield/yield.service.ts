import { Injectable, NotFoundException } from '@nestjs/common';
import type { YieldPrediction } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';
const average = (values: number[], fallback: number) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : fallback;
@Injectable()
export class YieldService {
  constructor(private readonly store: JsonStore) {}
  predict(ingredientId: string): YieldPrediction {
    const ingredient = this.store.data.ingredients.find((x) => x.id === ingredientId);
    if (!ingredient) throw new NotFoundException('Ingredient not found');
    const history = [...this.store.data.yields, ...this.store.data.prepSessions].filter(
      (x) => x.ingredientId === ingredientId,
    );
    const recent = history.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    const ratio = (x: { rawWeight: number; usableWeight: number }) => x.usableWeight / x.rawWeight;
    const historicalYield = average(history.map(ratio), ingredient.baselineYield);
    const recentYield = average(recent.map(ratio), historicalYield);
    const supplierYields = Object.fromEntries(
      this.store.data.suppliers.map((s) => [
        s.id,
        Number(
          average(history.filter((x) => x.supplierId === s.id).map(ratio), historicalYield).toFixed(
            3,
          ),
        ),
      ]),
    );
    const predicted = ingredient.baselineYield * 0.25 + historicalYield * 0.35 + recentYield * 0.4;
    return {
      ingredientId,
      baselineYield: ingredient.baselineYield,
      historicalYield: Number(historicalYield.toFixed(3)),
      recentYield: Number(recentYield.toFixed(3)),
      predictedYield: Number(predicted.toFixed(3)),
      confidence: Number(Math.min(0.94, 0.62 + history.length * 0.055).toFixed(2)),
      supplierYields,
    };
  }
  all() {
    return this.store.data.ingredients.map((x) => this.predict(x.id));
  }
  add(input: {
    ingredientId: string;
    supplierId: string;
    rawWeight: number;
    usableWeight: number;
    note?: string;
  }) {
    const session = {
      ...input,
      id: `prep_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    this.store.data.prepSessions.push(session);
    return { session, prediction: this.predict(input.ingredientId) };
  }
}
