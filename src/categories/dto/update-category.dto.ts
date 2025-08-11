import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Название категории',
    example: 'Смартфоны и гаджеты',
    required: false,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Описание категории',
    required: false,
    example: 'Мобильные телефоны и аксессуары',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL изображения категории',
    required: false,
    example: 'https://example.com/new-category.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'ID родительской категории',
    required: false,
    example: 1,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: 'Позиция в списке', example: 2, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @ApiProperty({
    description: 'Активна ли категория',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
