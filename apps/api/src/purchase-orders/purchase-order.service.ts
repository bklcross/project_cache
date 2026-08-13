import { Injectable, NotFoundException } from '@nestjs/common';
import type { PurchaseOrder } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';
import { PurchasingService } from '../purchasing/purchasing.service';
@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly store: JsonStore,
    private readonly purchasing: PurchasingService,
  ) {}
  all() {
    return this.store.data.purchaseOrders;
  }
  one(id: string) {
    const po = this.all().find((x) => x.id === id);
    if (!po) throw new NotFoundException('Purchase order not found');
    return po;
  }
  create(input: { recommendationIds: string[] }) {
    const selected = this.purchasing
      .recommendations()
      .filter((x) => input.recommendationIds.includes(x.id) && x.status !== 'rejected');
    if (!selected.length) throw new NotFoundException('No recommendations selected');
    const grouped = selected.reduce<Record<string, typeof selected>>((map, row) => {
      (map[row.supplierId] ??= []).push(row);
      return map;
    }, {});
    return Object.values(grouped).map((rows) => {
      const supplier = this.store.data.suppliers.find((x) => x.id === rows[0].supplierId)!;
      const po: PurchaseOrder = {
        id: `po_${Date.now()}_${supplier.id}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        status: 'sent',
        createdAt: new Date().toISOString(),
        expectedAt: new Date(Date.now() + supplier.leadTimeDays * 86400000).toISOString(),
        items: rows.map((x) => ({
          ingredientId: x.ingredientId,
          quantity: x.recommendedQuantity,
          unit: x.unit,
          unitCost: x.estimatedCost / x.recommendedQuantity,
        })),
        total: rows.reduce((s, x) => s + x.estimatedCost, 0),
      };
      this.store.data.purchaseOrders.push(po);
      rows.forEach(
        (x) =>
          (this.store.data.recommendationDecisions[x.ingredientId] = {
            status: 'ordered',
            quantity: x.recommendedQuantity,
          }),
      );
      return po;
    });
  }
}
