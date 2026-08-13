import { Body, Controller, Get, Post } from '@nestjs/common';
import { WasteService } from './waste.service';
@Controller('waste')
export class WasteController {
  constructor(private readonly service: WasteService) {}
  @Get() all() {
    return this.service.all();
  }
  @Post() add(
    @Body()
    body: {
      ingredientId: string;
      quantity: number;
      unit: string;
      reason: string;
      cost?: number;
    },
  ) {
    return this.service.add(body);
  }
}
