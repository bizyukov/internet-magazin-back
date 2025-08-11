import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/categories/dto/category-response.dto';
import { ManufacturerResponseDto } from 'src/manufacturers/dto/manufacturer-response.dto';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Наименование товара',
    example: 'Смартфон Samsung Galaxy S21',
  })
  name: string;

  @ApiProperty({
    description: 'Описание товара',
    example: 'Флагманский смартфон Samsung',
  })
  description: string;

  @ApiProperty({ description: 'Цена товара', example: 799.99 })
  price: number;

  @ApiProperty({
    description: 'Старая цена (для акций)',
    example: 899.99,
    required: false,
  })
  oldPrice?: number;

  @ApiProperty({ description: 'Артикул', example: 'SM-G991B', required: false })
  sku?: string;

  @ApiProperty({
    description: 'URL изображения',
    example: 'https://example.com/s21.jpg',
  })
  imageUrl: string;

  @ApiProperty({ description: 'Количество на складе', example: 100 })
  stockQuantity: number;

  @ApiProperty({ description: 'Активен ли товар', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Категория товара',
    type: CategoryResponseDto,
    required: false,
  })
  category?: CategoryResponseDto;

  @ApiProperty({
    description: 'Производитель товара',
    type: ManufacturerResponseDto,
    required: false,
  })
  manufacturer?: ManufacturerResponseDto;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt: Date;
}
