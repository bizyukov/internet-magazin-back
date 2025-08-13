import { Category } from './category.model';
import { CategoryResponseDto } from './dto/category-response.dto';

export function mapCategoryToResponseDto(
  category: Category,
): CategoryResponseDto {
  return {
    id: category.dataValues.id,
    name: category.dataValues.name,
    description: category.dataValues.description,
    imageUrl: category.dataValues.imageUrl,
    parentId: category.dataValues.parentId,
    position: category.dataValues.position,
    isActive: category.dataValues.isActive,
    createdAt: category.dataValues.createdAt,
    updatedAt: category.dataValues.updatedAt,
    children:
      category.dataValues.children?.map((child) =>
        mapCategoryToResponseDto(child),
      ) || [],
  };
}
