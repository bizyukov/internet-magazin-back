import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto {
  @ApiProperty({
    description: 'ID корзины',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID пользователя',
    example: 42,
  })
  userId: number;

  @ApiProperty({
    description: 'Общая стоимость корзины',
    example: 199.98,
  })
  total: number;

  @ApiProperty({
    description: 'Общее количество товаров',
    example: 5,
  })
  itemsCount: number;

  @ApiProperty({
    type: [CartItemResponseDto],
    description: 'Элементы корзины',
  })
  items: CartItemResponseDto[];

  @ApiProperty({
    description: 'Дата создания корзины',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления корзины',
  })
  updatedAt: Date;
}
