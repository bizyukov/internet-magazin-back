import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from 'src/products/products.module';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { CartItem } from './cart-item.model';
import { CartController } from './cart.controller';
import { Cart } from './cart.model';
import { CartService } from './cart.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Cart, CartItem]),
    forwardRef(() => AdminModule),
    ProductsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
