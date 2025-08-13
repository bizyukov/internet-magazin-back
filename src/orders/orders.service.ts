import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CartService } from 'src/cart/cart.service';
import { Product } from '../products/product.model';
import { User } from '../user/user.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './interfaces/order-status.enum';
import { OrderItem } from './order-item.model';
import { Order } from './order.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
    @InjectModel(Product)
    private productModel: typeof Product,
    private sequelize: Sequelize,
    private cartService: CartService,
  ) {}

  async create(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto | null> {
    return this.sequelize.transaction(async (transaction) => {
      // Рассчет общей суммы
      /* const total = createOrderDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ); */

      // Получаем корзину пользователя
      const cart = await this.cartService.getUserCart(userId);

      if (!cart.items || cart.items.length === 0) {
        throw new Error('Корзина пуста');
      }

      // Проверка наличия товаров
      for (const item of cart.items) {
        const product = await this.productModel.findByPk(item.productId, {
          transaction,
        });
        if (!product || product.stockQuantity < item.quantity) {
          throw new Error(
            `Товар "${item.name}" недоступен в нужном количестве`,
          );
        }
      }

      // Создание заказа
      const order = await this.orderModel.create(
        {
          userId,
          total: cart.total,
          status: OrderStatus.PENDING,
          shippingAddress: createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod,
          notes: createOrderDto.notes,
        },
        { transaction },
      );

      // Создание элементов заказа
      const orderItems = createOrderDto.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      await this.orderItemModel.bulkCreate(orderItems, { transaction });

      // Очистка корзины
      await this.cartService.clearUserCart(userId, transaction);

      const orderWithItems = await this.findOrderWithItems(order.id);

      return orderWithItems ? this.mapToResponseDto(orderWithItems) : null;
    });
  }

  async findOrderById(id: string): Promise<Order | null> {
    return this.orderModel.findByPk(id, {
      include: [User, { model: OrderItem, include: [Product] }],
    });
  }

  async findOrderWithItems(id: string): Promise<Order | null> {
    return this.orderModel.findByPk(id, {
      include: [User, OrderItem],
    });
  }

  async getUserOrders(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel.findAll({
      where: { userId },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
    });

    return orders.map((order) => this.mapToResponseDto(order));
  }

  async updateOrderStatus(
    id: string,
    updateDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto | null> {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    const updateData: Partial<Order> = {
      status: updateDto.status,
    };

    if (updateDto.trackingNumber) {
      updateData.trackingNumber = updateDto.trackingNumber;
    }

    if (updateDto.notes) {
      updateData.notes = updateDto.notes;
    }

    await order.update(updateData);

    const orderWithItems = await this.findOrderWithItems(order.id);

    return orderWithItems ? this.mapToResponseDto(orderWithItems) : null;
  }

  async findAllOrders(
    page = 1,
    limit = 10,
    status?: OrderStatus,
    userId?: number,
  ): Promise<{ items: OrderResponseDto[]; total: number }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    const { rows, count } = await this.orderModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [User, OrderItem],
      order: [['createdAt', 'DESC']],
    });

    return {
      items: rows.map((order) => this.mapToResponseDto(order)),
      total: count,
    };
  }

  async cancelOrder(
    id: string,
    userId: number,
  ): Promise<OrderResponseDto | null> {
    const order = await this.orderModel.findOne({
      where: { id, userId },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (
      ![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(
        order.status as OrderStatus,
      )
    ) {
      throw new Error('Невозможно отменить заказ в текущем статусе');
    }

    await order.update({ status: OrderStatus.CANCELLED });

    const orderWithItems = await this.findOrderWithItems(order.id);

    return orderWithItems ? this.mapToResponseDto(orderWithItems) : null;
  }

  async repeatOrder(
    id: string,
    userId: number,
  ): Promise<OrderResponseDto | null> {
    const originalOrder = await this.orderModel.findByPk(id, {
      include: [OrderItem],
    });

    if (!originalOrder) {
      throw new NotFoundException('Оригинальный заказ не найден');
    }

    // Создание нового заказа на основе старого
    const createOrderDto: CreateOrderDto = {
      shippingAddress: originalOrder.shippingAddress,
      paymentMethod: originalOrder.paymentMethod,
      items: originalOrder.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      notes: `Повтор заказа ${id}`,
    };

    return this.create(userId, createOrderDto);
  }

  async findRecentOrders(limit = 5): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        User,
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    return orders.map((order) => this.mapToResponseDto(order));
  }

  mapToResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      //shippingAddress: order.shippingAddress,
      //paymentMethod: order.paymentMethod,
      user: {
        id: order.user?.id,
        name: order.user?.name,
        email: order.user?.email,
        role: order.user?.role,
      },
      status: order.status as OrderStatus,
      total: order.total,
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        total: item.total,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
    };
  }
}
