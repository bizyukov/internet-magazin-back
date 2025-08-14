import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

class OrderItemDto {
  @ApiProperty({ description: 'ID товара', example: 123 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'Количество', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID адреса доставки', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  shippingAddressId: number;

  @ApiProperty({ description: 'ID адреса для выставления счета', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  billingAddressId: number;

  @ApiProperty({ description: 'ID платежного метода', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  paymentMethodId: number;

  @ApiProperty({
    description: 'Товары в заказе',
    type: [OrderItemDto],
    example: [{ productId: 123, quantity: 2 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Комментарий к заказу', required: false })
  notes?: string;
}
