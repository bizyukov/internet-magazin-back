import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'ID категории', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название категории', example: 'Смартфоны' })
  name: string;

  @ApiProperty({
    description: 'Описание категории',
    example: 'Мобильные телефоны',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL изображения категории',
    example: 'https://example.com/category.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'ID родительской категории',
    example: 1,
    required: false,
  })
  parentId?: number;

  @ApiProperty({ description: 'Позиция в списке', example: 1 })
  position: number;

  @ApiProperty({ description: 'Активна ли категория', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Дочерние категории',
    type: [CategoryResponseDto],
    required: false,
  })
  children?: CategoryResponseDto[];

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt: Date;
}
