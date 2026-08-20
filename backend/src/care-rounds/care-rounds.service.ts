import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, IsNull } from 'typeorm';
import { Location } from '../locations/location.entity';
import { Plant } from '../plants/plant.entity';
import { CareRoundMember } from './care-round-member.entity';
import { CareRound } from './care-round.entity';

export interface CareRoundOption { locationId: number | null; name: string; plantCount: number }
export interface CareRoundMemberView { position: number; plantId: number | null; nickname: string; speciesName: string; available: boolean }
export interface CareRoundView { id: number; status: 'active' | 'completed'; locationId: number | null; locationName: string; currentIndex: number; members: CareRoundMemberView[]; summary: CareRoundMemberView[] }

@Injectable()
export class CareRoundsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async options(): Promise<CareRoundOption[]> {
    const locations = await this.dataSource.getRepository(Location).createQueryBuilder('location')
      .innerJoin(Plant, 'plant', 'plant.locationId = location.id AND plant.status = :status', { status: 'active' })
      .select(['location.id AS "locationId"', 'location.name AS name', 'COUNT(plant.id)::int AS "plantCount"'])
      .groupBy('location.id').addGroupBy('location.name').orderBy('location.id', 'ASC').getRawMany<CareRoundOption>();
    const unassigned = await this.dataSource.getRepository(Plant).countBy({ status: 'active', locationId: IsNull() });
    return [...locations, ...(unassigned > 0 ? [{ locationId: null, name: 'No location', plantCount: unassigned }] : [])];
  }

  async active(): Promise<CareRoundView | null> {
    const round = await this.dataSource.getRepository(CareRound).findOneBy({ status: 'active' });
    return round ? this.view(round) : null;
  }

  async find(id: number): Promise<CareRoundView> {
    const round = await this.dataSource.getRepository(CareRound).findOneBy({ id });
    if (!round) throw new NotFoundException('Care round not found');
    return this.view(round);
  }

  async start(input: unknown): Promise<CareRoundView> {
    const locationId = selectionFrom(input);
    return this.dataSource.transaction(async (manager) => {
      const active = await manager.getRepository(CareRound).createQueryBuilder('round').setLock('pessimistic_write').where('round.status = :status', { status: 'active' }).getOne();
      if (active) throw new ConflictException('A care round is already active');
      let locationName: string | null = null;
      if (locationId !== null) {
        const location = await manager.getRepository(Location).findOneBy({ id: locationId });
        if (!location) throw new NotFoundException('Location not found');
        locationName = location.name;
      }
      const plants = await manager.getRepository(Plant).find({ where: { status: 'active', locationId: locationId === null ? IsNull() : locationId }, relations: { species: true }, order: { id: 'ASC' } });
      if (plants.length === 0) throw new ConflictException('No active plants are available for this care round');
      const rounds = manager.getRepository(CareRound);
      const round = await rounds.save(rounds.create({ locationId, locationName, status: 'active', currentIndex: 0, completedAt: null }));
      await manager.getRepository(CareRoundMember).save(plants.map((plant, position) => ({ roundId: round.id, plantId: plant.id, position, plantNickname: plant.nickname, speciesName: plant.species.name })));
      return this.viewWithManager(manager, round);
    });
  }

  async move(id: number, input: unknown): Promise<CareRoundView> {
    const direction = directionFrom(input);
    return this.dataSource.transaction(async (manager) => {
      const round = await this.lockActive(manager, id);
      const count = await manager.getRepository(CareRoundMember).countBy({ roundId: id });
      round.currentIndex = direction === 'next' ? Math.min(round.currentIndex + 1, count) : Math.max(round.currentIndex - 1, 0);
      await manager.getRepository(CareRound).save(round);
      return this.viewWithManager(manager, round);
    });
  }

  async complete(id: number): Promise<CareRoundView> {
    return this.dataSource.transaction(async (manager) => {
      const round = await this.lockActive(manager, id);
      round.status = 'completed'; round.completedAt = new Date();
      await manager.getRepository(CareRound).save(round);
      return this.viewWithManager(manager, round);
    });
  }

  private async lockActive(manager: EntityManager, id: number): Promise<CareRound> {
    const round = await manager.getRepository(CareRound).createQueryBuilder('round').setLock('pessimistic_write').where('round.id = :id', { id }).getOne();
    if (!round) throw new NotFoundException('Care round not found');
    if (round.status !== 'active') throw new ConflictException('Care round is already completed');
    return round;
  }

  private view(round: CareRound): Promise<CareRoundView> { return this.viewWithManager(this.dataSource.manager, round); }
  private async viewWithManager(manager: EntityManager, round: CareRound): Promise<CareRoundView> {
    const members = await manager.getRepository(CareRoundMember).find({ where: { roundId: round.id }, relations: { plant: true }, order: { position: 'ASC' } });
    const caredPlantIds = new Set((await manager.query<Array<{ plant_id: number | null }>>('SELECT DISTINCT plant_id FROM care_events WHERE round_id = $1', [round.id])).map((row) => row.plant_id));
    const views = members.map((member) => ({ position: member.position, plantId: member.plantId, nickname: member.plantNickname, speciesName: member.speciesName, available: member.plant?.status === 'active' }));
    return { id: round.id, status: round.status, locationId: round.locationId, locationName: round.locationName ?? 'No location', currentIndex: round.currentIndex, members: views, summary: views.filter((member) => member.plantId !== null && caredPlantIds.has(member.plantId)) };
  }
}

function selectionFrom(input: unknown): number | null {
  if (typeof input !== 'object' || input === null || !Object.hasOwn(input, 'locationId')) throw new ConflictException('A care-round location is required');
  const value = (input as { locationId: unknown }).locationId;
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) throw new ConflictException('A valid care-round location is required');
  return value;
}
function directionFrom(input: unknown): 'next' | 'previous' {
  const value = typeof input === 'object' && input !== null ? (input as { direction?: unknown }).direction : undefined;
  if (value !== 'next' && value !== 'previous') throw new ConflictException('A valid care-round direction is required');
  return value;
}
