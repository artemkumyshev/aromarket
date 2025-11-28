import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { ImageService } from './image.service';

@Module({
  imports: [ConfigModule],
  providers: [ImageService, PrismaService],
})
export class ImageModule {}
