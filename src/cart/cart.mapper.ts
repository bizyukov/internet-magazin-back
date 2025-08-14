import { Cart } from './cart.model';
import { CartItemResponseDto } from './dto/cart-item-response.dto';
import { CartResponseDto } from './dto/cart-response.dto';

export function mapCartToResponseDto(data: Cart): CartResponseDto {
  const cart = data.dataValues;
  console.log('cart', cart);
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

export function mapCartItemToResponseDto(item: any): CartItemResponseDto {
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
