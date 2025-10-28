import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { Order } from '../orders/order.model';
import { Product } from '../products/product.model';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async getStats() {
    const [ordersCount, revenue, usersCount, productsCount] = await Promise.all(
      [
        this.orderModel.count(),
        this.orderModel.sum('total'),
        this.userModel.count(),
        this.productModel.count(),
      ],
    );

    return {
      ordersCount: ordersCount || 0,
      revenue: revenue || 0,
      usersCount: usersCount || 0,
      productsCount: productsCount || 0,
    };
  }

  /* async getRecentOrders(limit = 5) {
    return this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      include: [{ all: true }],
    });
  } */

  
}
