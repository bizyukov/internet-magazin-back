import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Наименование товара',
    example: 'Смартфон Samsung Galaxy S21',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Описание товара',
    required: false,
    example: 'Флагманский смартфон Samsung',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Цена товара', example: 799.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Старая цена (для акций)',
    required: false,
    example: 899.99,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  oldPrice?: number;

  @ApiProperty({ description: 'Артикул', required: false, example: 'SM-G991B' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'URL изображения',
    required: false,
    example: 'https://example.com/s21.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Количество на складе', example: 100 })
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({
    description: 'Активен ли товар',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: 'ID категории', example: 5 })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ description: 'ID производителя', example: 3 })
  @IsInt()
  @IsOptional()
  manufacturerId?: number;
}
