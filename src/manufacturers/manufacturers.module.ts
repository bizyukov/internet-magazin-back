import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { Manufacturer } from './manufacturer.model';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Manufacturer]),
    forwardRef(() => ProductsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
