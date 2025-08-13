import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван Иванов' })
  name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Роль пользователя',
    example: 'user',
    enum: ['user', 'admin', 'manager', 'content'],
  })
  role: string;
}
