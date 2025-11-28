import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true, // Enable variable expansion (e.g., ${VAR})
      cache: true, // Cache environment variables for better performance
    }),
  ],
  providers: [],
})
export class AppModule {}
