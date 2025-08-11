import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import express from 'express';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      return false;
    }

    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return requiredRoles.some((role) => payload.role === role);
  }

  private extractToken(request: express.Request): string | null {
    return (
      request.cookies?.accessToken ||
      request.headers?.authorization?.split(' ')[1] ||
      null
    );
  }
}
