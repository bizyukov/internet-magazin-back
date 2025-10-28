import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Admin - Товары')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый товар (админ/менеджер)' })
  @ApiResponse({
    status: 201,
    description: 'Товар успешно создан',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех товаров (админ/менеджер)' })
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
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Включая неактивные товары',
  })
  @ApiResponse({
    status: 200,
    description: 'Список товаров',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('includeInactive') includeInactive = false,
  ) {
    return this.productsService.findAll(
      page,
      limit,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      includeInactive ? undefined : true,
    );
  }

  @Get('top')
  @ApiOperation({ summary: 'Популярные товары' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество товаров',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Список популярных товаров',
    schema: {
      example: [
        { productId: 123, totalSold: 42 },
        { productId: 456, totalSold: 35 },
      ],
    },
  })
  async getTopProducts(@Query('limit') limit = 5) {
    console.log('[getTopProducts]');
    return this.productsService.getTopProducts(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID (админ/менеджер)' })
  @ApiResponse({
    status: 200,
    description: 'Детали товара',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить товар (админ/менеджер)' })
  @ApiResponse({
    status: 200,
    description: 'Товар обновлен',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto | null> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар (админ/менеджер)' })
  @ApiResponse({ status: 200, description: 'Товар удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
