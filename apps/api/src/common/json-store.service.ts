import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type {
  Ingredient,
  InventoryCount,
  InventoryItem,
  Recipe,
} from '@restaurant/shared';

export interface AppState {
  ingredients: Ingredient[];
  inventory: InventoryItem[];
  recipes: Recipe[];
  inventoryCounts: InventoryCount[];
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
      recipes: await load('recipes.json'),
      inventoryCounts: await load('inventory-counts.json'),
    };
  }
}
