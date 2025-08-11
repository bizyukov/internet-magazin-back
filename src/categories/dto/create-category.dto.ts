import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Название категории', example: 'Смартфоны' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Описание категории',
    required: false,
    example: 'Мобильные телефоны',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL изображения категории',
    required: false,
    example: 'https://example.com/category.jpg',
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

  @ApiProperty({ description: 'Позиция в списке', example: 1, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number = 0;

  @ApiProperty({
    description: 'Активна ли категория',
    example: true,
    default: true,
  })
  @IsOptional()
  isActive?: boolean = true;
}
