import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from 'src/categories/categories.module';
import { ManufacturersModule } from 'src/manufacturers/manufacturers.module';
import { AuthModule } from '../auth/auth.module';
import { Product } from './product.model';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => ManufacturersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [SequelizeModule.forFeature([Product]), ProductsService],
})
export class ProductsModule {}
