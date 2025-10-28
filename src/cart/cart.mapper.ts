import { Cart } from './cart.model';
import { CartItemResponseDto } from './dto/cart-item-response.dto';
import { CartResponseDto } from './dto/cart-response.dto';

export function mapCartToResponseDto(data: Cart): CartResponseDto {
  const cart = data.dataValues;
  return {
    id: cart.id,
    userId: cart.userId,
    total: cart.total,
    itemsCount: cart.itemsCount,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    items: cart.items?.map((item) => mapCartItemToResponseDto(item)) || [],
  };
}

export function mapCartItemToResponseDto(data: any): CartItemResponseDto {
  const item = data.dataValues;
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    total: item.price * item.quantity,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt,
  };
}
