import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartModule } from 'src/cart/cart.module';
import { OrderItem } from 'src/orders/order-item.model';
import { Order } from 'src/orders/order.model';
import { OrdersModule } from 'src/orders/orders.module';
import { Product } from 'src/products/product.model';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/user.model';
import { AdminOrdersController } from './admin-orders.controller';
import { AdminController } from './admin.controller';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderItem, Product, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => CartModule),
    forwardRef(() => UserModule),
  ],
  controllers: [AdminController, DashboardController, AdminOrdersController],
  providers: [/* UserService, */ DashboardService],
  exports: [SequelizeModule.forFeature([User])],
})
export class AdminModule {}
