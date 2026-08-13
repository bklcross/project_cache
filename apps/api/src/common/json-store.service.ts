import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type {
  Ingredient,
  InventoryCount,
  InventoryItem,
  MenuItem,
  MenuSale,
  PrepSession,
  PurchaseOrder,
  ReceivingRecord,
  Recipe,
  Supplier,
  SupplierItem,
  WasteRecord,
  YieldObservation,
} from '@restaurant/shared';

export interface AppState {
  ingredients: Ingredient[];
  inventory: InventoryItem[];
  menuItems: MenuItem[];
  recipes: Recipe[];
  prepRecipes: Recipe[];
  menuSales: MenuSale[];
  suppliers: Supplier[];
  supplierItems: SupplierItem[];
  yields: YieldObservation[];
  prepSessions: PrepSession[];
  waste: WasteRecord[];
  purchaseOrders: PurchaseOrder[];
  receiving: ReceivingRecord[];
  inventoryCounts: InventoryCount[];
  recommendationDecisions: Record<string, { status: string; quantity?: number }>;
}

@Injectable()
export class JsonStore implements OnModuleInit {
  private state!: AppState;
  async onModuleInit() {
    await this.reset();
  }
  get data() {
    return this.state;
  }
  async reset() {
    const dataDirectory = process.env.DATA_DIR ?? join(process.cwd(), '../../data');
    const load = async <T>(file: string) =>
      JSON.parse(await readFile(join(dataDirectory, file), 'utf8')) as T;
    this.state = {
      ingredients: await load('ingredients.json'),
      inventory: await load('inventory.json'),
      menuItems: await load('menu-items.json'),
      recipes: await load('recipes.json'),
      prepRecipes: await load('prep-recipes.json'),
      menuSales: await load('menu-sales.json'),
      suppliers: await load('suppliers.json'),
      supplierItems: await load('supplier-items.json'),
      yields: await load('yield-history.json'),
      prepSessions: await load('prep-sessions.json'),
      waste: await load('waste.json'),
      purchaseOrders: await load('purchase-orders.json'),
      receiving: await load('receiving.json'),
      inventoryCounts: await load('inventory-counts.json'),
      recommendationDecisions: {},
    };
  }
}
