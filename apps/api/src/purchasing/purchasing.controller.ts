import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchasingService } from './purchasing.service';
@Controller('purchasing')
export class PurchasingController {
  constructor(private readonly service: PurchasingService) {}
  @Get('recommendations') all() {
    return this.service.recommendations();
  }
  @Post(':id/approve') approve(@Param('id') id: string) {
    return this.service.decide(id, 'approved');
  }
  @Post(':id/reject') reject(@Param('id') id: string) {
    return this.service.decide(id, 'rejected');
  }
  @Post(':id/modify') modify(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.service.decide(id, 'modified', body.quantity);
  }
}
