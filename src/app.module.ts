import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';

import configuration from './config/configuration';

import { Product } from './products/product.model';

import { CartItem } from './cart/cart-item.model';
import { Cart } from './cart/cart.model';
import { Category } from './categories/category.model';
import { CheckoutModule } from './checkout/checkout.module';
import { Address } from './checkout/entities/address.entity';
import { PaymentMethod } from './checkout/entities/payment-method.entity';
import { Manufacturer } from './manufacturers/manufacturer.model';
import { OrderItem } from './orders/order-item.model';
import { Order } from './orders/order.model';
import { User } from './user/user.model';

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
        Address,
        PaymentMethod,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    //AdminModule,
    //UserModule,
    //ProductsModule,
    //CategoriesModule,
    //ManufacturersModule,
    //OrdersModule,
    //CartModule,
    CheckoutModule,
  ],
})
export class AppModule {}
