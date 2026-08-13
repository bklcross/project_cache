import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly service: PurchaseOrderService) {}
  @Get() all() {
    return this.service.all();
  }
  @Get(':id') one(@Param('id') id: string) {
    return this.service.one(id);
  }
  @Post() create(@Body() body: { recommendationIds: string[] }) {
    return this.service.create(body);
  }
}
