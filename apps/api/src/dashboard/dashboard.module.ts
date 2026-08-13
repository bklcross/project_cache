import { Module } from '@nestjs/common';
import { ForecastingModule } from '../forecasting/forecasting.module';
import { PurchasingModule } from '../purchasing/purchasing.module';
import { WasteModule } from '../waste/waste.module';
import { YieldModule } from '../yield/yield.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
@Module({
  imports: [ForecastingModule, PurchasingModule, WasteModule, YieldModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
