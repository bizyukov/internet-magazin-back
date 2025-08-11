import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Category } from 'src/categories/category.model';
import { Manufacturer } from 'src/manufacturers/manufacturer.model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { mapProductToResponseDto } from './product.mapper';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productModel.create(createProductDto as any);
    return mapProductToResponseDto(product);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    categoryId?: number,
    manufacturerId?: number,
    minPrice?: number,
    maxPrice?: number,
    isActive?: boolean,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ items: ProductResponseDto[]; total: number }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (manufacturerId) {
      where.manufacturerId = manufacturerId;
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, [Op.gte]: minPrice };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, [Op.lte]: maxPrice };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const order: string[][] = [];
    if (sortBy) {
      order.push([sortBy, sortOrder]);
    }

    const { rows, count } = await this.productModel.findAndCountAll({
      where,
      limit,
      offset,
      //order,
      include: [Category, Manufacturer],
    });

    return {
      items: rows.map(mapProductToResponseDto),
      total: count,
    };
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productModel.findByPk(id, {
      include: [Category, Manufacturer],
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return mapProductToResponseDto(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto | null> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    await product.update(updateProductDto);
    const updatedProduct = await this.productModel.findByPk(id, {
      include: [Category, Manufacturer],
    });

    return updatedProduct ? mapProductToResponseDto(updatedProduct) : null;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    await product.destroy();
  }

  async getNewProducts(limit = 10): Promise<ProductResponseDto[]> {
    const products = await this.productModel.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      include: [Category, Manufacturer],
    });

    return products.map(mapProductToResponseDto);
  }

  async getPopularProducts(limit = 10): Promise<ProductResponseDto[]> {
    // В реальном приложении здесь была бы логика определения популярности
    // Например, по количеству заказов или просмотров
    // Здесь просто возвращаем недавно добавленные
    return this.getNewProducts(limit);
  }
}
