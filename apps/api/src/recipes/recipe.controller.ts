import { Controller, Get } from '@nestjs/common';
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
  @Get('menu-items') menu() {
    return this.store.data.menuItems;
  }
}
