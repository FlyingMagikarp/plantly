import type {PlacementType, EventType} from '~/common/types/enums'

export interface ISpeciesOverviewDtoData {
  speciesId: number;
  commonName: string;
  latinName: string;
  lc: string;
}

export interface ISpeciesDtoData {
  speciesId: number;
  latinName: string;
}

export interface ICareTipDtoData {
  id: number;
  species: ISpeciesDtoData;
  placement: PlacementType;
  winterHardy: boolean;
  optimalTempMinC: number;
  optimalTempMaxC: number;
  wateringFrequencyDays: number;
  wateringNotes: string;
  fertilizingFrequencyDays: number;
  fertilizingType: string;
  fertilizingNotes: string;
  repottingCycleMonths: number;
  growingSeasonStart: number;
  growingSeasonEnd: number;
  dormantSeasonStart: number;
  dormantSeasonEnd: number;
  pruningNotes: string;
  pruningMonths: number[];
  wiringNotes: string;
  wiringMonths: number[];
  propagationNotes: string;
  propagationMonths: number[];
  pests: string;
  notes: string;
  soil: string;
}

export interface INameLcPair {
  commonName: string;
  lc: string;
}

export interface IPlantDtoData {
  id: number;
  speciesId: number;
  speciesLatinName: string;
  nickname: string;
  acquiredAt: string;
  locationId: number;
  locationName: string;
  notes: string;
  removed: boolean;
  died: boolean;
  inactiveReason: string;
  inactiveDate: string;
  checkFreq: number;
}

export interface ILocationDtoData {
  id: number;
  name: string;
  description: string;
}

export interface ICareLogDtoData {
  id: number;
  plantId: number;
  plantNickname: string;
  plantSpecies: string;
  plantLocation: string;
  eventType: EventType;
  eventDate: string;
  notes: string;
}
