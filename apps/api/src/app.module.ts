import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { InventoryModule } from './inventory/inventory.module';
import { PlanningModule } from './planning/planning.module';
import { RecipeModule } from './recipes/recipe.module';
import { HealthController } from './health.controller';
@Module({
  imports: [
    CommonModule,
    InventoryModule,
    RecipeModule,
    PlanningModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
