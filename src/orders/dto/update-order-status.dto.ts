import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../interfaces/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    description: 'Новый статус заказа',
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @ApiProperty({
    description: 'Трек-номер (если применимо)',
    required: false,
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty({
    description: 'Комментарий к изменению статуса',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
