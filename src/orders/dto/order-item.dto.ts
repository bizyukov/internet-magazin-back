import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ description: 'ID товара' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'Название товара' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Цена за единицу' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Количество' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'URL изображения', required: false })
  imageUrl?: string;
}
