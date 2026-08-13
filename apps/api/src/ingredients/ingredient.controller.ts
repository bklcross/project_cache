import { Body, Controller, Get, Post } from '@nestjs/common';
import type { CreateIngredient } from '@restaurant/shared';
import { IngredientService } from './ingredient.service';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly service: IngredientService) {}

  @Get()
  all() {
    return this.service.all();
  }

  @Post()
  create(@Body() body: CreateIngredient) {
    return this.service.create(body);
  }
}
