import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'ID товара',
    example: 123,
  })
  productId: number;

  @ApiProperty({
    description: 'Название товара',
    example: 'Смартфон Samsung Galaxy S21',
  })
  name: string;

  @ApiProperty({
    description: 'Цена за единицу на момент заказа',
    example: 899.99,
  })
  price: number;

  @ApiProperty({
    description: 'Количество товара',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'URL изображения товара',
    example: 'https://example.com/images/s21.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Общая стоимость позиции (price * quantity)',
    example: 1799.98,
  })
  total: number;

  constructor(item: any) {
    this.productId = item.productId;
    this.name = item.name;
    this.price = item.price;
    this.quantity = item.quantity;
    this.imageUrl = item.imageUrl;
    this.total = parseFloat((item.price * item.quantity).toFixed(2));
  }
}
