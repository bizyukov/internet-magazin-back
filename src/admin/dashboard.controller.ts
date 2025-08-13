import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Основные метрики системы' })
  @ApiResponse({
    status: 200,
    description: 'Статистика системы',
    schema: {
      example: {
        ordersCount: 150,
        revenue: 125000.5,
        usersCount: 85,
        productsCount: 42,
      },
    },
  })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Последние заказы' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество заказов',
    example: 5,
  })
  @ApiResponse({ status: 200, description: 'Список последних заказов' })
  async getRecentOrders(@Query('limit') limit = 5) {
    return this.dashboardService.getRecentOrders(limit);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Популярные товары' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество товаров',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Список популярных товаров',
    schema: {
      example: [
        { productId: 123, totalSold: 42 },
        { productId: 456, totalSold: 35 },
      ],
    },
  })
  async getTopProducts(@Query('limit') limit = 5) {
    return this.dashboardService.getTopProducts(limit);
  }
}
