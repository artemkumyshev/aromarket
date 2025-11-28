import { BadRequestException, Injectable } from '@nestjs/common';
import { type Image, type ImageType } from '@prisma/client';
import { path as appRootPath } from 'app-root-path';
import { randomUUID } from 'crypto';
import { ensureDir, remove, writeFile } from 'fs-extra';
import { extname, join } from 'path';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  private getUploadFolder(folder: string) {
    return join(appRootPath, 'uploads', folder);
  }

  private async saveFileToDisk(file: Express.Multer.File, folder: string, type: ImageType): Promise<{ url: string; name: string }> {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }

    const uploadFolder = this.getUploadFolder(folder);
    await ensureDir(uploadFolder);

    const fileName = this.buildUniqueFileName(type, file);
    const filePath = join(uploadFolder, fileName);

    await writeFile(filePath, file.buffer);

    return {
      url: `/uploads/${folder}/${fileName}`,
      name: fileName,
    };
  }

  private buildUniqueFileName(type: ImageType, file: Express.Multer.File): string {
    const extension = extname(file.originalname) || '';
    const normalizedType = String(type).toLowerCase();
    return `${normalizedType}-${randomUUID()}${extension}`;
  }

  private getAbsolutePathFromUrl(url: string): string {
    // url вида: /uploads/brands/xxxx.png
    const clean = url.startsWith('/') ? url.slice(1) : url;
    return join(appRootPath, clean);
  }

  /**
   * Сохранить ОДНО изображение на диск и создать запись в таблице Image
   */
  async saveSingleImage(options: {
    file: Express.Multer.File;
    folder: string; // 'brands' | 'products' и т.п.
    type: ImageType; // ImageType.BRAND / PRODUCT
    parentId: string; // id бренда/продукта
  }): Promise<Image> {
    const { file, folder, type, parentId } = options;

    if (!file) {
      throw new BadRequestException('Файл не передан или некорректный');
    }

    const { url } = await this.saveFileToDisk(file, folder, type);

    return this.prisma.image.create({
      data: {
        type,
        url,
        parentId,
      },
    });
  }

  /**
   * Удалить КОНКРЕТНОЕ изображение по id:
   * - удалить файл с диска
   * - удалить запись из БД
   */
  async deleteImageById(imageId: string): Promise<void> {
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      // тихо выходим, если уже нет записи
      return;
    }

    const absolutePath = this.getAbsolutePathFromUrl(image.url);

    // удаляем файл, даже если его уже нет — без падения
    await remove(absolutePath).catch(() => undefined);

    // удаляем запись из БД
    await this.prisma.image.delete({
      where: { id: imageId },
    });
  }

  /**
   * Удалить ВСЕ изображения по parentId (например, при удалении бренда/продукта)
   */
  async deleteImagesByParent(options: { parentId: string; type?: ImageType }): Promise<void> {
    const { parentId, type } = options;

    const images = await this.prisma.image.findMany({
      where: {
        parentId,
        ...(type ? { type } : {}),
      },
    });

    await Promise.all(
      images.map(async (img) => {
        const absolutePath = this.getAbsolutePathFromUrl(img.url);
        await remove(absolutePath).catch(() => undefined);
        await this.prisma.image.delete({ where: { id: img.id } });
      }),
    );
  }

  /**
   * Удалить несколько изображений по списку imageIds:
   * - удалить файлы с диска
   * - удалить записи из БД (deleteMany)
   */
  async deleteImagesByIds(ids: string[]): Promise<void> {
    if (!ids.length) return;

    // получаем данные по существующим изображениям
    const images = await this.prisma.image.findMany({
      where: {
        id: { in: ids },
      },
    });

    if (!images.length) {
      return;
    }

    // удаляем все файлы на диске
    await Promise.all(
      images.map(async (img) => {
        const absolutePath = this.getAbsolutePathFromUrl(img.url);
        await remove(absolutePath).catch(() => undefined); // если файла нет — игнорим
      }),
    );

    // удаляем пакетом все записи из БД
    await this.prisma.image.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
