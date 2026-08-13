import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DemoModule } from './demo/demo.module';
import { ForecastingModule } from './forecasting/forecasting.module';
import { InventoryModule } from './inventory/inventory.module';
import { PurchaseOrderModule } from './purchase-orders/purchase-order.module';
import { PurchasingModule } from './purchasing/purchasing.module';
import { ReceivingModule } from './receiving/receiving.module';
import { RecipeModule } from './recipes/recipe.module';
import { SupplierModule } from './suppliers/supplier.module';
import { WasteModule } from './waste/waste.module';
import { YieldModule } from './yield/yield.module';
import { HealthController } from './health.controller';
@Module({
  imports: [
    CommonModule,
    InventoryModule,
    RecipeModule,
    ForecastingModule,
    YieldModule,
    SupplierModule,
    PurchasingModule,
    PurchaseOrderModule,
    ReceivingModule,
    WasteModule,
    DashboardModule,
    DemoModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
