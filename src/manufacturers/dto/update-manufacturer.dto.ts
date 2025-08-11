import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateManufacturerDto {
  @ApiProperty({
    description: 'Название производителя',
    required: false,
    example: 'Samsung Electronics',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Описание производителя',
    required: false,
    example: 'Крупнейший южнокорейский производитель электроники',
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
    example: 'https://example.com/new-samsung-logo.png',
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    description: 'Активен ли производитель',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
