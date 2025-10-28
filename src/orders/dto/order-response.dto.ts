import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { OrderStatus } from '../interfaces/order-status.enum';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @ApiProperty({ description: 'ID заказа' })
  uuid: string;

  @ApiProperty({ description: 'ID пользователя' })
  userId: number;

  @ApiProperty({
    description: 'Адрес доставки',
  })
  shippingAddress: Record<string, any>;

  @ApiProperty({
    description: 'Способ оплаты',
  })
  paymentMethod: Record<string, any>;

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
