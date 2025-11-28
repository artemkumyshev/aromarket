import 'dotenv/config';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './shared/interceptors';
import { HttpExceptionFilter } from './shared/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS Configuration
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  const corsCredentials = configService.get<boolean>('CORS_CREDENTIALS', true);

  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: corsCredentials,
  });

  // Swagger Configuration
  const swaggerTitle = configService.get<string>('SWAGGER_TITLE', 'Fullstack Starter API');
  const swaggerDescription = configService.get<string>('SWAGGER_DESCRIPTION', 'Fullstack Starter Template API Documentation');
  const swaggerVersion = configService.get<string>('SWAGGER_VERSION', '1.0');
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');

  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'jwt')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, doc);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

void bootstrap();
