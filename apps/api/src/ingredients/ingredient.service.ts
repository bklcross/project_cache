import { BadRequestException, Injectable } from '@nestjs/common';
import type { CreateIngredient } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';

@Injectable()
export class IngredientService {
  constructor(private readonly store: JsonStore) {}

  all() {
    return this.store.data.ingredients;
  }

  create(input: CreateIngredient) {
    const name = input.name.trim();
    if (!name || !input.unit || !input.category)
      throw new BadRequestException('Name, unit, and category are required');
    const quantity = input.quantity ?? 0;
    const parLevel = input.parLevel ?? 0;
    const unitCost = input.unitCost ?? 0;
    if (quantity < 0 || parLevel < 0 || unitCost < 0)
      throw new BadRequestException('Inventory values cannot be negative');
    if (this.store.data.ingredients.some((x) => x.name.toLowerCase() === name.toLowerCase()))
      throw new BadRequestException('Ingredient already exists');

    const id = `ingredient_${Date.now()}`;
    const ingredient = {
      id,
      name,
      unit: input.unit,
      category: input.category,
      unitCost,
    };
    this.store.data.ingredients.push(ingredient);
    this.store.data.inventory.push({
      ingredientId: id,
      quantity,
      parLevel,
      lastCountedAt: new Date().toISOString(),
    });
    return ingredient;
  }
}
