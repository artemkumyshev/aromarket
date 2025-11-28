import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

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
