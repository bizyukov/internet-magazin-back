import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import express from 'express';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './interfaces/order-status.enum';
import { OrdersService } from './orders.service';

@ApiTags('Заказы')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Создание нового заказа' })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    type: OrderResponseDto,
  })
  async create(
    @Req() req: express.Request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto | null> {
    const userId = req.user?.['id'];
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get('user')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Получение заказов текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список заказов',
    type: [OrderResponseDto],
  })
  async getUserOrders(
    @Req() req: express.Request,
  ): Promise<PaginatedResponse<OrderResponseDto>> {
    const userId = req.user?.['id'];
    return this.ordersService.getUserOrders(userId);
  }

  @Get(':id')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Получение заказа по ID' })
  @ApiResponse({
    status: 200,
    description: 'Детали заказа',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async getOrderById(
    @Req() req: express.Request,
    @Param('id') id: string,
  ): Promise<OrderResponseDto | null> {
    const userId = req.user?.['id'];
    const order =
      await this.ordersService.findOrderWithItems(id); /* ?.dataValues */

    const dataValues = order ? order.dataValues : {};

    if (!dataValues || dataValues.userId !== userId) {
      throw new NotFoundException('Заказ не найден');
    }

    return order ? this.ordersService.mapToResponseDto(order) : null;
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Обновление статуса заказа (админ/менеджер)' })
  @ApiResponse({
    status: 200,
    description: 'Статус обновлен',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto | null> {
    return this.ordersService.updateOrderStatus(id, updateDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Получение всех заказов (админ/менеджер)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Список заказов',
    type: [OrderResponseDto],
  })
  async getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: OrderStatus,
    @Query('userId') userId?: number,
  ) {
    return this.ordersService.findAllOrders(page, limit, status, userId);
  }

  @Put(':id/cancel')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Отмена заказа пользователем' })
  @ApiResponse({
    status: 200,
    description: 'Заказ отменен',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async cancelOrder(
    @Req() req: express.Request,
    @Param('id') id: string,
  ): Promise<OrderResponseDto | null> {
    const userId = req.user?.['id'];
    return this.ordersService.cancelOrder(id, userId);
  }

  @Post(':id/repeat')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Повтор заказа' })
  @ApiResponse({
    status: 201,
    description: 'Новый заказ создан',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Оригинальный заказ не найден' })
  async repeatOrder(
    @Req() req: express.Request,
    @Param('id') id: string,
  ): Promise<OrderResponseDto | null> {
    const userId = req.user?.['id'];
    return this.ordersService.repeatOrder(id, userId);
  }
}
