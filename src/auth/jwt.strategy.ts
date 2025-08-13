import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express'; // Добавляем импорт Request
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { User } from '../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Проверяем наличие токена в куках или заголовке
          return (
            request?.cookies?.accessToken ||
            request?.headers?.authorization?.split(' ')[1] ||
            null
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret', // Гарантируем строку
    };

    super(options);
  }

  async validate(payload: any): Promise<Partial<User>> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
