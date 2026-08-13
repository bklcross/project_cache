import { Injectable } from '@nestjs/common';
import { JsonStore } from '../common/json-store.service';
@Injectable()
export class ReceivingService {
  constructor(private readonly store: JsonStore) {}
  receive(input: {
    purchaseOrderId: string;
    items: Array<{ ingredientId: string; quantity: number }>;
  }) {
    const record = { ...input, id: `receipt_${Date.now()}`, receivedAt: new Date().toISOString() };
    this.store.data.receiving.push(record);
    for (const row of input.items) {
      const item = this.store.data.inventory.find((x) => x.ingredientId === row.ingredientId);
      if (item) {
        item.quantity += row.quantity;
        item.incomingQuantity = Math.max(0, item.incomingQuantity - row.quantity);
      }
    }
    const po = this.store.data.purchaseOrders.find((x) => x.id === input.purchaseOrderId);
    if (po) po.status = 'received';
    return record;
  }
}
