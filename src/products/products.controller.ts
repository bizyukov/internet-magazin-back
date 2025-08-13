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
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Товары')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /* @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Создать новый товар (админ/менеджер)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Товар создан',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    console.log('ProductsController');
    return this.productsService.create(createProductDto);
  }
 */
  @Get()
  @ApiOperation({ summary: 'Получить список товаров' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество на странице',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Поисковый запрос',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'ID категории',
  })
  @ApiQuery({
    name: 'manufacturerId',
    required: false,
    type: Number,
    description: 'ID производителя',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Минимальная цена',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Максимальная цена',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Активен ли товар',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Поле для сортировки (name, price, createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Порядок сортировки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список товаров',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: number,
    @Query('manufacturerId') manufacturerId?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('isActive') isActive?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.productsService.findAll(
      page,
      limit,
      search,
      categoryId,
      manufacturerId,
      minPrice,
      maxPrice,
      isActive,
      sortBy,
      sortOrder,
    );
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить список новых товаров' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество товаров',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список новых товаров',
    type: [ProductResponseDto],
  })
  async getNewProducts(
    @Query('limit') limit = 10,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.getNewProducts(limit);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Получить список популярных товаров' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество товаров',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список популярных товаров',
    type: [ProductResponseDto],
  })
  async getPopularProducts(
    @Query('limit') limit = 10,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.getPopularProducts(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', description: 'ID товара', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Детали товара',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Товар не найден' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Обновить товар (админ/менеджер)' })
  @ApiParam({ name: 'id', description: 'ID товара', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Товар обновлен',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Товар не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto | null> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Удалить товар (админ/менеджер)' })
  @ApiParam({ name: 'id', description: 'ID товара', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Товар удален' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Товар не найден' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
