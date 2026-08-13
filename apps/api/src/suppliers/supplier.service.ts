import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonStore } from '../common/json-store.service';
@Injectable()
export class SupplierService {
  constructor(private readonly store: JsonStore) {}
  all() {
    return this.store.data.suppliers.map((s) => ({
      ...s,
      items: this.store.data.supplierItems.filter((x) => x.supplierId === s.id),
    }));
  }
  one(id: string) {
    const item = this.all().find((x) => x.id === id);
    if (!item) throw new NotFoundException('Supplier not found');
    return item;
  }
}
