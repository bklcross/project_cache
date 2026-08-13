import { Body, Controller, Post } from '@nestjs/common';
import { ReceivingService } from './receiving.service';
@Controller('receiving')
export class ReceivingController {
  constructor(private readonly service: ReceivingService) {}
  @Post() receive(
    @Body()
    body: {
      purchaseOrderId: string;
      items: Array<{ ingredientId: string; quantity: number }>;
    },
  ) {
    return this.service.receive(body);
  }
}
