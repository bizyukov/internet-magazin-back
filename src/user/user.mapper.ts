import { User } from 'src/user/user.model';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function mapUserToResponseDto(user: User): UserResponseDto {
  return {
    id: user.dataValues.id,
    name: user.dataValues.name,
    email: user.dataValues.email,
    role: user.dataValues.role,
    isActive: user.dataValues.isActive,
    lastLogin: user.dataValues.lastLogin,
    createdAt: user.dataValues.createdAt,
    updatedAt: user.dataValues.updatedAt,
  };
}
