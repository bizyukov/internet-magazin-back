import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';

import configuration from './config/configuration';

import { Product } from './products/product.model';

import { CartItem } from './cart/cart-item.model';
import { Cart } from './cart/cart.model';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.model';
import { Manufacturer } from './manufacturers/manufacturer.model';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { OrderItem } from './orders/order-item.model';
import { Order } from './orders/order.model';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { User } from './users/user.model';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.database,
      models: [
        User,
        Product,
        Category,
        Manufacturer,
        Order,
        OrderItem,
        Cart,
        CartItem,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ManufacturersModule,
    OrdersModule,
    CartModule,
  ],
})
export class AppModule {}
