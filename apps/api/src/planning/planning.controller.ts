import { Body, Controller, Post } from '@nestjs/common';
import type { ProductionPlanItem } from '@restaurant/shared';
import { PlanningService } from './planning.service';

@Controller('plans')
export class PlanningController {
  constructor(private readonly service: PlanningService) {}

  @Post('calculate')
  calculate(@Body() body: { items: ProductionPlanItem[] }) {
    return this.service.calculate(body.items ?? []);
  }
}
