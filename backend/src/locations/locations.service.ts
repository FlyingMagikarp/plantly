import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { Location } from './location.entity';

export interface LocationView {
  id: number;
  name: string;
}

@Injectable()
export class LocationsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async list(): Promise<LocationView[]> {
    const locations = await this.dataSource.getRepository(Location).find({
      order: { name: 'ASC', id: 'ASC' },
    });

    return locations.map(toLocationView);
  }

  async create(input: unknown): Promise<LocationView> {
    const name = locationNameFrom(input);

    try {
      return await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(Location);
        if (await hasConflictingName(manager, name)) {
          throw duplicateLocationName();
        }

        return toLocationView(await repository.save(repository.create({ name })));
      });
    } catch (error: unknown) {
      translateUniqueNameViolation(error);
      throw error;
    }
  }

  async update(id: number, input: unknown): Promise<LocationView> {
    const name = locationNameFrom(input);

    try {
      return await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(Location);
        const location = await repository.findOneBy({ id });
        if (!location) {
          throw new NotFoundException('Location not found');
        }
        if (await hasConflictingName(manager, name, id)) {
          throw duplicateLocationName();
        }

        location.name = name;
        return toLocationView(await repository.save(location));
      });
    } catch (error: unknown) {
      translateUniqueNameViolation(error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const result = await manager.getRepository(Location).delete(id);
      if (result.affected !== 1) {
        throw new NotFoundException('Location not found');
      }
    });
  }
}

async function hasConflictingName(
  dataSource: Pick<DataSource['manager'], 'createQueryBuilder'>,
  name: string,
  excludedId?: number,
): Promise<boolean> {
  const query = dataSource
    .createQueryBuilder(Location, 'location')
    .where('LOWER(location.name) = LOWER(:name)', { name });

  if (excludedId !== undefined) {
    query.andWhere('location.id <> :excludedId', { excludedId });
  }

  return query.getExists();
}

function locationNameFrom(input: unknown): string {
  if (!isRecord(input) || typeof input.name !== 'string') {
    throw new BadRequestException('Location name is required');
  }

  const name = input.name.trimEnd();
  if (name.length === 0) {
    throw new BadRequestException('Location name is required');
  }

  return name;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function duplicateLocationName(): ConflictException {
  return new ConflictException('Location name is already used');
}

function translateUniqueNameViolation(error: unknown): void {
  if (
    error instanceof QueryFailedError &&
    isRecord(error.driverError) &&
    error.driverError.code === '23505' &&
    error.driverError.constraint === 'UQ_locations_name_case_insensitive'
  ) {
    throw duplicateLocationName();
  }
}

function toLocationView(location: Location): LocationView {
  return { id: location.id, name: location.name };
}
