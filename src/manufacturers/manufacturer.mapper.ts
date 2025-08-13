import { ManufacturerResponseDto } from './dto/manufacturer-response.dto';
import { Manufacturer } from './manufacturer.model';

export function mapManufacturerToResponseDto(
  manufacturer: Manufacturer,
): ManufacturerResponseDto {
  return {
    id: manufacturer.dataValues.id,
    name: manufacturer.dataValues.name,
    description: manufacturer.dataValues.description,
    country: manufacturer.dataValues.country,
    website: manufacturer.dataValues.website,
    logoUrl: manufacturer.dataValues.logoUrl,
    isActive: manufacturer.dataValues.isActive,
    createdAt: manufacturer.dataValues.createdAt,
    updatedAt: manufacturer.dataValues.updatedAt,
  };
}
