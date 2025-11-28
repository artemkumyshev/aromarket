import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/modules/prisma.service';
import { ImageService } from '../image/image.service';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [ConfigModule],
  controllers: [BrandController],
  providers: [BrandService, PrismaService, ImageService],
})
export class BrandModule {}
