import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { CareEvent } from '../care-events/care-event.entity';
import { ImagesService } from '../images/images.service';
import { PlantImage } from '../images/plant-image.entity';
import { Location } from '../locations/location.entity';
import { Species } from '../species/species.entity';
import { Plant, plantStatuses, type PlantStatus } from './plant.entity';

export interface PlantView {
  id: number;
  nickname: string;
  acquisitionDate: string;
  notes: string | null;
  status: PlantStatus;
  species: { id: number; name: string; archived: boolean };
  location: { id: number; name: string } | null;
  latestCareTimestamp?: string | null;
  latestImageUrl?: string | null;
}

interface MaintainedPlantInput {
  nickname: string;
  speciesId: number;
  acquisitionDate: string;
  notes: string | null;
}

export class PlantClock {
  today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}

@Injectable()
export class PlantsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly clock: PlantClock,
    private readonly images: ImagesService,
  ) {}

  async list(): Promise<PlantView[]> {
    const { entities, raw } = await this.dataSource
      .getRepository(Plant)
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.species', 'species')
      .leftJoinAndSelect('plant.location', 'location')
      .addSelect(
        (query) =>
          query
            .select('MAX(careEvent.timestamp)')
            .from(CareEvent, 'careEvent')
            .where('careEvent.plantId = plant.id'),
        'latest_care_timestamp',
      )
      .addSelect(
        (query) =>
          query
            .select('image.id')
            .from(PlantImage, 'image')
            .where('image.plantId = plant.id')
            .orderBy('image.addedAt', 'DESC')
            .addOrderBy('image.id', 'DESC')
            .limit(1),
        'latest_image_id',
      )
      .orderBy('plant.id', 'ASC')
      .getRawAndEntities();
    const rawRows = raw as unknown as Array<Record<string, unknown>>;
    return entities.map((plant, index) => ({
      ...toPlantView(plant),
      latestCareTimestamp: timestampString(rawRows[index]?.latest_care_timestamp),
      latestImageUrl: imageUrl(plant.id, rawRows[index]?.latest_image_id),
    }));
  }

  async find(id: number): Promise<PlantView> {
    const plant = await this.findPlant(this.dataSource.manager, id);
    if (!plant) {
      throw new NotFoundException('Plant not found');
    }
    return toPlantView(plant);
  }

  async create(input: unknown): Promise<PlantView> {
    const values = maintainedPlantInputFrom(input, this.clock.today());
    return this.dataSource.transaction(async (manager) => {
      await requireActiveSpecies(manager, values.speciesId);
      const repository = manager.getRepository(Plant);
      const plant = await repository.save(
        repository.create({ ...values, status: 'active', locationId: null }),
      );
      return toPlantView((await this.findPlant(manager, plant.id))!);
    });
  }

  async update(id: number, input: unknown): Promise<PlantView> {
    const values = maintainedPlantInputFrom(input, this.clock.today());
    return this.dataSource.transaction(async (manager) => {
      const plant = await this.lockPlant(manager, id);
      if (plant.status !== 'active') {
        throw new ConflictException('Only active plants can be edited');
      }
      if (values.speciesId !== plant.speciesId) {
        await requireActiveSpecies(manager, values.speciesId);
      }
      Object.assign(plant, values);
      await manager.getRepository(Plant).save(plant);
      return toPlantView((await this.findPlant(manager, id))!);
    });
  }

  async updateStatus(id: number, input: unknown): Promise<PlantView> {
    const status = statusFrom(input);
    return this.dataSource.transaction(async (manager) => {
      const plant = await this.lockPlant(manager, id);
      if (status === 'active') {
        if (plant.status === 'active') {
          throw new ConflictException('Plant is already active');
        }
      } else if (plant.status !== 'active') {
        throw new ConflictException('Restore the plant before changing its status');
      }
      plant.status = status;
      await manager.getRepository(Plant).save(plant);
      return toPlantView((await this.findPlant(manager, id))!);
    });
  }

  async updateLocation(id: number, input: unknown): Promise<PlantView> {
    const locationId = locationIdFrom(input);
    return this.dataSource.transaction(async (manager) => {
      const plant = await this.lockPlant(manager, id);
      if (plant.status !== 'active') {
        throw new ConflictException('Only active plants can change location');
      }
      if (locationId !== null) {
        const location = await manager
          .getRepository(Location)
          .createQueryBuilder('location')
          .setLock('pessimistic_read')
          .where('location.id = :locationId', { locationId })
          .getOne();
        if (!location) {
          throw new NotFoundException('Location not found');
        }
      }
      plant.locationId = locationId;
      await manager.getRepository(Plant).save(plant);
      return toPlantView((await this.findPlant(manager, id))!);
    });
  }

  async remove(id: number): Promise<void> {
    const storageKeys = await this.images.storageKeys(id);
    await this.dataSource.transaction(async (manager) => {
      const result = await manager.getRepository(Plant).delete(id);
      if (result.affected !== 1) {
        throw new NotFoundException('Plant not found');
      }
    });
    await this.images.removeStoredFiles(storageKeys);
  }

  private findPlant(manager: EntityManager, id: number): Promise<Plant | null> {
    return manager.getRepository(Plant).findOne({
      where: { id },
      relations: { species: true, location: true },
    });
  }

  private async lockPlant(manager: EntityManager, id: number): Promise<Plant> {
    const plant = await manager
      .getRepository(Plant)
      .createQueryBuilder('plant')
      .setLock('pessimistic_write')
      .where('plant.id = :id', { id })
      .getOne();
    if (!plant) {
      throw new NotFoundException('Plant not found');
    }
    return plant;
  }
}

