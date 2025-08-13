import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Категории')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Создать новую категорию (админ/менеджер)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Категория создана',
    type: CategoryResponseDto,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все корневые категории' })
  @ApiQuery({
    name: 'withChildren',
    required: false,
    type: Boolean,
    description: 'Включить дочерние категории',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список категорий',
    type: [CategoryResponseDto],
  })
  async findAll(
    @Query('withChildren') withChildren: boolean = false,
  ): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll(withChildren);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Получить полное дерево категорий' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Дерево категорий',
    type: [CategoryResponseDto],
  })
  async getTree(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', description: 'ID категории', type: Number })
  @ApiQuery({
    name: 'withChildren',
    required: false,
    type: Boolean,
    description: 'Включить дочерние категории',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Детали категории',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Категория не найдена',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withChildren') withChildren: boolean = false,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(id, withChildren);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Получить дочерние категории' })
  @ApiParam({
    name: 'id',
    description: 'ID родительской категории',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список дочерних категорий',
    type: [CategoryResponseDto],
  })
  async getChildren(
    @Param('id', ParseIntPipe) parentId: number,
  ): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getChildren(parentId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Обновить категорию (админ/менеджер)' })
  @ApiParam({ name: 'id', description: 'ID категории', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Категория обновлена',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Категория не найдена',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Put(':id/position/:position')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Изменить позицию категории (админ/менеджер)' })
  @ApiParam({ name: 'id', description: 'ID категории', type: Number })
  @ApiParam({ name: 'position', description: 'Новая позиция', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Позиция изменена',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Категория не найдена',
  })
  async movePosition(
    @Param('id', ParseIntPipe) id: number,
    @Param('position', ParseIntPipe) position: number,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.movePosition(id, position);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Удалить категорию (админ/менеджер)' })
  @ApiParam({ name: 'id', description: 'ID категории', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Категория удалена' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Категория не найдена',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Невозможно удалить категорию с дочерними элементами или товарами',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
