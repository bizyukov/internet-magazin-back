import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { mapUserToResponseDto, UserResponseDto } from './user.mapper';

@ApiTags('Пользователь')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Профиль пользователя',
    type: UserResponseDto,
  })
  async getProfile(@Req() req): Promise<UserResponseDto | null> {
    const user = await this.userService.findById(req.user.id);
    return user ? mapUserToResponseDto(user) : null;
  }

  @Put('profile')
  @ApiOperation({ summary: 'Обновить профиль текущего пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Профиль обновлен',
    type: UserResponseDto,
  })
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto | null> {
    const user = await this.userService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
    return user ? mapUserToResponseDto(user) : null;
  }

  @Put('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить пароль текущего пользователя' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Пароль успешно изменен',
  })
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.changePassword(req.user.id, changePasswordDto);
  }
}
