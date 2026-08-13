import { Injectable } from '@nestjs/common';
import type { Dashboard, Risk } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';
import { ForecastingService } from '../forecasting/forecasting.service';
import { PurchasingService } from '../purchasing/purchasing.service';
import { WasteService } from '../waste/waste.service';
import { YieldService } from '../yield/yield.service';
@Injectable()
export class DashboardService {
  constructor(
    private readonly store: JsonStore,
    private readonly forecasting: ForecastingService,
    private readonly purchasing: PurchasingService,
    private readonly waste: WasteService,
    private readonly yields: YieldService,
  ) {}
  get(): Dashboard {
    const recommendations = this.purchasing.recommendations();
    const forecast = this.forecasting.forecasts();
    const waste = this.waste.summary();
    const risks = recommendations
      .filter((x) => x.risk !== 'low')
      .map((x) => ({
        ingredientId: x.ingredientId,
        name: x.ingredientName,
        daysRemaining: Number(
          (x.explanation.currentInventory / (x.explanation.rawRequirement / 3 || 1)).toFixed(1),
        ),
        risk: x.risk as Risk,
      }));
    const yieldAlerts = this.store.data.ingredients
      .map((x) => ({ ingredient: x, prediction: this.yields.predict(x.id) }))
      .filter((x) => x.prediction.predictedYield < x.ingredient.baselineYield * 0.98)
      .map((x) => ({
        ingredientId: x.ingredient.id,
        name: x.ingredient.name,
        predictedYield: x.prediction.predictedYield,
        baselineYield: x.ingredient.baselineYield,
      }));
    const inventoryVariance = this.store.data.inventory.reduce(
      (s, x) => s + Math.abs(x.quantity - x.theoreticalQuantity),
      0,
    );
    return {
      summary: {
        inventoryValue: Math.round(
          this.store.data.inventory.reduce((s, x) => {
            const price = this.store.data.supplierItems.find(
              (p) => p.ingredientId === x.ingredientId,
            );
            return s + x.quantity * (price ? price.price / price.packageQuantity : 0);
          }, 0),
        ),
        openRecommendations: recommendations.filter((x) => x.status === 'pending').length,
        stockoutRisks: risks.filter((x) => x.risk === 'high').length,
        forecastedCovers: forecast.reduce((s, x) => s + x.expected, 0),
        wasteCost: waste.totalCost,
      },
      recommendations: recommendations.slice(0, 5),
      risks,
      forecast,
      waste,
      yieldAlerts,
      inventoryVariance: Number(inventoryVariance.toFixed(1)),
    };
  }
}
