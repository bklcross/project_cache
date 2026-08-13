import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const corsOrigins = process.env.CORS_ORIGINS ?? 'http://localhost:3000';
  const allowedOrigins =
    corsOrigins === '*' ? true : corsOrigins.split(',').map((origin) => origin.trim());
  app.enableCors({ origin: allowedOrigins });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
void bootstrap();
