import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturerResponseDto } from './dto/manufacturer-response.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { mapManufacturerToResponseDto } from './manufacturer.mapper';
import { Manufacturer } from './manufacturer.model';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectModel(Manufacturer)
    private manufacturerModel: typeof Manufacturer,
  ) {}

  async create(
    createManufacturerDto: CreateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    const manufacturer = await this.manufacturerModel.create(
      createManufacturerDto as any,
    );
    return mapManufacturerToResponseDto(manufacturer);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    country?: string,
    isActive?: boolean,
  ): Promise<{ items: ManufacturerResponseDto[]; total: number }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (country) {
      where.country = country;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { rows, count } = await this.manufacturerModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return {
      items: rows.map(mapManufacturerToResponseDto),
      total: count,
    };
  }

  async findOne(id: number): Promise<ManufacturerResponseDto> {
    const manufacturer = await this.manufacturerModel.findByPk(id);

    if (!manufacturer) {
      throw new NotFoundException('Производитель не найден');
    }

    return mapManufacturerToResponseDto(manufacturer);
  }

  async update(
    id: number,
    updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    const manufacturer = await this.manufacturerModel.findByPk(id);

    if (!manufacturer) {
      throw new NotFoundException('Производитель не найден');
    }

    await manufacturer.update(updateManufacturerDto);
    return mapManufacturerToResponseDto(manufacturer);
  }

  async remove(id: number): Promise<void> {
    const manufacturer = await this.manufacturerModel.findByPk(id, {
      include: ['products'],
    });

    if (!manufacturer) {
      throw new NotFoundException('Производитель не найден');
    }

    // Проверка на наличие товаров производителя
    if (manufacturer.products && manufacturer.products.length > 0) {
      throw new Error(
        'Невозможно удалить производителя с привязанными товарами',
      );
    }

    await manufacturer.destroy();
  }

  async getTopManufacturers(limit = 10): Promise<ManufacturerResponseDto[]> {
    // В реальном приложении здесь была бы логика определения популярности
    // Например, по количеству товаров или заказов
    // Здесь просто возвращаем первых по алфавиту
    const manufacturers = await this.manufacturerModel.findAll({
      limit,
      order: [['name', 'ASC']],
      where: { isActive: true },
    });

    return manufacturers.map(mapManufacturerToResponseDto);
  }
}
