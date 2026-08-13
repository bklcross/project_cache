import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { YieldService } from './yield.service';
@Controller()
export class YieldController {
  constructor(private readonly service: YieldService) {}
  @Get('yields') all() {
    return this.service.all();
  }
  @Get('yields/:ingredientId') one(@Param('ingredientId') id: string) {
    return this.service.predict(id);
  }
  @Post('prep-sessions') add(
    @Body()
    body: {
      ingredientId: string;
      supplierId: string;
      rawWeight: number;
      usableWeight: number;
      note?: string;
    },
  ) {
    return this.service.add(body);
  }
}
