import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Plant } from '../plants/plant.entity';
import { CareEvent, careEventTypes, type CareEventType } from './care-event.entity';
import { CareRound } from '../care-rounds/care-round.entity';
import { CareRoundMember } from '../care-rounds/care-round-member.entity';

export interface CareEventView {
  id: number;
  plantId: number;
  type: CareEventType;
  timestamp: string;
  notes: string | null;
  fertilizerIncluded: boolean | null;
}

export interface CareEventPage {
  items: CareEventView[];
  page: number;
  pageSize: 10;
  total: number;
  totalPages: number;
}

interface CareEventInput {
  type: CareEventType;
  timestamp: Date;
  notes: string | null;
  fertilizerIncluded: boolean | null;
}

interface CorrectionInput {
  timestamp: Date;
  notes: string | null;
}

export class CareEventClock {
  now(): Date {
    return new Date();
  }
}

@Injectable()
export class CareEventsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly clock: CareEventClock,
  ) {}

  async create(plantId: number, input: unknown, roundId: number | null = null): Promise<CareEventView> {
    const values = careEventInputFrom(input, this.clock.now());
    return this.dataSource.transaction(async (manager) => {
      const plant = await lockPlant(manager, plantId, 'pessimistic_read');
      requireActivePlant(plant);
      if (roundId !== null) {
        const round = await manager.getRepository(CareRound).createQueryBuilder('round').setLock('pessimistic_write').where('round.id = :roundId', { roundId }).getOne();
        if (!round) throw new NotFoundException('Care round not found');
        if (round.status !== 'active') throw new ConflictException('Care round is already completed');
        const member = await manager.getRepository(CareRoundMember).findOneBy({ roundId, position: round.currentIndex });
        if (!member || member.plantId !== plantId) throw new ConflictException('The plant is not the current care-round plant');
      }
      const repository = manager.getRepository(CareEvent);
      const event = await repository.save(repository.create({ plantId, roundId, ...values }));
      return toCareEventView(event);
    });
  }

  async list(plantId: number, requestedPage: string | undefined): Promise<CareEventPage> {
    const requested = pageFrom(requestedPage);
    const plant = await this.dataSource.getRepository(Plant).findOneBy({ id: plantId });
    if (!plant) {
      throw new NotFoundException('Plant not found');
    }
    const repository = this.dataSource.getRepository(CareEvent);
    const total = await repository.countBy({ plantId });
    const totalPages = Math.ceil(total / 10);
    const page = Math.min(requested, Math.max(totalPages, 1));
    const events = await repository.find({
      where: { plantId },
      order: { timestamp: 'DESC', id: 'DESC' },
      skip: (page - 1) * 10,
      take: 10,
    });
    return {
      items: events.map(toCareEventView),
      page,
      pageSize: 10,
      total,
      totalPages,
    };
  }

  async correct(plantId: number, eventId: number, input: unknown): Promise<CareEventView> {
    const values = correctionInputFrom(input, this.clock.now());
    return this.dataSource.transaction(async (manager) => {
      const plant = await lockPlant(manager, plantId, 'pessimistic_write');
      requireActivePlant(plant);
      const event = await manager
        .getRepository(CareEvent)
        .createQueryBuilder('event')
        .setLock('pessimistic_write')
        .where('event.id = :eventId AND event.plantId = :plantId', { eventId, plantId })
        .getOne();
      if (!event) {
        throw new NotFoundException('Care event not found');
      }
      if (
        event.timestamp.valueOf() === values.timestamp.valueOf() &&
        event.notes === values.notes
      ) {
        return toCareEventView(event);
      }
      event.timestamp = values.timestamp;
      event.notes = values.notes;
      return toCareEventView(await manager.getRepository(CareEvent).save(event));
    });
  }

  async remove(plantId: number, eventId: number): Promise<{ removedEventId: number }> {
    return this.dataSource.transaction(async (manager) => {
      const plant = await lockPlant(manager, plantId, 'pessimistic_write');
      requireActivePlant(plant);
      const repository = manager.getRepository(CareEvent);
      const event = await repository
        .createQueryBuilder('event')
        .setLock('pessimistic_write')
        .where('event.id = :eventId AND event.plantId = :plantId', { eventId, plantId })
        .getOne();
      if (!event) {
        throw new NotFoundException('Care event not found');
      }
      await repository.remove(event);
      return { removedEventId: eventId };
    });
  }
}

function careEventInputFrom(input: unknown, now: Date): CareEventInput {
  if (!isRecord(input)) {
    throw new BadRequestException('A valid care event type is required');
  }
  const type = input.type === undefined ? 'observation' : input.type as CareEventType;
  if (!careEventTypes.includes(type)) {
    throw new BadRequestException('A valid care event type is required');
  }
  const common = commonInputFrom(input, now, type === 'observation' ? 'Observation' : 'Care event');
  if (type === 'watering') {
    if (input.fertilizerIncluded !== undefined && typeof input.fertilizerIncluded !== 'boolean') {
      throw new BadRequestException('Fertilizer selection must be true or false');
    }
  } else if (input.fertilizerIncluded !== undefined) {
    throw new BadRequestException('Fertilizer information only belongs to watering events');
  }
  return {
    type,
    ...common,
    fertilizerIncluded: type === 'watering' ? input.fertilizerIncluded === true : null,
  };
}

function correctionInputFrom(input: unknown, now: Date): CorrectionInput {
  if (!isRecord(input)) {
    throw new BadRequestException('Corrected care event information is required');
  }
  return commonInputFrom(input, now, 'Care event');
}

function commonInputFrom(input: Record<string, unknown>, now: Date, label: string): CorrectionInput {
  if (typeof input.timestamp !== 'string') {
    throw new BadRequestException(`A valid ${label.toLowerCase()} timestamp is required`);
  }
  const timestamp = new Date(input.timestamp);
  if (Number.isNaN(timestamp.valueOf())) {
    throw new BadRequestException(`A valid ${label.toLowerCase()} timestamp is required`);
  }
  if (timestamp.valueOf() > now.valueOf()) {
    throw new BadRequestException(`${label} timestamp cannot be in the future`);
  }
  if (input.notes !== null && input.notes !== undefined && typeof input.notes !== 'string') {
    throw new BadRequestException(`${label} notes must be text`);
  }
  return {
    timestamp,
    notes: typeof input.notes === 'string' && input.notes.length > 0 ? input.notes : null,
  };
}

async function lockPlant(
  manager: EntityManager,
  plantId: number,
  lock: 'pessimistic_read' | 'pessimistic_write',
): Promise<Plant> {
  const plant = await manager
    .getRepository(Plant)
    .createQueryBuilder('plant')
    .setLock(lock)
    .where('plant.id = :plantId', { plantId })
    .getOne();
  if (!plant) {
    throw new NotFoundException('Plant not found');
  }
  return plant;
}

function requireActivePlant(plant: Plant): void {
  if (plant.status !== 'active') {
    throw new ConflictException('Only active plants can receive care events');
  }
}

function pageFrom(value: string | undefined): number {
  if (value === undefined) return 1;
  if (!/^\d+$/.test(value)) throw new BadRequestException('Page must be a positive integer');
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new BadRequestException('Page must be a positive integer');
  }
  return page;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toCareEventView(event: CareEvent): CareEventView {
  return {
    id: event.id,
    plantId: event.plantId,
    type: event.type,
    timestamp: event.timestamp.toISOString(),
    notes: event.notes,
    fertilizerIncluded: event.fertilizerIncluded,
  };
}
