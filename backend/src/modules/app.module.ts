import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { BrandModule } from './brand/brand.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true, // Enable variable expansion (e.g., ${VAR})
      cache: true, // Cache environment variables for better performance
    }),
    BrandModule,
    ImageModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
