import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'ID элемента корзины',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID товара',
    example: 123,
  })
  productId: number;

  @ApiProperty({
    description: 'Название товара',
    example: 'Смартфон',
  })
  name: string;

  @ApiProperty({
    description: 'Цена за единицу',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Количество',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Общая стоимость позиции',
    example: 199.98,
  })
  total: number;

  @ApiProperty({
    description: 'URL изображения товара',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Дата добавления в корзину',
  })
  createdAt: Date;
}
