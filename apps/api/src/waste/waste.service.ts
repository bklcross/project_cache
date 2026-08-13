import { Injectable } from '@nestjs/common';
import { JsonStore } from '../common/json-store.service';
@Injectable()
export class WasteService {
  constructor(private readonly store: JsonStore) {}
  all() {
    return this.store.data.waste;
  }
  add(input: {
    ingredientId: string;
    quantity: number;
    unit: string;
    reason: string;
    cost?: number;
  }) {
    const record = {
      ...input,
      id: `waste_${Date.now()}`,
      occurredAt: new Date().toISOString(),
      cost: input.cost ?? 0,
    };
    this.store.data.waste.push(record);
    const item = this.store.data.inventory.find((x) => x.ingredientId === input.ingredientId);
    if (item) item.quantity = Math.max(0, item.quantity - input.quantity);
    return record;
  }
  summary() {
    const totalCost = this.all().reduce((s, x) => s + x.cost, 0);
    const totalQuantity = this.all().reduce((s, x) => s + x.quantity, 0);
    const reasons = this.all().reduce<Record<string, number>>(
      (m, x) => ((m[x.reason] = (m[x.reason] ?? 0) + x.cost), m),
      {},
    );
    return {
      totalCost,
      totalQuantity,
      topReason: Object.entries(reasons).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'none',
    };
  }
}
