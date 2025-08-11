import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateManufacturerDto {
  @ApiProperty({ description: 'Название производителя', example: 'Samsung' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Описание производителя',
    required: false,
    example: 'Южнокорейская компания, производитель электроники',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Страна производителя',
    required: false,
    example: 'Южная Корея',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Веб-сайт производителя',
    required: false,
    example: 'https://www.samsung.com',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: 'URL логотипа производителя',
    required: false,
    example: 'https://example.com/samsung-logo.png',
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    description: 'Активен ли производитель',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
