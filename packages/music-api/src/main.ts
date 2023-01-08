import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from 'filters/http-execption.filter';
import { TransformInterceptor } from 'interceptors/transform.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
