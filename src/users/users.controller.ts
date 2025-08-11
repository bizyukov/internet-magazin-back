import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Создание нового пользователя (админ)' })
  @ApiResponse({ status: 201, description: 'Пользователь создан', type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получение списка пользователей (админ)' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [User],
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
  ) {
    return this.usersService.findAll(page, limit, search, role);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получение пользователя по ID (админ)' })
  @ApiResponse({ status: 200, description: 'Пользователь', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Обновление пользователя (админ)' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь обновлен',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Изменение роли пользователя (админ)' })
  @ApiResponse({ status: 200, description: 'Роль обновлена', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return this.usersService.updateRole(+id, role);
  }

  @Put(':id/block')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Блокировка пользователя (админ)' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь заблокирован',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async block(@Param('id') id: string): Promise<User> {
    return this.usersService.blockUser(+id);
  }

  @Put(':id/unblock')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Разблокировка пользователя (админ)' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь разблокирован',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async unblock(@Param('id') id: string): Promise<User> {
    return this.usersService.unblockUser(+id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Удаление пользователя (админ)' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
