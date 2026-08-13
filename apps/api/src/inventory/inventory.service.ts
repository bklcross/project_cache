import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStore } from '../common/json-store.service';
import { PlanningService } from '../planning/planning.service';
@Injectable()
export class InventoryService {
  constructor(
    private readonly store: JsonStore,
    private readonly planning: PlanningService,
  ) {}
  findAll() {
    const needs = new Map(this.planning.current().map((x) => [x.ingredientId, x]));
    return this.store.data.inventory.map((item) => {
      const planned = needs.get(item.ingredientId);
      return {
        ...item,
        plannedRequired: planned?.required ?? 0,
        projectedQuantity: planned?.remaining ?? item.quantity,
        shortage: planned?.shortage ?? 0,
        ingredient: this.store.data.ingredients.find((x) => x.id === item.ingredientId),
      };
    });
  }
  findOne(id: string) {
    const item = this.findAll().find((x) => x.ingredientId === id);
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }
  count(input: { ingredientId: string; quantity: number }) {
    const item = this.store.data.inventory.find((x) => x.ingredientId === input.ingredientId);
    if (!item) throw new NotFoundException('Inventory item not found');
    item.quantity = input.quantity;
    item.lastCountedAt = new Date().toISOString();
    const record = {
      id: `count_${Date.now()}`,
      ingredientId: input.ingredientId,
      quantity: input.quantity,
      countedAt: item.lastCountedAt,
    };
    this.store.data.inventoryCounts.push(record);
    return record;
  }
}
