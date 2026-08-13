import { Body, Controller, Get, Post } from '@nestjs/common';
import type { Recipe } from '@restaurant/shared';
import { RecipeService } from './recipe.service';
@Controller()
export class RecipeController {
  constructor(private readonly service: RecipeService) {}
  @Get('recipes') recipes() {
    return this.service.all();
  }
  @Post('recipes') create(@Body() body: Omit<Recipe, 'id'>) {
    return this.service.create(body);
  }
}
