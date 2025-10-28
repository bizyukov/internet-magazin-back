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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturerResponseDto } from './dto/manufacturer-response.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ManufacturersService } from './manufacturers.service';

@ApiTags('Производители')
@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Создать нового производителя (админ/менеджер)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Производитель создан',
    type: ManufacturerResponseDto,
  })
  async create(
    @Body() createManufacturerDto: CreateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.create(createManufacturerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список производителей' })
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
    name: 'country',
    required: false,
    type: String,
    description: 'Фильтр по стране',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Активен ли производитель',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список производителей',
    type: [ManufacturerResponseDto],
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('country') country?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.manufacturersService.findAll(
      page,
      limit,
      search,
      country,
      isActive,
    );
  }

  @Get('top')
  @ApiOperation({ summary: 'Получить топ производителей' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество производителей',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список топ производителей',
    type: [ManufacturerResponseDto],
  })
  async getTopManufacturers(
    @Query('limit') limit = 10,
  ): Promise<ManufacturerResponseDto[]> {
    return this.manufacturersService.getTopManufacturers(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить производителя по ID' })
  @ApiParam({ name: 'id', description: 'ID производителя', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Детали производителя',
    type: ManufacturerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Производитель не найден',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Обновить производителя (админ/менеджер)' })
  @ApiParam({ name: 'id', description: 'ID производителя', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Производитель обновлен',
    type: ManufacturerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Производитель не найден',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Удалить производителя (админ/менеджер)' })
  @ApiParam({ name: 'id', description: 'ID производителя', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Производитель удален' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Производитель не найден',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Невозможно удалить производителя с товарами',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.manufacturersService.remove(id);
  }
}
