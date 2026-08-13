import { Controller, Get, Query } from '@nestjs/common';
import { ForecastingService } from './forecasting.service';
@Controller('forecasts')
export class ForecastingController {
  constructor(private readonly service: ForecastingService) {}
  @Get() all(@Query('date') date?: string) {
    return this.service.forecasts(date);
  }
  @Get('menu-items') menu(@Query('date') date?: string) {
    return this.service.forecasts(date);
  }
}
