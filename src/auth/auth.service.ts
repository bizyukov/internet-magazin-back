import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.model';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './interfaces/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }

    const passwordValid = await bcrypt.compare(pass, user?.dataValues.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }

    const { password, ...result } = user.get({ plain: true });
    return { ...result, role: user.dataValues.role };
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto): Promise<Tokens> {
    const existingUser = await this.userService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new UnauthorizedException(
        'Пользователь с таким email уже существует',
      );
    }

    const newUser = await this.userService.create({
      ...registerDto,
      role: 'user' as UserRole,
    });

    return this.generateTokens(newUser);
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      return this.generateTokens(user.dataValues);
    } catch (e) {
      throw new UnauthorizedException('Недействительный токен');
    }
  }

  private async generateTokens(user: Partial<User>): Promise<Tokens> {
    const payload = {
      role: user.role,
      email: user.email,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
    });

    return { accessToken, refreshToken };
  }
}
