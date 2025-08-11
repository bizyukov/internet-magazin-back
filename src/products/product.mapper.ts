import { CategoryResponseDto } from 'src/categories/dto/category-response.dto';
import { ManufacturerResponseDto } from 'src/manufacturers/dto/manufacturer-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Product } from './product.model';

export function mapProductToResponseDto(product: Product): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    sku: product.sku,
    imageUrl: product.imageUrl,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: product.category
      ? ({
          id: product.category.id,
          name: product.category.name,
          description: product.category.description,
          createdAt: product.category.createdAt,
          updatedAt: product.category.updatedAt,
        } as CategoryResponseDto)
      : undefined,
    manufacturer: product.manufacturer
      ? ({
          id: product.manufacturer.id,
          name: product.manufacturer.name,
          description: product.manufacturer.description,
          country: product.manufacturer.country,
          createdAt: product.manufacturer.createdAt,
          updatedAt: product.manufacturer.updatedAt,
        } as ManufacturerResponseDto)
      : undefined,
  };
}
