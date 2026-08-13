import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}
  @Get() all() {
    return this.service.findAll();
  }
  @Get(':id') one(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Post('counts') count(@Body() body: { ingredientId: string; quantity: number }) {
    return this.service.count(body);
  }
}
