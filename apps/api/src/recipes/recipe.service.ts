import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JsonStore } from '../common/json-store.service';
@Injectable()
export class RecipeService {
  constructor(private readonly store: JsonStore) {}
  all() {
    return this.store.data.recipes;
  }
  resolveIngredientRequirements(menuItemId: string, portions: number) {
    const menu = this.store.data.menuItems.find((x) => x.id === menuItemId);
    if (!menu) throw new NotFoundException('Menu item not found');
    const totals: Record<string, number> = {};
    const visit = (recipeId: string, multiplier: number, path: Set<string>) => {
      if (path.has(recipeId)) throw new BadRequestException(`Recipe cycle detected at ${recipeId}`);
      const recipe = [...this.store.data.recipes, ...this.store.data.prepRecipes].find(
        (x) => x.id === recipeId,
      );
      if (!recipe) throw new NotFoundException(`Recipe ${recipeId} not found`);
      const next = new Set(path).add(recipeId);
      for (const item of recipe.ingredients) {
        const quantity = (item.quantity * multiplier) / recipe.yieldPortions;
        if (item.kind === 'ingredient') totals[item.id] = (totals[item.id] ?? 0) + quantity;
        else visit(item.id, quantity, next);
      }
    };
    visit(menu.recipeId, portions, new Set());
    return totals;
  }
}
