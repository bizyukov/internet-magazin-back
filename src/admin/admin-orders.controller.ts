import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OrderResponseDto } from 'src/orders/dto/order-response.dto';
import { UpdateOrderStatusDto } from 'src/orders/dto/update-order-status.dto';
import { OrderStatus } from 'src/orders/interfaces/order-status.enum';
import { OrdersService } from 'src/orders/orders.service';

@ApiTags('Admin - Заказы')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех заказов (админ/менеджер)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество на странице',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Фильтр по статусу',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'Фильтр по пользователю',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Сортировка (createdAt:DESC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список заказов',
    type: [OrderResponseDto],
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: OrderStatus,
    @Query('userId') userId?: number,
    @Query('sort') sort = 'createdAt:DESC',
  ) {
    //const [sortField, sortOrder] = sort.split(':');
    return this.ordersService.findAllOrders(
      page,
      limit,
      status,
      userId,
      /* sortField,
      sortOrder as 'ASC' | 'DESC', */
    );
  }

  @Get('recent')
  @ApiOperation({ summary: 'Получить последние заказы (админ/менеджер)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество заказов',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Последние заказы',
    type: [OrderResponseDto],
  })
  async findRecent(@Query('limit') limit = 5) {
    return this.ordersService.findRecentOrders(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID (админ/менеджер)' })
  @ApiResponse({
    status: 200,
    description: 'Детали заказа',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto | null> {
    const order = await this.ordersService.findOrderById(id);
    return order ? this.ordersService.mapToResponseDto(order) : null;
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Обновить статус заказа (админ/менеджер)' })
  @ApiResponse({
    status: 200,
    description: 'Статус обновлен',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto | null> {
    return this.ordersService.updateOrderStatus(id, updateDto);
  }
}
