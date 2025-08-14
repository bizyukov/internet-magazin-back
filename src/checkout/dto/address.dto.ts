import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({ description: 'Полное имя', example: 'Иван Иванов' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Улица и дом', example: 'ул. Ленина, д. 15' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Город', example: 'Москва' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Область/край', example: 'Московская область' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ description: 'Почтовый индекс', example: '125009' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ description: 'Страна', example: 'Россия' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Телефон', example: '+79161234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Использовать по умолчанию', example: false })
  @IsBoolean()
  isDefault?: boolean;
}
