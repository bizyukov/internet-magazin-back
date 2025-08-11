import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
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
  @IsObject()
  @IsNotEmpty()
  shippingAddress: Record<string, any>;

  @ApiProperty({
    description: 'Способ оплаты',
    example: {
      type: 'card',
      details: { cardLastDigits: '1234' },
    },
  })
  @IsObject()
  @IsNotEmpty()
  paymentMethod: Record<string, any>;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Товары в заказе',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Комментарий к заказу',
    required: false,
  })
  notes?: string;
}
