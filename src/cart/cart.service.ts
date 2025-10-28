import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../products/product.model';
import { CartItem } from './cart-item.model';
import { mapCartToResponseDto } from './cart.mapper';
import { Cart } from './cart.model';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private cartModel: typeof Cart,
    @InjectModel(CartItem)
    private cartItemModel: typeof CartItem,
    @InjectModel(Product)
    private productModel: typeof Product,
    private sequelize: Sequelize,
  ) {}

  async getOrCreateUserCart(userId: number): Promise<Cart> {
    let cart = await this.cartModel.findOne({
      where: { userId },
      include: [CartItem],
    });

    if (!cart) {
      cart = await this.cartModel.create({ userId });
    }

    return cart;
  }

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto | null> {
    return this.sequelize.transaction(async (transaction) => {
      const cart = (await this.getOrCreateUserCart(userId)).dataValues;
      const product = await this.productModel.findByPk(addToCartDto.productId, {
        transaction,
        raw: true,
      });

      console.log('product', product);

      if (!product) {
        throw new NotFoundException('Товар не найден');
      }

      if (product.stockQuantity < addToCartDto.quantity) {
        throw new Error('Недостаточно товара в наличии');
      }

      let cartItem = await this.cartItemModel.findOne({
        where: {
          cartId: cart.id,
          productId: addToCartDto.productId,
        },
        transaction,
      });

      console.log('cartItem', cartItem);

      if (cartItem) {
        cartItem.dataValues.quantity += addToCartDto.quantity;
        await cartItem.save({ transaction });
      } else {
        try {
          const dataToCart = {
            cartId: cart.id,
            productId: addToCartDto.productId,
            name: product.name,
            price: product.price,
            quantity: addToCartDto.quantity,
            imageUrl: product.imageUrl,
          };

          console.log('dataToCart', dataToCart);

          cartItem = await this.cartItemModel.create(dataToCart, {
            transaction,
          });
        } catch (e) {
          console.log('create cart item error:', e);
          throw new BadRequestException('create cart item error');
        }
      }

      await this.recalculateCartTotals(cart.id, transaction);
      const updatedCart = await this.cartModel.findByPk(cart.id, {
        include: [CartItem],
        transaction,
      });

      return updatedCart ? mapCartToResponseDto(updatedCart) : null;
    });
  }

  async updateCartItem(
    userId: number,
    productId: number,
    updateDto: UpdateCartItemDto,
  ): Promise<CartResponseDto | null> {
    return this.sequelize.transaction(async (transaction) => {
      const cart = await this.getOrCreateUserCart(userId);
      const cartItem = await this.cartItemModel.findOne({
        where: {
          productId,
          cartId: cart.id,
        },
        transaction,
      });

      if (!cartItem) {
        throw new NotFoundException('Элемент корзины не найден');
      }

      const product = await this.productModel.findByPk(cartItem.productId, {
        transaction,
      });
      if (product && product.stockQuantity < updateDto.quantity) {
        throw new Error('Недостаточно товара в наличии');
      }

      cartItem.quantity = updateDto.quantity;
      await cartItem.save({ transaction });

      await this.recalculateCartTotals(cart.id, transaction);
      const updatedCart = await this.cartModel.findByPk(cart.id, {
        include: [CartItem],
        transaction,
      });

      return updatedCart ? mapCartToResponseDto(updatedCart) : null;
    });
  }

  async removeFromCart(
    userId: number,
    productId: number,
  ): Promise<CartResponseDto | null> {
    return this.sequelize.transaction(async (transaction) => {
      const cart = await this.getOrCreateUserCart(userId);
      const cartItem = await this.cartItemModel.findOne({
        where: {
          productId,
          cartId: cart.id,
        },
        transaction,
      });

      if (!cartItem) {
        throw new NotFoundException('Элемент корзины не найден');
      }

      await cartItem.destroy({ transaction });
      await this.recalculateCartTotals(cart.id, transaction);
      const updatedCart = await this.cartModel.findByPk(cart.id, {
        include: [CartItem],
        transaction,
      });

      return updatedCart ? mapCartToResponseDto(updatedCart) : null;
    });
  }

  async clearUserCart(
    userId: number,
    transaction?: Transaction,
  ): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      const transactionToUse = transaction || t;
      const cart = await this.getOrCreateUserCart(userId);

      await this.cartItemModel.destroy({
        where: { cartId: cart.id },
        transaction: transactionToUse,
      });

      cart.total = 0;
      cart.itemsCount = 0;
      await cart.save({ transaction: transactionToUse });
    });
  }

  async getUserCart(userId: number): Promise<CartResponseDto> {
    const cart = await this.getOrCreateUserCart(userId);
    //console.log('[GET CART]', cart);
    return mapCartToResponseDto(cart);
  }

  private async recalculateCartTotals(
    cartId: number,
    transaction: Transaction,
  ): Promise<void> {
    const items = await this.cartItemModel.findAll({
      where: { cartId },
      transaction,
    });

    const total = items.reduce((sum, { dataValues }) => {
      console.log('sum', sum, dataValues);
      return sum + dataValues.price * dataValues.quantity;
    }, 0);

    const itemsCount = items.reduce((count, { dataValues }) => {
      return count + dataValues.quantity;
    }, 0);

    await this.cartModel.update(
      { total, itemsCount },
      { where: { id: cartId }, transaction },
    );
  }
}
