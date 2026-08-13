import { Module } from '@nestjs/common';
import { ForecastingModule } from '../forecasting/forecasting.module';
import { RecipeModule } from '../recipes/recipe.module';
import { YieldModule } from '../yield/yield.module';
import { PurchasingController } from './purchasing.controller';
import { PurchasingService } from './purchasing.service';
@Module({
  imports: [ForecastingModule, RecipeModule, YieldModule],
  controllers: [PurchasingController],
  providers: [PurchasingService],
  exports: [PurchasingService],
})
export class PurchasingModule {}
