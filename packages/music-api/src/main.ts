import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from 'filters/http-execption.filter';
import { TransformInterceptor } from 'interceptors/transform.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(configService.get('API_PREFIX') || 'api');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  const port = configService.get<number>('API_PORT') || 3000;
  await app.listen(port);
  Logger.log(`Appplication started on port: ${port}`);
}
bootstrap();
