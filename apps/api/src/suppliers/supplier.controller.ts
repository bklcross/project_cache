import { Controller, Get, Param } from '@nestjs/common';
import { SupplierService } from './supplier.service';
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly service: SupplierService) {}
  @Get() all() {
    return this.service.all();
  }
  @Get(':id') one(@Param('id') id: string) {
    return this.service.one(id);
  }
}
