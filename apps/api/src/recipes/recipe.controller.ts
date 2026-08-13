import { Body, Controller, Get, Post } from '@nestjs/common';
import type { Recipe } from '@restaurant/shared';
import { JsonStore } from '../common/json-store.service';
import { RecipeService } from './recipe.service';
@Controller()
export class RecipeController {
  constructor(
    private readonly service: RecipeService,
    private readonly store: JsonStore,
  ) {}
  @Get('recipes') recipes() {
    return this.service.all();
  }
  @Post('recipes') create(@Body() body: Omit<Recipe, 'id'>) {
    return this.service.create(body);
  }
  @Get('ingredients') ingredients() {
    return this.store.data.ingredients;
  }
}
