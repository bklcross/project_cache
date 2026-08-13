import { Injectable, NotFoundException } from '@nestjs/common';
import type { PurchaseRecommendation, Risk } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';
import { ForecastingService } from '../forecasting/forecasting.service';
import { RecipeService } from '../recipes/recipe.service';
import { YieldService } from '../yield/yield.service';
const round = (n: number, d = 2) => Number(n.toFixed(d));
@Injectable()
export class PurchasingService {
  constructor(
    private readonly store: JsonStore,
    private readonly forecasting: ForecastingService,
    private readonly recipes: RecipeService,
    private readonly yields: YieldService,
  ) {}
  recommendations(): PurchaseRecommendation[] {
    const demand: Record<string, number> = {};
    for (const forecast of this.forecasting.forecasts()) {
      const needs = this.recipes.resolveIngredientRequirements(
        forecast.menuItemId,
        forecast.expected,
      );
      for (const [id, q] of Object.entries(needs)) demand[id] = (demand[id] ?? 0) + q;
    }
    return Object.entries(demand).flatMap(([ingredientId, usableDemand]) => {
      const ingredient = this.store.data.ingredients.find((x) => x.id === ingredientId)!;
      const inventory = this.store.data.inventory.find((x) => x.ingredientId === ingredientId)!;
      const prediction = this.yields.predict(ingredientId);
      const candidates = this.store.data.supplierItems
        .filter((x) => x.ingredientId === ingredientId)
        .map((item) => {
          const supplier = this.store.data.suppliers.find((x) => x.id === item.supplierId)!;
          const supplierYield = prediction.supplierYields[supplier.id] || prediction.predictedYield;
          return {
            item,
            supplier,
            usableCost: item.price / (item.packageQuantity * supplierYield),
          };
        })
        .sort((a, b) => a.usableCost - b.usableCost);
      if (!candidates.length) return [];
      const { item, supplier } = candidates[0];
      const rawRequirement = usableDemand / prediction.predictedYield;
      const shortage = Math.max(
        0,
        rawRequirement + ingredient.safetyStock - inventory.quantity - inventory.incomingQuantity,
      );
      const packageCount = Math.ceil(shortage / item.packageQuantity);
      const quantity = packageCount * item.packageQuantity;
      const coverage = (inventory.quantity + inventory.incomingQuantity) / (rawRequirement || 1);
      const risk: Risk = coverage < 0.45 ? 'high' : coverage < 0.8 ? 'medium' : 'low';
      const decision = this.store.data.recommendationDecisions[ingredientId];
      return [
        {
          id: `rec_${ingredientId}`,
          ingredientId,
          ingredientName: ingredient.name,
          supplierId: supplier.id,
          supplierName: supplier.name,
          recommendedQuantity: decision?.quantity ?? quantity,
          packageCount: Math.ceil((decision?.quantity ?? quantity) / item.packageQuantity),
          unit: ingredient.unit,
          estimatedCost: round(
            Math.ceil((decision?.quantity ?? quantity) / item.packageQuantity) * item.price,
          ),
          risk,
          confidence: round((prediction.confidence + 0.9) / 2),
          status: (decision?.status as PurchaseRecommendation['status']) ?? 'pending',
          explanation: {
            usableDemand: round(usableDemand),
            predictedYield: prediction.predictedYield,
            rawRequirement: round(rawRequirement),
            currentInventory: inventory.quantity,
            incomingInventory: inventory.incomingQuantity,
            safetyStock: ingredient.safetyStock,
            recommendedQuantity: decision?.quantity ?? quantity,
          },
        },
      ];
    });
  }
  decide(id: string, status: 'approved' | 'rejected' | 'modified', quantity?: number) {
    const ingredientId = id.replace('rec_', '');
    if (!this.store.data.ingredients.some((x) => x.id === ingredientId))
      throw new NotFoundException('Recommendation not found');
    this.store.data.recommendationDecisions[ingredientId] = { status, quantity };
    return this.recommendations().find((x) => x.id === id);
  }
}
