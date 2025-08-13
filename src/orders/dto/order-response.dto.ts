import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../interfaces/order-status.enum';
import { OrderItemResponseDto } from './order-item-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class OrderResponseDto {
  @ApiProperty({ description: 'ID заказа' })
  id: string;

  @ApiProperty({ description: 'ID пользователя' })
  userId: number;

  /* @ApiProperty({
    type: 'object',
    description: 'Адрес доставки',
    example: {
      fullName: 'Иван Иванов',
      street: 'ул. Ленина, д. 15',
      city: 'Москва',
      region: 'Московская область',
      zipCode: '125009',
      country: 'Россия',
      phone: '+79161234567',
    },
  })
  shippingAddress: Record<string, any>;

  @ApiProperty({
    type: 'object',
    description: 'Способ оплаты',
    example: {
      type: 'card',
      details: { cardLastDigits: '1234' },
    },
  })
  paymentMethod: Record<string, any>; */

  @ApiProperty({
    description: 'Пользователь, оформивший заказ',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({ enum: OrderStatus, description: 'Статус заказа' })
  status: OrderStatus;

  @ApiProperty({ description: 'Общая сумма заказа' })
  total: number;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Товары в заказе' })
  items: OrderItemResponseDto[];

  @ApiProperty({ description: 'Дата создания заказа' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления заказа' })
  updatedAt: Date;

  @ApiProperty({ description: 'Трек-номер', required: false })
  trackingNumber?: string;

  @ApiProperty({ description: 'Комментарии', required: false })
  notes?: string;
}
