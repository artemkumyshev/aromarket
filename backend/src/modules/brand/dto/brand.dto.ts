import { ApiProperty } from '@nestjs/swagger';
import { BrandType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class BrandDto {
  @ApiProperty({
    title: 'title',
    description: 'Название бренда',
    example: 'Dior',
  })
  @IsString({ message: 'Название обязательно и должно быть строкой' })
  title: string;

  @ApiProperty({
    title: 'description',
    description: 'Полное описание бренда',
    example: 'Французский модный дом, основанный в 1946 году.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @ApiProperty({
    title: 'shortTitle',
    description: 'Короткое название бренда для компактного отображения',
    example: 'Dior',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Краткое название должно быть строкой' })
  shortTitle?: string;

  @ApiProperty({
    title: 'shortDescription',
    description: 'Краткое маркетинговое описание',
    example: 'Элегантный французский бренд.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Краткое описание должно быть строкой' })
  shortDescription?: string;

  @ApiProperty({
    title: 'type',
    description: 'Тип бренда',
    enum: BrandType,
    example: BrandType.MASS_MARKET,
    required: false,
  })
  @IsOptional()
  @IsEnum(BrandType, {
    message: 'Тип бренда должен быть одним из: DESIGNER, NICHE, MASS_MARKET, INDIE',
  })
  type?: BrandType;

  @ApiProperty({
    title: 'countryCode',
    description: 'Код страны ISO 3166-1 alpha-2',
    example: 'FR',
    maxLength: 2,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Код страны должен быть строкой' })
  @MaxLength(2, { message: 'Код страны должен состоять из 2 символов' })
  countryCode?: string;

  @ApiProperty({
    title: 'sortOrder',
    description: 'Порядковый номер бренда в списке',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Порядок сортировки должен быть числом' })
  sortOrder?: number;

  @ApiProperty({
    title: 'published',
    description: 'Флаг публикации бренда',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'published должно быть true или false' })
  published?: boolean;
}
