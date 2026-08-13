import { BadRequestException, Injectable } from '@nestjs/common';
import type { IngredientRequirement, ProductionPlanItem } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';

@Injectable()
export class PlanningService {
  constructor(private readonly store: JsonStore) {}

  calculate(plan: ProductionPlanItem[]): IngredientRequirement[] {
    this.store.data.plannedPrep = plan.filter((x) => x.portions > 0);
    return this.requirements(this.store.data.plannedPrep);
  }

  current() {
    return this.requirements(this.store.data.plannedPrep);
  }

  private requirements(plan: ProductionPlanItem[]): IngredientRequirement[] {
    const totals = new Map<string, number>();
    for (const item of plan) {
      const recipe = this.store.data.recipes.find((x) => x.id === item.recipeId);
      if (!recipe) throw new BadRequestException(`Recipe ${item.recipeId} not found`);
      for (const ingredient of recipe.ingredients) {
        const needed = (ingredient.quantity / recipe.yieldPortions) * item.portions;
        totals.set(ingredient.ingredientId, (totals.get(ingredient.ingredientId) ?? 0) + needed);
      }
    }
    return [...totals].map(([ingredientId, requiredValue]) => {
      const ingredient = this.store.data.ingredients.find((x) => x.id === ingredientId);
      const onHand = this.store.data.inventory.find((x) => x.ingredientId === ingredientId)?.quantity ?? 0;
      const required = Number(requiredValue.toFixed(2));
      return {
        ingredientId,
        name: ingredient?.name ?? ingredientId,
        unit: ingredient?.unit ?? '',
        required,
        onHand,
        remaining: Number(Math.max(0, onHand - required).toFixed(2)),
        shortage: Number(Math.max(0, required - onHand).toFixed(2)),
      };
    });
  }
}
