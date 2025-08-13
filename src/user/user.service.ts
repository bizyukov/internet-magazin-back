import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';
import { UpdateProfileDto } from 'src/user/dto/update-profile.dto';
import { CreateUserDto } from '../admin/dto/create-user.dto';
import { UpdateUserDto } from '../admin/dto/update-user.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.scope('withPassword').findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    //const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userModel.create({
      ...createUserDto,
      //password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    role?: UserRole,
  ): Promise<{ items: User[]; total: number }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset,
      attributes: { exclude: ['password'] },
    });

    return { items: rows, total: count };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return user.update(updateUserDto);
  }

  async updateRole(id: number, role: UserRole): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.update({ role });
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await user.destroy();
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.update({ isActive: false });
  }

  async unblockUser(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.update({ isActive: true });
  }

  async updateProfile(
    userId: number,
    updateDto: UpdateProfileDto,
  ): Promise<User | null> {
    const user = await this.findById(userId);

    if (user) {
      // Обновляем только переданные поля
      if (updateDto.name) user.name = updateDto.name;
      if (updateDto.email) user.email = updateDto.email;

      await user.save();
      return this.userModel.findByPk(userId); // Возвращаем обновленного пользователя без пароля
    } else {
      throw new NotFoundException();
    }
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.scope('withPassword').findByPk(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Неверный текущий пароль');
    }

    // Хешируем новый пароль
    //const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await user.save();
  }
}
