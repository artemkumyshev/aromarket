import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Brand, ImageType } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma.service';
import { generateSlug } from 'src/shared/libs';
import { ImageService } from '../image/image.service';
import { BrandDto } from './dto/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  /**
   * Создание бренда
   * @param dto - данные бренда
   * @returns бренд
   */
  async create(dto: BrandDto): Promise<Brand> {
    await this.isUnique(dto.title, 'title');

    return this.prisma.brand.create({
      data: {
        ...dto,
        slug: generateSlug(dto.title),
      },
    });
  }

  /**
   * Обновление бренда
   * @param id - id бренда
   * @param dto - данные бренда
   * @returns бренд
   */
  async update(id: string, dto: BrandDto): Promise<Brand> {
    await this.isUnique(id, 'id');

    return this.prisma.brand.update({
      where: { id },
      data: {
        ...dto,
        slug: generateSlug(dto.title),
      },
    });
  }

  /**
   * Удаление бренда
   * @param id - id бренда
   * @returns бренд
   */
  async delete(id: string): Promise<Brand> {
    await this.isUnique(id);

    return this.prisma.brand.delete({
      where: { id },
    });
  }

  /**
   * Получение всех брендов
   * @returns список брендов
   */
  async getAll(): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany({
      include: { image: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (!brands.length) {
      throw new NotFoundException('Бренды не найдены');
    }

    return brands;
  }

  /**
   * Получение бренда по id
   * @param id - id бренда
   * @returns бренд
   */
  async getById(id: string): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    return brand;
  }

  /**
   * Получение бренда по slug
   * @param slug - slug бренда
   * @returns бренд
   */
  async getBySlug(slug: string): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    return brand;
  }

  /**
   * Сортировка брендов
   * @param brands - список брендов
   * @returns список брендов
   */
  async sortOrder(brands: { id: string; sortOrder: number }[]) {
    await this.prisma.$transaction(
      brands.map((brand) =>
        this.prisma.brand.update({
          where: { id: brand.id },
          data: { sortOrder: brand.sortOrder },
        }),
      ),
    );

    return {
      data: {
        status: 'success',
        message: 'Бренды успешно отсортированы',
      },
    };
  }

  /**
   * Загрузка/обновление изображения бренда:
   * - удаляем старое изображение (если было)
   * - сохраняем новый файл (через ImageService)
   * - привязываем Image к Brand (imageId)
   * - возвращаем бренд с картинкой
   */
  async updateImage(brandId: string, file: Express.Multer.File): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
      include: { image: true },
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    // если было старое изображение — удаляем
    if (brand.imageId) {
      await this.imageService.deleteImagesByIds([brand.imageId]);
    }

    // сохраняем новое изображение
    const image = await this.imageService.saveSingleImage({
      file,
      folder: 'brands',
      type: ImageType.BRAND,
      parentId: brandId,
    });

    // привязываем к бренду
    const updatedBrand = await this.prisma.brand.update({
      where: { id: brandId },
      data: {
        imageId: image.id,
      },
      include: {
        image: true,
      },
    });

    return updatedBrand;
  }

  /**
   * Удалить изображение у бренда по запросу:
   * - если бренд не найден → 404
   * - если изображения нет → просто возвращаем бренд как есть
   * - если есть → удаляем файл + запись Image, отвязываем от бренда
   */
  async removeImage(brandId: string): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
      include: { image: true },
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    if (brand.imageId) {
      // удаляем сам файл и запись в таблице image
      await this.imageService.deleteImagesByIds([brand.imageId]);
    }

    const updatedBrand = await this.prisma.brand.update({
      where: { id: brandId },
      data: {
        imageId: null,
      },
      include: {
        image: true,
      },
    });

    return updatedBrand;
  }

  async toggleVisibility({ brandId, isVisible }: { brandId: string; isVisible: boolean }) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    return this.prisma.brand.update({
      where: { id: brandId },
      data: { published: isVisible },
    });
  }

  private async isUnique(query: string, variant: 'title' | 'id' = 'id') {
    const brand = await this.prisma.brand.findUnique({
      where: {
        title: variant === 'title' ? query : undefined,
        id: variant === 'id' ? query : undefined,
      },
    });

    if (brand) {
      throw new ConflictException(`Бренд уже существует`);
    }

    return true;
  }
}
