import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Тип платежного метода',
    example: 'card',
    enum: ['card', 'paypal', 'cash'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Детали платежного метода',
    example: {
      cardNumber: '**** **** **** 1234',
      expiry: '12/24',
      cardHolder: 'IVAN IVANOV',
    },
  })
  @IsObject()
  @IsNotEmpty()
  details: Record<string, any>;

  @ApiProperty({ description: 'Использовать по умолчанию', example: false })
  @IsBoolean()
  isDefault?: boolean;
}
