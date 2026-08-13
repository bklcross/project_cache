import { BadRequestException, Injectable } from '@nestjs/common';
import type { Recipe } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';
@Injectable()
export class RecipeService {
  constructor(private readonly store: JsonStore) {}
  all() {
    return this.store.data.recipes.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((item) => ({
        ...item,
        ingredient: this.store.data.ingredients.find((x) => x.id === item.ingredientId),
      })),
    }));
  }
  create(input: Omit<Recipe, 'id'>) {
    if (!input.name.trim() || input.yieldPortions <= 0 || !input.ingredients.length)
      throw new BadRequestException('Name, yield, and ingredients are required');
    if (input.ingredients.some((x) => x.quantity <= 0))
      throw new BadRequestException('Ingredient quantities must be positive');
    const recipe: Recipe = { ...input, name: input.name.trim(), id: `recipe_${Date.now()}` };
    this.store.data.recipes.push(recipe);
    return recipe;
  }
}