function maintainedPlantInputFrom(
  input: unknown,
  currentDate: string,
): MaintainedPlantInput {
  if (!isRecord(input)) {
    throw new BadRequestException('Plant information is required');
  }
  if (typeof input.nickname !== 'string' || input.nickname.trim().length === 0) {
    throw new BadRequestException('Plant nickname is required');
  }
  const speciesId = positiveInteger(input.speciesId, 'Plant species is required');
  if (typeof input.acquisitionDate !== 'string' || !isValidDate(input.acquisitionDate)) {
    throw new BadRequestException('A valid acquisition date is required');
  }
  if (input.acquisitionDate > currentDate) {
    throw new BadRequestException('Acquisition date cannot be in the future');
  }
  if (input.notes !== null && input.notes !== undefined && typeof input.notes !== 'string') {
    throw new BadRequestException('Plant notes must be text');
  }
  return {
    nickname: input.nickname,
    speciesId,
    acquisitionDate: input.acquisitionDate,
    notes: typeof input.notes === 'string' && input.notes.length > 0 ? input.notes : null,
  };
}

async function requireActiveSpecies(
  manager: EntityManager,
  speciesId: number,
): Promise<void> {
  const species = await manager
    .getRepository(Species)
    .createQueryBuilder('species')
    .setLock('pessimistic_read')
    .where('species.id = :speciesId', { speciesId })
    .getOne();
  if (!species || species.archived) {
    throw new ConflictException('An active species is required');
  }
}

function statusFrom(input: unknown): PlantStatus {
  if (!isRecord(input) || !plantStatuses.includes(input.status as PlantStatus)) {
    throw new BadRequestException('A valid plant status is required');
  }
  return input.status as PlantStatus;
}

function locationIdFrom(input: unknown): number | null {
  if (!isRecord(input) || !Object.hasOwn(input, 'locationId')) {
    throw new BadRequestException('A location selection is required');
  }
  if (input.locationId === null) {
    return null;
  }
  return positiveInteger(input.locationId, 'A valid location is required');
}

function positiveInteger(value: unknown, message: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new BadRequestException(message);
  }
  return value;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toPlantView(plant: Plant): PlantView {
  return {
    id: plant.id,
    nickname: plant.nickname,
    acquisitionDate: plant.acquisitionDate,
    notes: plant.notes,
    status: plant.status,
    species: {
      id: plant.species.id,
      name: plant.species.name,
      archived: plant.species.archived,
    },
    location: plant.location
      ? { id: plant.location.id, name: plant.location.name }
      : null,
  };
}

function timestampString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    const timestamp = new Date(value);
    return Number.isNaN(timestamp.valueOf()) ? null : timestamp.toISOString();
  }
  return null;
}

function imageUrl(plantId: number, value: unknown): string | null {
  const imageId = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;
  return Number.isSafeInteger(imageId) && imageId > 0
    ? `/api/plants/${plantId}/images/${imageId}/content`
    : null;
}
