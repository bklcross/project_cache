import { Global, Module } from '@nestjs/common';
import { JsonStore } from './json-store.service';
@Global()
@Module({ providers: [JsonStore], exports: [JsonStore] })
export class CommonModule {}
