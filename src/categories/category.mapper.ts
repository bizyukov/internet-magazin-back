import { Category } from './category.model';
import { CategoryResponseDto } from './dto/category-response.dto';

export function mapCategoryToResponseDto(
  category: Category,
): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    parentId: category.parentId,
    position: category.position,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    children:
      category.children?.map((child) => mapCategoryToResponseDto(child)) || [],
  };
}
