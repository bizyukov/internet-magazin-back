import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Корзина')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Корзина пользователя',
    type: CartResponseDto,
  })
  async getCart(@Req() req): Promise<CartResponseDto> {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({
    status: 200,
    description: 'Товар добавлен в корзину',
    type: CartResponseDto,
  })
  async addToCart(
    @Req() req,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto | null> {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Обновить количество товара в корзине' })
  @ApiParam({ name: 'id', description: 'ID элемента корзины' })
  @ApiResponse({
    status: 200,
    description: 'Количество обновлено',
    type: CartResponseDto,
  })
  async updateCartItem(
    @Req() req,
    @Param('id') itemId: number,
    @Body() updateDto: UpdateCartItemDto,
  ): Promise<CartResponseDto | null> {
    return this.cartService.updateCartItem(req.user.id, itemId, updateDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiParam({ name: 'id', description: 'ID элемента корзины' })
  @ApiResponse({
    status: 200,
    description: 'Товар удален из корзины',
    type: CartResponseDto,
  })
  async removeFromCart(
    @Req() req,
    @Param('id') itemId: number,
  ): Promise<CartResponseDto | null> {
    return this.cartService.removeFromCart(req.user.id, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить корзину' })
  @ApiResponse({
    status: 200,
    description: 'Корзина очищена',
    type: CartResponseDto,
  })
  async clearCart(@Req() req): Promise<CartResponseDto> {
    await this.cartService.clearUserCart(req.user.id);
    return this.cartService.getUserCart(req.user.id);
  }
}
