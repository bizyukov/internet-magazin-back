import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../orders/orders.service';
import { AddressDto } from './dto/address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { Address } from './entities/address.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(PaymentMethod)
    private paymentMethodModel: typeof PaymentMethod,
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService,
    private sequelize: Sequelize,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    // Проверяем существование адреса и платежного метода
    const [address, paymentMethod] = await Promise.all([
      this.addressModel.findByPk(createOrderDto.billingAddressId, {
        raw: true,
      }),
      this.paymentMethodModel.findByPk(createOrderDto.paymentMethodId, {
        raw: true,
      }),
    ]);

    if (!address || address.userId !== userId) {
      throw new NotFoundException('Адрес не найден');
    }

    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new NotFoundException('Платежный метод не найден');
    }

    // Получаем корзину пользователя
    const cart = await this.cartService.getUserCart(userId);

    console.log('cart2', cart);

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Корзина пуста');
    }

    // Создаем заказ
    return this.ordersService.create(userId, {
      shippingAddress: {
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        region: address.region,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
      },
      paymentMethod: {
        type: paymentMethod.type,
        details: paymentMethod.details,
      },
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: /* item.product?.name || */ item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      notes: createOrderDto.notes,
    });
  }

  async getUserAddresses(userId: number) {
    return this.addressModel.findAll({
      where: { userId },
      order: [
        ['isDefault', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async createAddress(userId: number, addressDto: AddressDto) {
    const address = await this.addressModel.create({
      userId,
      ...addressDto,
    });

    // Если установлен как адрес по умолчанию, сбрасываем другие
    if (addressDto.isDefault) {
      await this.setDefaultAddress(userId, address.id);
    }

    return address;
  }

  async setDefaultAddress(userId: number, addressId: number) {
    const transaction = await this.sequelize.transaction();

    try {
      // Сбрасываем все default
      await this.addressModel.update(
        { isDefault: false },
        { where: { userId }, transaction },
      );

      // Устанавливаем новый default
      await this.addressModel.update(
        { isDefault: true },
        { where: { id: addressId, userId }, transaction },
      );

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUserPaymentMethods(userId: number) {
    return this.paymentMethodModel.findAll({
      where: { userId },
      order: [
        ['isDefault', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async createPaymentMethod(
    userId: number,
    paymentMethodDto: PaymentMethodDto,
  ) {
    const paymentMethod = await this.paymentMethodModel.create({
      userId,
      ...paymentMethodDto,
    });

    // Если установлен как метод по умолчанию, сбрасываем другие
    if (paymentMethodDto.isDefault) {
      await this.setDefaultPaymentMethod(userId, paymentMethod.id);
    }

    return paymentMethod;
  }

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number) {
    const transaction = await this.sequelize.transaction();

    try {
      // Сбрасываем все default
      await this.paymentMethodModel.update(
        { isDefault: false },
        { where: { userId }, transaction },
      );

      // Устанавливаем новый default
      await this.paymentMethodModel.update(
        { isDefault: true },
        { where: { id: paymentMethodId, userId }, transaction },
      );

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
