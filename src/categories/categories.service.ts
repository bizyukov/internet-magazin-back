import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { mapCategoryToResponseDto } from './category.mapper';
import { Category } from './category.model';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryModel.create(createCategoryDto as any);
    return mapCategoryToResponseDto(category);
  }

  async findAll(withChildren: boolean = false): Promise<CategoryResponseDto[]> {
    const include = withChildren ? [{ model: Category, as: 'children' }] : [];

    const categories = await this.categoryModel.findAll({
      where: { parentId: null },
      include,
      order: [
        ['position', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    return categories.map(mapCategoryToResponseDto);
  }

  async findOne(
    id: number,
    withChildren: boolean = false,
  ): Promise<CategoryResponseDto> {
    const include = withChildren ? [{ model: Category, as: 'children' }] : [];

    const category = await this.categoryModel.findByPk(id, {
      include: [...include, { model: Category, as: 'parent' }],
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return mapCategoryToResponseDto(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryModel.findByPk(id);

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    // Проверка на циклические зависимости
    if (updateCategoryDto.parentId === id) {
      throw new Error(
        'Категория не может быть собственной родительской категорией',
      );
    }

    await category.update(updateCategoryDto);
    return mapCategoryToResponseDto(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryModel.findByPk(id, {
      include: [{ model: Category, as: 'children' }],
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    // Проверка на наличие дочерних категорий
    if (category.children && category.children.length > 0) {
      throw new Error('Невозможно удалить категорию с дочерними категориями');
    }

    // Проверка на наличие товаров в категории
    const productCount = await category.$count('products');
    if (productCount > 0) {
      throw new Error('Невозможно удалить категорию с товарами');
    }

    await category.destroy();
  }

  async getTree(): Promise<CategoryResponseDto[]> {
    const rootCategories = await this.categoryModel.findAll({
      where: { parentId: null },
      include: [
        {
          model: Category,
          as: 'children',
          include: [
            {
              model: Category,
              as: 'children',
            },
          ],
        },
      ],
      order: [
        ['position', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    return rootCategories.map(mapCategoryToResponseDto);
  }

  async getChildren(parentId: number): Promise<CategoryResponseDto[]> {
    const children = await this.categoryModel.findAll({
      where: { parentId },
      include: [{ model: Category, as: 'children' }],
      order: [
        ['position', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    return children.map(mapCategoryToResponseDto);
  }

  async movePosition(
    id: number,
    newPosition: number,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryModel.findByPk(id);

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    const parentId = category.parentId || null;

    // Получаем все категории на том же уровне
    const siblings = await this.categoryModel.findAll({
      where: { parentId: parentId, id: { [Op.ne]: id } },
      order: [['position', 'ASC']],
    });

    // Обновляем позиции
    const updatedSiblings: Promise<Category>[] = [];
    let currentPos = 0;

    for (let i = 0; i <= siblings.length; i++) {
      if (i === newPosition) {
        currentPos++;
      }

      if (i < siblings.length) {
        if (siblings[i].position !== currentPos) {
          siblings[i].position = currentPos;
          updatedSiblings.push(siblings[i].save());
        }
        currentPos++;
      }
    }

    category.position = newPosition;
    await Promise.all([...updatedSiblings, category.save()]);

    return mapCategoryToResponseDto(category);
  }
}
