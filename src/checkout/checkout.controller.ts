import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { CheckoutService } from './checkout.service';
import { AddressDto } from './dto/address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { Address } from './entities/address.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@ApiTags('Checkout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('orders')
  @ApiOperation({ summary: 'Создать заказ' })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    type: OrderResponseDto,
  })
  createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    return this.checkoutService.createOrder(req.user.id, createOrderDto);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Получить адреса пользователя' })
  @ApiResponse({ status: 200, description: 'Список адресов', type: [Address] })
  getAddresses(@Req() req) {
    return this.checkoutService.getUserAddresses(req.user.id);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Создать новый адрес' })
  @ApiResponse({
    status: 201,
    description: 'Адрес успешно создан',
    type: Address,
  })
  createAddress(@Req() req, @Body() addressDto: AddressDto) {
    return this.checkoutService.createAddress(req.user.id, addressDto);
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Получить платежные методы пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список платежных методов',
    type: [PaymentMethod],
  })
  getPaymentMethods(@Req() req) {
    return this.checkoutService.getUserPaymentMethods(req.user.id);
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Создать новый платежный метод' })
  @ApiResponse({
    status: 201,
    description: 'Платежный метод успешно создан',
    type: PaymentMethod,
  })
  createPaymentMethod(@Req() req, @Body() paymentMethodDto: PaymentMethodDto) {
    return this.checkoutService.createPaymentMethod(
      req.user.id,
      paymentMethodDto,
    );
  }
}
