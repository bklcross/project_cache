import { Controller, Post } from '@nestjs/common';
import { JsonStore } from '../common/json-store.service';
@Controller('demo')
export class DemoController {
  constructor(private readonly store: JsonStore) {}
  @Post('reset') async reset() {
    await this.store.reset();
    return { reset: true };
  }
}
