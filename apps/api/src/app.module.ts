import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { InventoryModule } from './inventory/inventory.module';
import { IngredientModule } from './ingredients/ingredient.module';
import { PlanningModule } from './planning/planning.module';
import { RecipeModule } from './recipes/recipe.module';
import { HealthController } from './health.controller';
@Module({
  imports: [
    CommonModule,
    InventoryModule,
    IngredientModule,
    RecipeModule,
    PlanningModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
