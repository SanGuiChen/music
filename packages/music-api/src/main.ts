import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from 'filters/http-execption.filter';
import { TransformInterceptor } from 'interceptors/transform.interceptor';
import { AppModule } from './app.module';
import { ValidationError } from 'errors/validation.error';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        // 将class-validator的错误信息转换为普通对象
        const validationErrors = {};
        errors.forEach((error) => {
          const { property, constraints } = error;
          validationErrors[property] = Object.values(constraints);
        });
        // 抛出自定义的ValidationException异常
        throw new ValidationError(validationErrors);
      },
    }),
  );
  app.setGlobalPrefix(configService.get('API_PREFIX') || 'api');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Music Api')
    .setDescription('The Music API description')
    .setVersion('1.0')
    .addTag('muses')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('API_PORT') || 3000;
  await app.listen(port);
  Logger.log(`Appplication started on port: ${port}`);
  Logger.log(`Music Api Docs on http://localhost:3000/api`);
}
bootstrap();
