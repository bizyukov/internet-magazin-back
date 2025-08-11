import { ManufacturerResponseDto } from './dto/manufacturer-response.dto';
import { Manufacturer } from './manufacturer.model';

export function mapManufacturerToResponseDto(
  manufacturer: Manufacturer,
): ManufacturerResponseDto {
  return {
    id: manufacturer.id,
    name: manufacturer.name,
    description: manufacturer.description,
    country: manufacturer.country,
    website: manufacturer.website,
    logoUrl: manufacturer.logoUrl,
    isActive: manufacturer.isActive,
    createdAt: manufacturer.createdAt,
    updatedAt: manufacturer.updatedAt,
  };
}
