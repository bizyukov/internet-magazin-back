import { ApiProperty } from '@nestjs/swagger';

export class ManufacturerResponseDto {
  @ApiProperty({ description: 'ID производителя', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название производителя', example: 'Samsung' })
  name: string;

  @ApiProperty({
    description: 'Описание производителя',
    example: 'Южнокорейская компания, производитель электроники',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Страна производителя',
    example: 'Южная Корея',
    required: false,
  })
  country?: string;

  @ApiProperty({
    description: 'Веб-сайт производителя',
    example: 'https://www.samsung.com',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'URL логотипа производителя',
    example: 'https://example.com/samsung-logo.png',
    required: false,
  })
  logoUrl?: string;

  @ApiProperty({ description: 'Активен ли производитель', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt: Date;
}
