import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartModule } from '../cart/cart.module';
import { OrdersModule } from '../orders/orders.module';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Address } from './entities/address.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Address, PaymentMethod]),
    OrdersModule,
    CartModule,
    //UsersModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
