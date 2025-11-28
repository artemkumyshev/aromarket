import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { BrandDto } from './dto/brand.dto';

@ApiTags('Бренды')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Создание бренда' })
  @HttpCode(200)
  @Post()
  async create(@Body() dto: BrandDto) {
    return this.brandService.create(dto);
  }

  @ApiOperation({ summary: 'Обновление бренда' })
  @HttpCode(200)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: BrandDto) {
    return this.brandService.update(id, dto);
  }

  @ApiOperation({ summary: 'Удаление бренда' })
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.brandService.delete(id);
  }

  @ApiOperation({ summary: 'Список брендов' })
  @Get()
  async getAll() {
    return this.brandService.getAll();
  }

  @ApiOperation({ summary: 'Определенный бренд' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.brandService.getById(id);
  }

  @ApiOperation({ summary: 'Загрузка изображения бренда' })
  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBrandImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    console.log('REQ HEADERS:', req.headers['content-type']);
    console.log('REQ BODY:', req.body);
    console.log('REQ FILE:', file);

    return await this.brandService.updateImage(id, file);
  }

  @ApiOperation({ summary: 'Удаление изображения бренда' })
  @Delete(':id/image')
  async deleteBrandImage(@Param('id', ParseUUIDPipe) id: string) {
    return await this.brandService.removeImage(id);
  }

  @ApiOperation({ summary: 'Переключение видимости бренда' })
  @Patch(':id/toggle-visibility')
  async toggleVisibility(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { isVisible: boolean }) {
    return await this.brandService.toggleVisibility({
      brandId: id,
      isVisible: dto.isVisible,
    });
  }
}
