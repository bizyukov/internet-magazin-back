import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Текущий пароль',
    example: 'oldPassword123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'Новый пароль (мин. 6 символов)',
    example: 'newSecurePassword456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
